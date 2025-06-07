import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ip } from '../utils/ip';
import Feather from 'react-native-vector-icons/Feather';

export default function HomePage({ navigation, route }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-250)); // Initialize at off-screen position
  const { username, userId } = route.params || {};
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);
  
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://${ip}:5000/api/auth/user/${username}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const userData = await response.json();
      setProfilePic(userData.profilePic);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handlePlayGame = () => {
    navigation.navigate('GameList', { userId, username });
  };
  
  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.timing(sidebarAnimation, {
        toValue: -250, // Adjust to hide position
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0, // Adjust to visible position
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const Sidebar = () => (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnimation }] }]}>
      <TouchableOpacity style={styles.closeSidebarButton} onPress={toggleSidebar}>
        <Icon name="menu-outline" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.welcomeContainer}>
        <Image
          source={profilePic ? { uri: profilePic } : require('../assests/images/idea.png')}
          style={styles.logo}
        />
        <Text style={styles.brandName}>MindBooster</Text>
        <Text style={styles.welcomeText}>WELCOME, {username}</Text>
      </View>
      <View style={styles.menuItems}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuItem}>
          <Icon name="home-outline" size={24} color="white" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('profile', { username, userId })} style={styles.menuItem}>
          <Icon name="person-outline" size={24} color="white" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('settings')} style={styles.menuItem}>
          <Icon name="settings-outline" size={24} color="white" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('community', { userId, username })} style={styles.menuItem}>
          <MaterialIcons name="local-post-office" size={24} color="white" />
          <Text style={styles.menuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('addfriend', { userId, username })} style={styles.menuItem}>
          <Icon name="people-outline" size={24} color="white" />
          <Text style={styles.menuText}>Add Friend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handlePlayGame}>
          <Icon name="game-controller-outline" size={20} color="white" />
          <Text style={styles.menuText}>Play Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('progress')} style={styles.menuItem}>
          <Icon name="analytics-outline" size={24} color="white" />
          <Text style={styles.menuText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('googlemap')} style={styles.menuItem}>
          <Feather name="map-pin" size={24} color="white" />
          <Text style={styles.menuText}>Google Map</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Icon name="log-out-outline" size={24} color="white" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const Card = ({ logo, title, description, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContentContainer}>
        <Image source={logo} style={styles.cardLogo} />
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sidebarToggle} onPress={toggleSidebar}>
        <Icon name="menu-outline" size={30} color="white" />
      </TouchableOpacity>
      {isSidebarVisible && <Sidebar />}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.cardContainer}>
          <Card
            logo={require('../assests/images/videoslogo/Addiction Recovery.png')} // Replace with your logo
            title={`Addiction Recovery`}
            description={`Guidance and support to overcome addiction and build a healthier life.`}
            onPress={() => navigation.navigate('AddictionRecovery')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Anger Management.png')} // Replace with your logo
            title={`Anger Management`}
            description={`Strategies to control anger and communicate effectively.`}
            onPress={() => navigation.navigate('AngerManagement')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Financial Stress.png')} // Replace with your logo
            title={`Financial Stress`}
            description={`Tips to manage financial challenges and reduce monetary anxiety.`}
            onPress={() => navigation.navigate('FinancialStress')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Mental Health.png')} // Replace with your logo
            title={`Mental Health`}
            description={`Resources to enhance emotional well-being and mental resilience.`}
            onPress={() => navigation.navigate('MentalHealth')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Parenting Support.png')} // Replace with your logo
            title={`Parenting Support`}
            description={`Advice to navigate parenting challenges and strengthen family bonds.`}
            onPress={() => navigation.navigate('ParentingSupport')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Relationship Advice.png')} // Replace with your logo
            title={`Relationship Advice`}
            description={`Insights to foster healthier and more fulfilling relationships.`}
            onPress={() => navigation.navigate('RelationshipAdvice')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Self Esteem.png')} // Replace with your logo
            title={`Self-Esteem`}
            description={`Tools to build confidence and embrace your self-worth.`}
            onPress={() => navigation.navigate('SelfEsteem')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Sleep Management.png')} // Replace with your logo
            title={`Sleep Management`}
            description={`Techniques to improve sleep quality and overcome insomnia.`}
            onPress={() => navigation.navigate('SleepManagement')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Social Anxiety.png')} // Replace with your logo
            title={`Social Anxiety`}
            description={`Help to ease anxiety in social settings and build confidence.`}
            onPress={() => navigation.navigate('SocialAnxiety')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Stress Management.png')} // Replace with your logo
            title={`Stress Management`}
            description={`Practical methods to reduce stress and maintain inner peace.`}
            onPress={() => navigation.navigate('StressManagement')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Time Management.png')} // Replace with your logo
            title={`Time Management`}
            description={`Tips to prioritize tasks and boost productivity.`}
            onPress={() => navigation.navigate('TimeManagement')} // Replace with your navigation
          />
          <Card
            logo={require('../assests/images/videoslogo/Work Life Balance.png')} // Replace with your logo
            title={`Work-Life Balance`}
            description={`Advice to balance career and personal life effectively.`}
            onPress={() => navigation.navigate('WorkLifeBalance')} // Replace with your navigation
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#333',
    zIndex: 2,
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  closeSidebarButton: {
    position: 'absolute',
    right: 10,
    marginTop: 40,
  },
  welcomeContainer: {
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 40,
    overflow: 'hidden',
  },
  sidebarToggle: {
    marginLeft: 10,
    marginTop: 60,
  },
  brandName: {
    color: '#FFC107', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 10, 
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    alignSelf: 'center',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  header: {
    height: 60,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
  content: {
    padding: 10,
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  cardContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'linear-gradient(90deg, rgba(255,143,0,1) 0%, rgba(255,61,0,1) 100%)',
  },
  cardLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});