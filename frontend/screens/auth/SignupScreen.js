import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { StatusBar, useWindowDimensions, KeyboardAvoidingView } from "react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { ip } from "../../utils/ip";

// Password strength conditions
const passwordConditions = [
  { id: "1", text: "At least 8 characters long", isMet: false },
  { id: "2", text: "At least one uppercase letter", isMet: false },
  { id: "3", text: "At least one lowercase letter", isMet: false },
  { id: "4", text: "At least one number", isMet: false },
  { id: "5", text: "At least one special character", isMet: false },
];

// Helper function to check password strength
const checkPasswordStrength = (password) => {
  const conditions = [...passwordConditions];
  conditions[0].isMet = password.length >= 8;
  conditions[1].isMet = /[A-Z]/.test(password);
  conditions[2].isMet = /[a-z]/.test(password);
  conditions[3].isMet = /[0-9]/.test(password);
  conditions[4].isMet = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isStrong = conditions.every((condition) => condition.isMet);

  return {
    isStrong,
    conditions,
    message: isStrong ? "Password is strong!" : "Please meet all requirements.",
  };
};

export default function SignupScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    conditions: [],
    message: "",
  }); // State for password strength
  const { width, height } = useWindowDimensions();

  const handleSignup = async () => {
    if (!passwordStrength.isStrong) {
      Alert.alert("Error", passwordStrength.message);
      return;
    }

    try {
      const response = await fetch(`http://${ip}:5000/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setModalVisible(true);
        setTimeout(() => {
          navigation.push("Login");
        }, 2000);
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to connect to server");
      console.error(error);
    }
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const { isStrong, conditions, message } = checkPasswordStrength(text);
    setPasswordStrength({ isStrong, conditions, message });
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <Image
        style={{ position: "absolute", width, height }}
        source={require("../../assests/images/pexels-artempodrez-7233099.jpg")}
        resizeMode="cover"
        blurRadius={3}
      />

      {/* Gradient Overlay */}
      <View
        style={{
          position: "absolute",
          width,
          height,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: -1,
        }}
      />

      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}
      >
        {/* Brand Logo with Animation */}
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
          style={{
            width: width * 0.6,
            height: height * 0.15,
            alignSelf: "center",
            marginBottom: 30,
          }}
          source={require("../../assests/images/idea.png")}
          resizeMode="contain"
        />
        {/* </View> */}
        <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
          <Text
            style={{
              color: "#FFC107", // Color for brand name
              fontSize: 48, // Font size for brand name
              fontWeight: "bold", // Bold text
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            𝙈𝙞𝙣𝙙𝘽𝙤𝙤𝙨𝙩𝙚𝙧
          </Text>
        </View>

        {/* Title and Form */}
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              marginBottom: 20,
              letterSpacing: 1,
            }}
          >
            Sign Up
          </Animated.Text>

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
            <TextInput
              placeholder="Username"
              placeholderTextColor={"white"}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={{ color: 'white', fontSize: 16, marginLeft: 10, flex: 1 }}
            />
          </Animated.View>

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
            <TextInput
              placeholder="Email"
              placeholderTextColor={"white"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={{ color: 'white', fontSize: 16, marginLeft: 10, flex: 1 }}
            />
          </Animated.View>

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
            <TextInput
              placeholder="Password"
              placeholderTextColor={"white"}
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange} // Update password on change
              autoCapitalize="none"
              style={{ color: 'white', fontSize: 16, marginLeft: 10, flex: 1 }}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
          >
            <TouchableOpacity onPress={handleSignup} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center' }}
          >
            <Text style={{ color: 'white' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push("Login")}>
              <Text style={{ color: '#00f', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        {/* </View> */}

        {/* Password strength conditions */}
        {password && (
          <FlatList
            data={passwordStrength.conditions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.conditionContainer}>
                <Text
                  style={[
                    styles.conditionText,
                    item.isMet ? styles.metCondition : styles.unmetCondition,
                  ]}
                >
                  {item.isMet && "✓ "}
                  {item.text}
                </Text>
              </View>
            )}
            scrollEnabled={false} // Disable scrolling to keep it inline
          />
        )}

        {/* Modal for Success Message */}
        <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
          <Animated.View style={styles.modalContainer}>
            <Animated.Text
              entering={FadeInUp.duration(500)}
              style={styles.modalText}
            >
              {successMessage}
            </Animated.Text>
            <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  logo: {
    height: 120,
    width: 120,
  },
  formContainer: {
    flex: 1,
    // justifyContent: 'center',
    // paddingTop: 48,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 40,
    letterSpacing: 1,
  },
  inputsContainer: {
    marginHorizontal: 16,
    justifyContent: "center",
  },
  inputContainer: {
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
  },
  input: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "black",
  },
  loginLink: {
    color: "white",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionText: {
    fontSize: 16,
  },
  metCondition: {
    color: "green",
  },
  unmetCondition: {
    color: "red",
  },
};
