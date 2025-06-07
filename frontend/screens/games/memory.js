import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const cardsArray = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
  { id: 3, value: 'C' },
  { id: 4, value: 'D' },
  { id: 5, value: 'E' },
  { id: 6, value: 'F' },
];

const MemoryCardGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [points, setPoints] = useState(0);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards = [...cardsArray, ...cardsArray].map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`, // Ensure each card has a unique identifier
    }));
    setCards(duplicatedCards.sort(() => Math.random() - 0.5)); // Shuffle cards
    setFlippedCards([]);
    setMatchedCards([]);
    setPoints(0);
    setTries(0);
  };

  const handleCardPress = (uniqueId) => {
    if (
      flippedCards.length < 2 &&
      !flippedCards.includes(uniqueId) &&
      !matchedCards.includes(uniqueId)
    ) {
      const newFlippedCards = [...flippedCards, uniqueId];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        checkMatch(newFlippedCards);
      }
    }
  };

  const checkMatch = (newFlippedCards) => {
    const [firstId, secondId] = newFlippedCards;
    const firstCard = cards.find((card) => card.uniqueId === firstId);
    const secondCard = cards.find((card) => card.uniqueId === secondId);

    if (firstCard.value === secondCard.value) {
      setMatchedCards((prevMatchedCards) => [...prevMatchedCards, firstId, secondId]);
      setPoints((prevPoints) => prevPoints + 1);
    } else {
      setTries((prevTries) => prevTries + 1);
    }

    setTimeout(() => {
      setFlippedCards([]);
    }, 1000);
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Text style={styles.title}>Memory Card Game</Text>
      <Text style={styles.score}>Points: {points}</Text>
      <Text style={styles.tries}>Tries: {tries}</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.uniqueId}
            style={[
              styles.card,
              flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId)
                ? styles.flipped
                : null,
            ]}
            onPress={() => handleCardPress(card.uniqueId)}
            disabled={flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId)}
          >
            <Text style={styles.cardText}>
              {flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId)
                ? card.value
                : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: 'white',
  },
  tries: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
  },
  card: {
    width: '30%',
    height: 100,
    backgroundColor: '#FFC107',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  flipped: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemoryCardGame;
