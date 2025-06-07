import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BreathingGame = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const breathingAnimation = useState(new Animated.Value(1))[0];

  const startBreathing = () => {
    setIsBreathing(true);
    setSecondsPlayed(0); // Reset the timer when starting
    startAnimation();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    stopAnimation();
    Alert.alert('Exercise Complete', `You exercised for ${secondsPlayed} seconds.`);
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathingAnimation, {
          toValue: 1.5,
          duration: 4000, // Inhale
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(breathingAnimation, {
          toValue: 1,
          duration: 4000, // Exhale
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopAnimation = () => {
    breathingAnimation.stopAnimation();
  };

  useEffect(() => {
    let timer;

    if (isBreathing) {
      timer = setInterval(() => {
        setSecondsPlayed((prev) => prev + 1);
      }, 1000); // Update every second
    }

    return () => {
      clearInterval(timer); // Cleanup on unmount or stop
    };
  }, [isBreathing]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Text style={styles.title}>Breathing Exercise</Text>
      <Text style={styles.instructions}>
        {isBreathing ? 'Inhale... Hold... Exhale...' : 'Press the button to start the breathing exercise.'}
      </Text>

      <Animated.View
        style={[
          styles.breathingCircle,
          { transform: [{ scale: breathingAnimation }] },
        ]}
      />

      <TouchableOpacity style={styles.button} onPress={isBreathing ? stopBreathing : startBreathing}>
        <Text style={styles.buttonText}>{isBreathing ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>

      {isBreathing && (
        <Text style={styles.timerText}>
          Timer: {formatTime(secondsPlayed)}
        </Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFC107',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});

export default BreathingGame;
