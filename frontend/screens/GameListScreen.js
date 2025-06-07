import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ip } from '../utils/ip';
import { LinearGradient } from 'expo-linear-gradient';

const GameList = ({ route, navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const { username, userId } = route.params || {};

  // Function to fetch games from the API
  const fetchGames = async () => {
    try {
      const response = await fetch(`http://${ip}:5000/api/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      console.log(data);
      setGames(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Handle game selection
  const handleGameSelect = (gameName) => {
    const selectedGameObject = games.find((game) => game.gameName === gameName);
    if (selectedGameObject) {
      const { _id: gameId } = selectedGameObject;
      setSelectedGame(gameName);
      navigation.navigate(gameName, { gameId, username, userId });
    }
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Image
        source={require('../assests/images/idea.png')} // Use require for local images
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Game Central</Text>
      <Text style={styles.subtitle}>Choose your favorite game and get started!</Text>
      <Picker
        selectedValue={selectedGame}
        onValueChange={handleGameSelect}
        style={styles.picker}
      >
        <Picker.Item label="Select a game" value={null} />
        {games.length > 0 ? (
          games.map((game) => (
            <Picker.Item key={game._id} label={game.gameName} value={game.gameName} />
          ))
        ) : (
          <Picker.Item label="No games available" value={null} />
        )}
      </Picker>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Get ready for an exciting journey through our handpicked collection of games.
        </Text>
      </View>
      <Image
        source={require('../assests/images/mind_games1.png')} // Use require for local images
        style={styles.placeholderImage}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 40,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
  infoBox: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default GameList;
