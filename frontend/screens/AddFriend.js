import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ip } from '../utils/ip';

export default function AddFriend ({ route, navigation }) {
  const [state, setState] = useState({
    users: [],
    friends: [],
    friendIds: new Set(),
    searchQuery: '',
    filteredUsers: [],
    loading: true,
    loadingFriends: false,
    showFriends: false,
    successMessage: '',
    errorMessage: ''
  });

  const { userId, username } = route.params; 

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${ip}:5000/api/auth/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setState(prevState => ({
          ...prevState,
          users: data,
          filteredUsers: data,
          loading: false
        }));
      } catch (error) {
        setState(prevState => ({ ...prevState, errorMessage: error.message, loading: false }));
      }
    };
    fetchFriends();
    fetchUsers();
  }, []);

  // Fetch user's friends
  const fetchFriends = async () => {
    setState(prevState => ({ ...prevState, loadingFriends: true }));
    try {
      const response = await fetch(`http://${ip}:5000/api/auth/get-friends/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      const friendIds = new Set(data.map(friend => friend._id));
      setState(prevState => ({
        ...prevState,
        friends: data,
        friendIds,
        loadingFriends: false
      }));
    } catch (error) {
      setState(prevState => ({ ...prevState, errorMessage: error.message, loadingFriends: false }));
    }
  };

  // Handle search query change with debounce
  const handleSearch = (query) => {
    setState(prevState => ({ ...prevState, searchQuery: query }));
    const filtered = state.users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setState(prevState => ({ ...prevState, filteredUsers: filtered }));
  };

  // Add a user as a friend with confirmation
  const addFriend = async (friendId) => {
    Alert.alert(
      "Add Friend",
      "Are you sure you want to add this user as a friend?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            try {
              const response = await fetch(`http://${ip}:5000/api/auth/add-friend`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendId }),
              });

              if (response.ok) {
                const result = await response.json();
                setState(prevState => ({
                  ...prevState,
                  successMessage: result.message || 'Friend added successfully!',
                  errorMessage: '',
                }));
                fetchFriends(); // Refresh friends list after adding
                setTimeout(() => setState(prevState => ({ ...prevState, successMessage: '' })), 3000); 
              } else {
                const errorData = await response.json();
                setState(prevState => ({
                  ...prevState,
                  errorMessage: errorData.message || 'Failed to add friend.',
                  successMessage: '',
                }));
                setTimeout(() => setState(prevState => ({ ...prevState, errorMessage: '' })), 3000);
              }
            } catch (error) {
              setState(prevState => ({
                ...prevState,
                errorMessage: 'An unexpected error occurred.',
                successMessage: '',
              }));
              setTimeout(() => setState(prevState => ({ ...prevState, errorMessage: '' })), 3000);
            }
          }
        }
      ]
    );
  };

  // Remove a friend
  const removeFriend = async (friendId) => {
    Alert.alert(
      "Remove Friend",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            try {
              const response = await fetch(`http://${ip}:5000/api/auth/remove-friend`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendId }),
              });

              if (response.ok) {
                const result = await response.json();
                setState(prevState => ({
                  ...prevState,
                  successMessage: result.message || 'Friend removed successfully!',
                  errorMessage: '',
                }));
                fetchFriends(); // Refresh friends list after removing
                setTimeout(() => setState(prevState => ({ ...prevState, successMessage: '' })), 3000); 
              } else {
                const errorData = await response.json();
                setState(prevState => ({
                  ...prevState,
                  errorMessage: errorData.message || 'Failed to remove friend.',
                  successMessage: '',
                }));
                setTimeout(() => setState(prevState => ({ ...prevState, errorMessage: '' })), 3000);
              }
            } catch (error) {
              setState(prevState => ({
                ...prevState,
                errorMessage: 'An unexpected error occurred.',
                successMessage: '',
              }));
              setTimeout(() => setState(prevState => ({ ...prevState, errorMessage: '' })), 3000);
            }
          }
        }
      ]
    );
  };

  // Navigate to chat page
  const navigateToChat = (friendId, username) => {
    navigation.navigate('Chat', { friendId, userId, username });
  };

  if (state.loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Friend</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
  
      {state.successMessage ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>{state.successMessage}</Text>
        </View>
      ) : null}

      {state.errorMessage ? (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{state.errorMessage}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.searchInput}
        placeholder="Search for users"
        value={state.searchQuery}
        onChangeText={handleSearch}
      />

      <TouchableOpacity 
        style={styles.viewFriendsButton} 
        onPress={() => {
          if (!state.showFriends) fetchFriends();
          setState(prevState => ({ ...prevState, showFriends: !prevState.showFriends })); 
        }}
      >
        <Text style={styles.viewFriendsButtonText}>
          {state.showFriends ? 'Hide Friends' : 'View My Friends'}
        </Text>
      </TouchableOpacity>

      {state.showFriends ? (
        state.loadingFriends ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <FlatList
            data={state.friends}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userName}>{item.username}</Text>
                <View style={styles.friendActions}>
                  <TouchableOpacity 
                    style={styles.chatButton} 
                    onPress={() => navigateToChat(item._id, item.username)}
                  >
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.removeFriendButton} 
                    onPress={() => removeFriend(item._id)}
                  >
                    <Text style={styles.removeFriendButtonText}>Remove Friend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id.toString()}
          />
        )
      ) : (
        <FlatList
          data={state.filteredUsers}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userName}>{item.username}</Text>
              {!state.friendIds.has(item._id) ? (
                <TouchableOpacity 
                  style={styles.addFriendButton} 
                  onPress={() => addFriend(item._id)}
                >
                  <Text style={styles.addFriendButtonText}>Add as Friend</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.friendLabel}>Already a Friend</Text>
              )}
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  successMessageContainer: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successMessageText: {
    color: '#fff',
  },
  errorMessageContainer: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorMessageText: {
    color: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  viewFriendsButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  viewFriendsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  userName: {
    fontSize: 18,
  },
  friendActions: {
    flexDirection: 'row',
  },
  chatButton: {
    backgroundColor: '#28A745',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  chatButtonText: {
    color: '#fff',
  },
  removeFriendButton: {
    backgroundColor: '#DC3545',
    padding: 5,
    borderRadius: 5,
  },
  removeFriendButtonText: {
    color: '#fff',
  },
  addFriendButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  addFriendButtonText: {
    color: '#fff',
  },
  friendLabel: {
    color: '#6c757d',
  },
});