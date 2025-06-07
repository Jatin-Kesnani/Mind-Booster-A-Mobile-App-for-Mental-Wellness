import React from 'react';
import { View, Text } from 'react-native'; // Add Text import
import BreathingGame from './games/breathing';
import ColoringGame from './games/SlidingPuzzle';
import BubblePopGame from './games/bubblePop';

const GameDetailScreen = ({ route }) => {
  const { gameId } = route.params;

  const renderGame = () => {
    switch (gameId) {
      case 1:
        return <BreathingGame />;
      case 2:
        return <ColoringGame />;
      case 3:
        return <BubblePopGame />;
      default:
        return <Text>Game not found!</Text>;
    }
  };

  return <View style={{ flex: 1 }}>{renderGame()}</View>;
};

export default GameDetailScreen;
