import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Animated } from "react-native-animatable";

const CardComponent = () => {
  return (
    <View style={styles.outer}>
      <Animated.View style={styles.dot} />
      <View style={styles.card}>
        <View style={styles.ray} />
        <Text style={styles.text}>750k</Text>
        <Text style={styles.label}>Views</Text>
        <View style={[styles.line, styles.topLine]} />
        <View style={[styles.line, styles.leftLine]} />
        <View style={[styles.line, styles.bottomLine]} />
        <View style={[styles.line, styles.rightLine]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: 300,
    height: 250,
    borderRadius: 10,
    padding: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden', // To contain the dot animation
  },
  dot: {
    width: 5,
    height: 5,
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
    right: '10%',
    top: '10%',
    shadowColor: '#ffffff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#202222',
    backgroundColor: 'rgba(68, 68, 68, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'column',
    color: '#fff',
  },
  ray: {
    width: 220,
    height: 45,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: '#c7c7c7',
    opacity: 0.4,
    shadowColor: '#fff',
    shadowRadius: 50,
    top: 0,
    left: 0,
    transform: [{ rotate: '40deg' }],
  },
  text: {
    fontWeight: 'bold',
    fontSize: 48,
    backgroundColor: 'transparent',
    background: 'linear-gradient(45deg, #000000 4%, #fff, #000)', // This won't work in React Native
    color: 'transparent',
    // You might need to handle the gradient text differently, using libraries or custom components
  },
  label: {
    color: '#fff',
  },
  line: {
    position: 'absolute',
    backgroundColor: '#2c2c2c',
  },
  topLine: {
    top: '10%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#888888',
  },
  bottomLine: {
    bottom: '10%',
    left: 0,
    right: 0,
    height: 1,
  },
  leftLine: {
    left: '10%',
    width: 1,
    height: '100%',
    backgroundColor: '#747474',
  },
  rightLine: {
    right: '10%',
    width: 1,
    height: '100%',
  },
});

// Note: The dot animation using CSS keyframes will not directly translate to React Native.
// You may want to implement a similar effect using React Native's animation libraries (like `Animated` or `react-native-reanimated`).

export default CardComponent;
