import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BubblePopGame = ({ navigation }) => {
  const [bubbles, setBubbles] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);

  // Function to generate bubbles
  const generateBubble = () => {
    const newBubble = {
      id: Date.now(),
      left: Math.random() * 300, // Random position within screen width
      top: Math.random() * 500, // Random position within screen height
    };
    setBubbles((prev) => [...prev, newBubble]);

    // Remove the bubble after 2 seconds
    setTimeout(() => {
      setBubbles((prev) => prev.filter((bubble) => bubble.id !== newBubble.id));
    }, 2000);
  };

  useEffect(() => {
    setStartTime(Date.now());

    // Generate a new bubble every second
    const bubbleInterval = setInterval(generateBubble, 1000);
    
    return () => {
      clearInterval(bubbleInterval);
      const endTime = Date.now();
      const gameDuration = Math.floor((endTime - startTime) / 1000); // Calculate duration in seconds
      navigation.navigate('Home', { gameDuration }); // Pass duration back to Home
    };
  }, []);

  const popBubble = (id) => {
    setScore(score + 1);
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id)); // Remove popped bubble
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Text style={styles.title}>Bubble Pop Game!</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {bubbles.map((bubble) => (
        <TouchableOpacity
          key={bubble.id}
          style={[styles.bubble, { left: bubble.left, top: bubble.top }]}
          onPress={() => popBubble(bubble.id)}
        />
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  bubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default BubblePopGame;
