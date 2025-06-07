// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { PieChart, BarChart } from 'react-native-chart-kit';
// import * as Animatable from 'react-native-animatable';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon set
// import { ip } from '../utils/ip';

// const DataVisualization = ({ route }) => {
//   const [gameData, setGameData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userId, username } = route.params || {};
//   const [minutesPlayed, setMinutesPlayed] = useState(0);
  
//   const fetchGameData = async () => {
//     try {
//       const response = await fetch(`http://${ip}:5000/api/gameData/${userId}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setGameData(data);
//     } catch (error) {
//       console.error('Error fetching game data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateMinutesPlayed = async () => {
//     try {
//       const response = await fetch(`http://${ip}:5000/api/gameData/${userId}/update`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ minutesPlayed }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update minutes played');
//       }

//       const data = await response.json();
//       console.log('Updated minutes played:', data);
//     } catch (error) {
//       console.error('Error updating minutes played:', error);
//     }
//   };

//   const prepareChartData = () => {
//     return gameData.map((game) => ({
//       name: game.gameId.gameName, 
//       population: game.minutesPlayed,
//       color: getRandomColor(),
//       legendFontColor: '#fff',
//       legendFontSize: 15,
//     }));
//   };

//   useEffect(() => {
//     fetchGameData();

//     const interval = setInterval(() => {
//       setMinutesPlayed((prev) => prev + 1);
//       updateMinutesPlayed();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const pieChartData = prepareChartData();
//   const barChartData = {
//     labels: pieChartData.map((item) => item.name),
//     datasets: [
//       {
//         data: pieChartData.map((item) => item.population),
//         color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//       },
//     ],
//   };

//   return (
//     <View style={styles.container}>
//       {/* Animated Title */}
//       <Animatable.Text style={styles.title} animation="fadeInDown" duration={1000}>
//         <Icon name="bar-chart" size={24} color="#007BFF" style={styles.icon} />
//         Game Play Time Distribution
//       </Animatable.Text>

//       {/* Styled Username */}
//       <Animatable.Text style={styles.username} animation="fadeIn" duration={1000}>
//         <Icon name="person" size={20} color="#007BFF" style={styles.icon} />
//         User: {username}
//       </Animatable.Text>

//       {/* Pie Chart */}
//       <Animatable.View animation="bounceIn" duration={1000}>
//         <PieChart
//           data={pieChartData}
//           width={300}
//           height={220}
//           chartConfig={{
//             backgroundColor: '#ffffff',
//             backgroundGradientFrom: '#ffffff',
//             backgroundGradientTo: '#ffffff',
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16,
//             },
//             propsForDots: {
//               r: '6',
//               strokeWidth: '2',
//               stroke: '#ffa726',
//             },
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </Animatable.View>

//       {/* Bar Chart */}
//       <View style={styles.chartContainer}>
//         <Text style={styles.chartTitle}>Minutes Played by Game</Text>
//         <Animatable.View animation="bounceIn" duration={1000}>
//           <BarChart
//             data={barChartData}
//             width={300}
//             height={220}
//             chartConfig={{
//               backgroundColor: '#fff',
//               backgroundGradientFrom: '#fff',
//               backgroundGradientTo: '#fff',
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//                 paddingRight: 20,
//                 paddingLeft: 20,
//               },
//             }}
//             verticalLabelRotation={30}
//             style={styles.barChart}
//           />
//         </Animatable.View>
//       </View>
//     </View>
//   );
// };

// const getRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#CCCCCC',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   username: {
//     fontSize: 20,
//     fontStyle: 'italic',
//     marginBottom: 20,
//     color: '#007BFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   chartContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 16,
//     marginVertical: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     alignItems: 'center',
//     width: '100%',
//   },
//   chartTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   barChart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   icon: {
//     marginRight: 10, // Spacing between icon and text
//   },
// });

// export default DataVisualization;


import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: TextElement: Support for defaultProps will be removed']);

const { width } = Dimensions.get('window');

export default function DataVisualization() {
  // Static Data for Games
  const gameData = [
    {
      name: 'Breathing Exercise',
      minutesPlayed: 120,
      lastPlayed: '2024-12-26',
      description: 'A relaxing game to practice deep breathing techniques.',
    },
    {
      name: 'Bubble Pop',
      minutesPlayed: 85,
      lastPlayed: '2024-12-25',
      description: 'A fun game where you pop bubbles to score points.',
    },
    {
      name: 'Coloring',
      minutesPlayed: 45,
      lastPlayed: '2024-12-24',
      description: 'Unleash your creativity by coloring different patterns.',
    },
    {
      name: 'Math Quiz',
      minutesPlayed: 150,
      lastPlayed: '2024-12-23',
      description: 'Sharpen your math skills with quick quizzes.',
    },
    {
      name: 'Memory',
      minutesPlayed: 90,
      lastPlayed: '2024-12-22',
      description: 'Test and improve your memory with this fun game.',
    },
  ];

  // Prepare Data for Charts
  const pieChartData = gameData.map((game) => ({
    name: game.name,
    population: game.minutesPlayed,
    color: getRandomColor(),
    legendFontColor: '#fff',
    legendFontSize: 15,
  }));

  const barChartData = {
    labels: gameData.map((game) => game.name),
    datasets: [
      {
        data: gameData.map((game) => game.minutesPlayed),
      },
    ],
  };

  return (
    <LinearGradient colors={['#6A11CB', '#2575FC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>
          <Icon name="bar-chart" size={24} color="#fff" style={styles.icon} />
          Game Play Analytics
        </Text>

        {/* Scrollable PieChart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Playtime Distribution</Text>
          <ScrollView horizontal contentContainerStyle={styles.chartScrollView}>
            <PieChart
              data={pieChartData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </ScrollView>
        </View>

        {/* Scrollable Bar Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Minutes Played by Game</Text>
          <ScrollView horizontal contentContainerStyle={styles.chartScrollView}>
            <BarChart
              data={barChartData}
              width={width - 40}
              height={250}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              style={styles.barChart}
            />
          </ScrollView>
        </View>

        {/* Game Cards */}
        {gameData.map((game, index) => (
          <View key={index} style={styles.cardContainer}>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>{game.name}</Card.Title>
              <Card.Divider />
              <Text style={styles.cardText}>{game.description}</Text>
              <Text style={styles.cardText}>Minutes Played: {game.minutesPlayed}</Text>
              <Text style={styles.cardText}>Last Played: {game.lastPlayed}</Text>
            </Card>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

// Helper function to generate random colors for pie chart
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Chart config for styling
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,  // Ensure status bar space
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,  // Ensure enough space for the last content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: width - 40,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartScrollView: {
    alignItems: 'center',
  },
  barChart: {
    borderRadius: 16,
    marginTop: 20,  // Add some space above the bar chart
    marginBottom: 40,  // Add space below the bar chart to fit the x-axis labels
  },
  cardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
