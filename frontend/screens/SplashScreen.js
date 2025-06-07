import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Image, Animated, ImageBackground } from "react-native";
import icon from "../assests/images/idea.png";
import bg from "../assests/images/pexels-artempodrez-7233099.jpg";

export default function SplashScreen() {
  const rotateXAnimation = useRef(new Animated.Value(0)).current;
  const rotateYAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const verticalFlip = Animated.timing(rotateXAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    const horizontalFlip = Animated.timing(rotateYAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    Animated.loop(
      Animated.sequence([
        verticalFlip,
        Animated.timing(rotateXAnimation, { toValue: 0, duration: 0, useNativeDriver: true }),
        horizontalFlip,
        Animated.timing(rotateYAnimation, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [rotateXAnimation, rotateYAnimation]);

  const rotateX = rotateXAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateY = rotateYAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ rotateX }, { rotateY }] },
          ]}
        >
          <Image style={styles.image} source={icon} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    // width: 300,
    // height: 200,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
});