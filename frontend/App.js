import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen.js';
import LoginScreen from './screens/auth/LoginScreen.js';
import SignupScreen from './screens/auth/SignupScreen.js';

import HomeScreen from './screens/HomeScreen.js';
import UserProfile from './screens/UserProfiles.js';
import SettingsScreen from './screens/settingScreen.js';
import CommunityScreen from './screens/CommunityScreen.js';
import AddFriend from './screens/AddFriend.js';
import GameListScreen from './screens/GameListScreen.js';
import DataVisualization from './screens/DataVisualisation.js'; 
import GoogleMap from './screens/GoogleMap.tsx';

import BreathingGame from './screens/games/breathing.js';
import MathQuiz from './screens/games/mathquiz.js';
import MemoryCardGame from './screens/games/memory.js';
import BubblePop from './screens/games/bubblePop.js';
import SlidingPuzzle from './screens/games/SlidingPuzzle.js';

import Chat from './screens/ChatScreen.js';
import Camera from './screens/Camera.tsx';

import AddictionRecovery from './screens/videos/AddictionRecovery.js';
import AngerManagement from './screens/videos/AngerManagement.js';
import FinancialStress from './screens/videos/FinancialStress.js';
import MentalHealth from './screens/videos/MentalHealth.js';
import ParentingSupport from './screens/videos/ParentingSupport.js';
import RelationshipAdvice from './screens/videos/RelationshipAdvice.js';
import SelfEsteem from './screens/videos/SelfEsteem.js';
import SleepManagement from './screens/videos/SleepManagement.js';
import SocialAnxiety from './screens/videos/SocialAnxiety.js';
import StressManagement from './screens/videos/StressManagement.js';
import TimeManagement from './screens/videos/TimeManagement.js';
import WorkLifeBalance from './screens/videos/WorkLifeBalance.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsShowSplashScreen(false);
  //   }, 6000); 
  //   return () => clearTimeout(timer); 
  // }, []);

  // if (isShowSplashScreen) {
  //   return <SplashScreen />; 
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerHeight: 100 }} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="profile" component={UserProfile} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="community" component={CommunityScreen} />
        <Stack.Screen name="addfriend" component={AddFriend} />
        <Stack.Screen name="GameList" component={GameListScreen} />
        <Stack.Screen name="progress" component={DataVisualization} />
        <Stack.Screen name="googlemap" component={GoogleMap} />
        
        <Stack.Screen name="Breathing Exercise" component={BreathingGame} />
        <Stack.Screen name="Math Quiz" component={MathQuiz} />
        <Stack.Screen name="Memory Card Game" component={MemoryCardGame} />
        <Stack.Screen name="Bubble Pop" component={BubblePop} />
        <Stack.Screen name="Sliding Puzzle" component={SlidingPuzzle} />

        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="camera" component={Camera} />

        <Stack.Screen name="AddictionRecovery" component={AddictionRecovery} />
        <Stack.Screen name="AngerManagement" component={AngerManagement} />
        <Stack.Screen name="FinancialStress" component={FinancialStress} />
        <Stack.Screen name="MentalHealth" component={MentalHealth} />
        <Stack.Screen name="ParentingSupport" component={ParentingSupport} />
        <Stack.Screen name="RelationshipAdvice" component={RelationshipAdvice} />
        <Stack.Screen name="SelfEsteem" component={SelfEsteem} />
        <Stack.Screen name="SleepManagement" component={SleepManagement} />
        <Stack.Screen name="SocialAnxiety" component={SocialAnxiety} />
        <Stack.Screen name="StressManagement" component={StressManagement} />
        <Stack.Screen name="TimeManagement" component={TimeManagement} />
        <Stack.Screen name="WorkLifeBalance" component={WorkLifeBalance} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}