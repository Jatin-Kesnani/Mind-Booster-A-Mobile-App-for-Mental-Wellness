import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ip } from '../utils/ip';


const Chat = ({ route, navigation }) => {
  const { friendId, userId, username } = route.params;
  const [profilePic, setProfilePic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(false);
  const flatListRef = useRef(null);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://${ip}:5000/api/auth/user/${username}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const userData = await response.json();
      setProfilePic(userData.profilePic);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages(userId, friendId);
    }, 3000); // Poll every 3 seconds
  
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [userId, friendId]);
  

  const fetchMessages = async (userId, friendId) => {
    try {
      const response = await fetch(`http://${ip}:5000/api/messages/getmsg/${userId}?friendId=${friendId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      setError('Error fetching messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        sender: userId,
        receiverId: friendId,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch(`http://${ip}:5000/api/messages/sendmsg?senderId=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        if (!response.ok) {
          setError('Failed to send message.');
        } else {
          const sentMessage = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...message, _id: sentMessage._id },
          ]);
          setNewMessage('');
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } catch (error) {
        setError('Error sending message.');
      }
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }
  };

  const startRecording = async () => {
    await requestPermissions();
    setRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('recording', e.currentPosition);
    });
    console.log(result);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecording(false);
    handleSendVoiceMessage(result);
  };

  const handleSendVoiceMessage = async (audioPath) => {
    const message = {
      sender: userId,
      receiverId: friendId,
      audioPath,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`http://${ip}:5000/api/messages/sendmsg?senderId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        setError('Failed to send voice message.');
      } else {
        const sentMessage = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, _id: sentMessage._id, type: 'audio' },
        ]);
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      setError('Error sending voice message.');
    }
  };

  const playVoiceNote = async (audioPath) => {
    await audioRecorderPlayer.startPlayer(audioPath);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === userId ? styles.userMessageContainer : styles.friendMessageContainer,
    ]}>
      {item.text ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : item.audioPath ? (
        <TouchableOpacity onPress={() => playVoiceNote(item.audioPath)}>
          <Text style={styles.audioMessageText}>Play Voice Note</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['black', 'green']} style={styles.gradient}>
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Image
          source={profilePic ? { uri: profilePic } : require('../assests/images/brain.jpeg')} 
          style={styles.profilePic} 
        />
        
        <Text style={styles.friendName}>{username}</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="video-call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1, justifyContent: 'flex-end' }}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.voiceButton}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <Icon name="mic" size={24} color="#fff" />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('camera')} // Navigate to CameraComponent
          style={styles.cameraButton}
        >
          <Icon name="camera-alt" size={48} color="#FFC107"  />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: 'lightgreen',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    position: 'relative',
    paddingTop: 40,
  },
  profilePic: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    marginLeft: 10,
  },
  friendName: {
    position: 'relative',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 40,
    paddingLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    position:'absolute',
    right: 10,
  },
  iconButton: {
    marginLeft: 15,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFC107', // Send button color
    borderRadius: 20,
    padding: 10,
  },
  voiceButton: {
    backgroundColor: '#FFC107', // Voice button color
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
    marginHorizontal: 10,
    backgroundColor: '#f3f3f3',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFC107', // User message bubble color
  },
  friendMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgray', // Friend message bubble color
  },
  messageText: {
    color: '#fff', // Message text color
  },
  audioMessageText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  timestampText: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Chat;