import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ip } from '../utils/ip'; // Replace with your local or deployed IP
import { LinearGradient } from 'expo-linear-gradient';

const CommunityScreen = ({ route }) => {
  const { userId, username } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // To track selected image for full-screen view

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${ip}:5000/api/communityR/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image picking (camera or gallery)
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Set the selected image URI
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Upload the selected image to the server
  const uploadImage = async () => {
    if (!imageUri) return;

    try {
      const formData = { username, imagePath: imageUri };
      const response = await fetch(`http://${ip}:5000/api/communityR/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts after upload
        setImageUri(null); // Clear the image after posting
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Format the timestamp to a readable string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Render each post
  const renderPost = ({ item }) => {
    const isCurrentUser = item.username === username; // Check if the post belongs to the logged-in user

    // Format the date correctly
    const timestamp = formatDate(item.currentDateTime);

    // Make sure the image is a valid URL (consider hosting the images if needed)
    const imageUrl = item.imagePath.startsWith('file://') ? item.imagePath : `http://${ip}/path/to/images/${item.imagePath}`;

    return (
      <View style={[styles.postContainer, isCurrentUser ? styles.postRight : styles.postLeft]}>
        <View style={styles.postContent}>
          <Text style={styles.username}>{item.username}</Text>
          <TouchableOpacity onPress={() => setSelectedImage(imageUrl)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    );
  };

  // Close the modal when clicking outside the image
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <LinearGradient colors={['purple', 'black', 'white']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Community</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()} // Using index as the key
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No posts yet. Be the first to post!</Text>}
      />
      {/* Image upload section */}
      {imageUri && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.uploadButtonText}>Post Image</Text>
          </TouchableOpacity>
        </View>
      )}
      {!imageUri && (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Post an Image</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />}

      {/* Modal for full-screen image view */}
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalContainer}>
              <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </LinearGradient>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: StatusBar.currentHeight || 0 },
  header: { padding: 16, alignItems: 'center' },
  headerText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  postsList: { paddingHorizontal: 16, paddingBottom: 80 },
  postContainer: { borderRadius: 8, padding: 10, marginVertical: 10, maxWidth: '80%' },
  postLeft: { alignSelf: 'flex-start', backgroundColor: '#E1F5FE', borderRadius: 10, paddingLeft: 10 },
  postRight: { alignSelf: 'flex-end', backgroundColor: '#C8E6C9', borderRadius: 10, paddingRight: 10 },
  postContent: { flexDirection: 'column', alignItems: 'center', maxWidth: 220 },
  username: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 8 },
  timestamp: { fontSize: 12, color: '#757575', marginTop: 5 },
  uploadButton: { position: 'absolute', bottom: 20, right: '30%', backgroundColor: '#6200EE', borderRadius: 50, paddingVertical: 12, paddingHorizontal: 24, elevation: 5 },
  uploadButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#757575', fontSize: 16, marginTop: 20 },
  loader: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] },
  imagePreview: { marginTop: 20, alignItems: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for modal
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Keep aspect ratio intact
  },
});
