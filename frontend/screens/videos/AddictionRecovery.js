import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Video } from 'expo-av'; // Import Video from expo-av
import { LinearGradient } from 'expo-linear-gradient'; // Gradient Background
import { createClient } from '@supabase/supabase-js';

// Supabase Credentials
const SUPABASE_URL = 'https://iijifqukxcaqtegmytby.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpamlmcXVreGNhcXRlZ215dGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzAyODUsImV4cCI6MjA1MDY0NjI4NX0.TwPfc9auajcjKmOubz4iaHXVvTDLLzaGYhyh6wPB4x4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AddictionRecovery() {
    const [videos, setVideos] = useState([]);

    // Fetch Videos from Supabase
    async function getAddictionRecoveryVideos() {
        const { data, error } = await supabase
            .storage
            .from('videos')
            .list('Addiction Recovery', { limit: 10, offset: 0 });

        if (error) {
            console.error('Error fetching videos:', error);
        } else {
            const videoUrls = data.map((file) => ({
                name: file.name,
                url: supabase.storage
                    .from('videos')
                    .getPublicUrl(`Addiction Recovery/${file.name}`).data.publicUrl,
            }));
            setVideos(videoUrls); // Set videos state with the URLs
        }
    }

    useEffect(() => {
        getAddictionRecoveryVideos();
    }, []);

    // Render each video
    const renderItem = ({ item }) => {
        return (
            <LinearGradient
                colors={['#43cea2', '#185a9d']} // Gradient colors (Green to Blue)
                style={styles.videoContainer}
            >
                <Video
                    source={{ uri: item.url }} // Public URL of the video
                    style={styles.video}
                    useNativeControls // Use native video controls
                    resizeMode="contain" // Adjust the video size
                    isLooping // Optional: Loop the video
                />
                <Text style={styles.videoTitle}>{item.name}</Text>
            </LinearGradient>
        );
    };

    return (
        <LinearGradient
            colors={['#185a9d', '#43cea2']} // Background gradient colors
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#185a9d" />
                {/* <ScrollView> */}
                    <Text style={styles.heading}>Addiction Recovery</Text>
                    <FlatList
                        data={videos}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.name}
                    />
                {/* </ScrollView> */}
            </SafeAreaView>
        </LinearGradient>
    );
}

// Styles
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 10, // Avoid status bar collision
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.2)', // Transparent black background for heading
        borderRadius: 10,
        marginHorizontal: 20,
    },
    videoContainer: {
        margin: 10,
        borderRadius: 15, // Rounded corners
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5, // Android shadow
    },
    video: {
        width: Dimensions.get('window').width - 40, // Full width minus padding
        height: 200, // Set height for video
        borderRadius: 10, // Rounded corners
        backgroundColor: '#000', // Black video background
    },
    videoTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // White text
        textAlign: 'center',
    },
});
