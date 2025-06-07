import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MathQuiz = () => {
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [operator, setOperator] = useState(generateRandomOperator());
  const [answer, setAnswer] = useState('');
  const [points, setPoints] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);

  const MAX_QUESTIONS = 10;

  // Generate a random number between 1 and 20
  function generateRandomNumber() {
    return Math.floor(Math.random() * 20) + 1;
  }

  // Randomly select a mathematical operator
  function generateRandomOperator() {
    const operators = ['+', '-', '*', '/'];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  // Calculate the correct answer based on the operator
  function calculateAnswer(n1, n2, op) {
    switch (op) {
      case '+':
        return n1 + n2;
      case '-':
        return n1 - n2;
      case '*':
        return n1 * n2;
      case '/':
        return parseFloat((n1 / n2).toFixed(2)); // Handle division up to 2 decimal places
      default:
        return 0;
    }
  }

  const checkAnswer = () => {
    const correctAnswer = calculateAnswer(num1, num2, operator);
    const userAnswer = parseFloat(answer);

    if (userAnswer === correctAnswer) {
      setPoints((prevPoints) => prevPoints + 1);
      Alert.alert('Correct!', `Your answer is correct!`);
    } else {
      Alert.alert('Incorrect!', `The correct answer was ${correctAnswer}.`);
    }

    // Proceed to the next question or end the quiz
    if (questionCount < MAX_QUESTIONS) {
      setQuestionCount((prevCount) => prevCount + 1);
      generateNewQuestion();
    } else {
      Alert.alert(
        'Quiz Completed!',
        `Your final score is ${points + (userAnswer === correctAnswer ? 1 : 0)} out of ${MAX_QUESTIONS}.`,
        [{ text: 'Restart', onPress: resetQuiz }]
      );
    }

    setAnswer('');
  };

  const generateNewQuestion = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setOperator(generateRandomOperator());
  };

  const resetQuiz = () => {
    setPoints(0);
    setQuestionCount(1);
    generateNewQuestion();
  };

  return (
    <LinearGradient colors={['black', 'green']} style={styles.container}>
      <Text style={styles.title}>Math Quiz</Text>
      <Text style={styles.subtitle}>Question {questionCount} of {MAX_QUESTIONS}</Text>
      <Text style={styles.question}>
        What is {num1} {operator} {num2}?
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Your answer"
        placeholderTextColor="#FFFFFF" // Set placeholder text color to white
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={checkAnswer}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.score}>Points: {points}</Text>
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
    marginBottom: 20,
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});

export default MathQuiz;
