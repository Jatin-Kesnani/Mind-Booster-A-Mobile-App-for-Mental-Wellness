import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // For camera and gallery icons
import { ip } from '../utils/ip';

const UserProfile = ({ navigation, route }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // To control popup visibility
  const { username, userId } = route.params || {};
  const [userData, setUserData] = useState({ username: '', email: '' });

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
      setUserData({ username: userData.username, email: userData.email });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSave = async (newProfilePic) => {
    const userData = { username, profilePic: newProfilePic };

    try {
      const response = await fetch(`http://${ip}:5000/api/auth/user/profile-pic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleChooseImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to allow access to your photos.');
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!pickerResult.canceled) {
        const newProfilePic = pickerResult.assets[0].uri;
        setProfilePic(newProfilePic);
        handleSave(newProfilePic); // Automatically save the new profile picture
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to allow access to your camera.');
        return;
      }
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!cameraResult.canceled) {
        const newProfilePic = cameraResult.assets[0].uri;
        setProfilePic(newProfilePic);
        handleSave(newProfilePic); // Automatically save the new profile picture
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  return (
    <LinearGradient colors={['#FFCC00', '#FFA500']} style={styles.gradient}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home', { username, userId })}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
        >
          <MaterialIcons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <View>
            <Image
              source={profilePic ? { uri: profilePic } : require('../assests/images/brain.jpeg')}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => setShowPopup(true)}
            >
              <Ionicons name="camera" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="heart-outline" size={30} color="black" />
              <Text style={styles.menuText}>Favourites</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="download-outline" size={30} color="black" />
              <Text style={styles.menuText}>Downloads</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="language-outline" size={30} color="black" />
              <Text style={styles.menuText}>Languages</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('googlemap')} style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="location-outline" size={30} color="black" />
              <Text style={styles.menuText}>Location</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="card-outline" size={30} color="black" />
              <Text style={styles.menuText}>Subscription</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="desktop-outline" size={30} color="black" />
              <Text style={styles.menuText}>Display</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="trash-outline" size={30} color="black" />
              <Text style={styles.menuText}>Clear Cache</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="time-outline" size={30} color="black" />
              <Text style={styles.menuText}>Clear History</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.card}>
            <View style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={30} color="black" />
              <Text style={styles.menuText}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.popupContainer}>
          <TouchableOpacity
            style={styles.popupOption}
            onPress={() => {
              handleTakePhoto();
              setShowPopup(false);
            }}
          >
            <Ionicons name="camera" size={30} color="white" />
            <Text style={styles.popupText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popupOption}
            onPress={() => {
              handleChooseImage();
              setShowPopup(false);
            }}
          >
            <Ionicons name="image" size={30} color="white" />
            <Text style={styles.popupText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    justifyContent: 'center', 
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingTop: 40,
  },
  settingsButton: { 
    position: 'absolute',
    right: 20,
    paddingTop: 40,
  },
  container: {
    padding: 20,
  },
  imageContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFCC00',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  userInfo: { marginLeft: 15 },
  username: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 18, color: 'gray' },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCC00',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    justifyContent: 'center',
  },
  popupText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  menu: { marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // iOS Shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    opacity: 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
});

export default UserProfile;