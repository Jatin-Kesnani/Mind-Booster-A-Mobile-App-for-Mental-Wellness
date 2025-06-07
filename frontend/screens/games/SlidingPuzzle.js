import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// The target 3x3 matrix for the game
const targetMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null], // null represents the empty space
];

// Helper function to shuffle the matrix
const shuffleMatrix = () => {
  let shuffled = [...targetMatrix.flat()];
  shuffled = shuffled.filter(item => item !== null);
  shuffled = shuffled.sort(() => Math.random() - 0.5);
  shuffled.push(null); // Add the empty space back
  let matrix = [];
  while (shuffled.length) {
    matrix.push(shuffled.splice(0, 3));
  }
  return matrix;
};

export default function SlidingPuzzle() {
  const [matrix, setMatrix] = useState(shuffleMatrix());
  const [moves, setMoves] = useState(0);

  // Check if the matrix matches the target matrix
  const checkWin = () => {
    let isWin = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (matrix[i][j] !== targetMatrix[i][j]) {
          isWin = false;
          break;
        }
      }
    }
    return isWin;
  };

  // Move the piece to the empty spot
  const moveBox = (i, j) => {
    const emptySpot = findEmptySpot(matrix);
    const newMatrix = [...matrix];

    // Check if the box is adjacent to the empty space
    if (
      (Math.abs(i - emptySpot[0]) === 1 && j === emptySpot[1]) || 
      (Math.abs(j - emptySpot[1]) === 1 && i === emptySpot[0])
    ) {
      // Swap the values
      newMatrix[emptySpot[0]][emptySpot[1]] = newMatrix[i][j];
      newMatrix[i][j] = null;
      setMatrix(newMatrix);
      setMoves(moves + 1);
    }
  };

  // Find the empty spot in the matrix
  const findEmptySpot = (matrix) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (matrix[i][j] === null) {
          return [i, j];
        }
      }
    }
  };

  // Handle touch event for each box
  const handleTouch = (i, j) => {
    moveBox(i, j);
  };

  // Check if user has won the game
  useEffect(() => {
    if (checkWin()) {
      Alert.alert(`You win! Moves: ${moves}`);
      setMatrix(shuffleMatrix());
      setMoves(0);
    }
  }, [matrix]);

  const renderMatrix = () => {
    return matrix.map((row, rowIndex) => {
      return (
        <View style={styles.row} key={rowIndex}>
          {row.map((item, colIndex) => {
            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  item === null && styles.emptyCell,
                  item !== null && { backgroundColor: `rgb(${(item * 30) % 255}, ${(item * 50) % 255}, ${(item * 70) % 255})` }
                ]}
                onPress={() => handleTouch(rowIndex, colIndex)}
              >
                {item !== null && <Text style={styles.text}>{item}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    });
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Text style={styles.title}>Sliding Puzzle</Text>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.board}>{renderMatrix()}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  moves: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  board: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: width / 3 - 20,
    height: width / 3 - 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#cccccc',
  },
  emptyCell: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
