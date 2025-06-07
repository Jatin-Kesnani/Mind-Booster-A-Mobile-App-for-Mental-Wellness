import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'react-native-web';
import Animated, { FadeInUp, FadeInDown, LightSpeedInLeft } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ip } from '../../utils/ip';
export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${ip}:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Alert.alert('Success', 'Login successful');
        const { username, userId } = data;
        console.log(username);
        navigation.navigate('Home', { username, userId });
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <StatusBar style="light" />
      <Image
        style={{ position: 'absolute', width, height }}
        source={require('../../assests/images/pexels-artempodrez-7233099.jpg')}
        resizeMode="cover"
        blurRadius={3}
      />
      
      {/* Gradient Overlay */}
      <View
        style={{
          position: 'absolute',
          width,
          height,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: -1,
        }}
      />
      
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        {/* Brand Logo with Animation */}
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
          style={{ width: width * 0.6, height: height * 0.15, alignSelf: 'center', marginBottom: 30 }}
          source={require('../../assests/images/idea.png')}
          resizeMode="contain"
        />

        {/* Centered Brand Name */}
        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
          <Text
            style={{
              color: '#FFC107', // Color for brand name
              fontSize: 48, // Font size for brand name
              fontWeight: 'bold', // Bold text
              textAlign: 'center',
              letterSpacing: 2,
            }}
          >
            𝙈𝙞𝙣𝙙𝘽𝙤𝙤𝙨𝙩𝙚𝙧
          </Text>
        </View>

        {/* Login Heading */}
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: 1,
          }}
        >
          Login
        </Animated.Text>

        {/* Email Input with Glassmorphism */}
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          style={{
            marginBottom: 15,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 15,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
          }}
        >
          <Icon name="email" size={24} color="#fff" />
          <TextInput
            placeholder="Email"
            placeholderTextColor={'#ccc'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ color: 'white', fontSize: 16, marginLeft: 10, flex: 1 }}
          />
        </Animated.View>

        {/* Password Input with Glassmorphism */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          style={{
            marginBottom: 15,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 15,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
          }}
        >
          <Icon name="lock" size={24} color="#fff" />
          <TextInput
            placeholder="Password"
            placeholderTextColor={'#ccc'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{ color: 'white', fontSize: 16, marginLeft: 10, flex: 1 }}
          />
        </Animated.View>

        {/* Login Button with Interactive Color Change */}
        <Animated.View entering={LightSpeedInLeft.delay(400).duration(1000).springify()}>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: '#007bff',
              padding: 15,
              borderRadius: 10,
              shadowColor: '#007bff',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              transform: [{ scale: loading ? 1.02 : 1 }],
              transition: '0.3s',
            }}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* SignUp Link */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center' }}
        >
          <Text style={{ color: 'white' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.push('SignUp')}>
            <Text style={{ color: '#00f', fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
