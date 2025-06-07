import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Button, SafeAreaView, StatusBar, TouchableOpacity, BackHandler } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from '@expo/vector-icons';

// const GOOGLE_MAPS_API_KEY = "AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk";

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function GogoleMap() {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [mapRegion, setMapRegion] = useState<LocationType | null>(null);
  const mapRef = useRef<MapView>(null); // Reference to the MapView

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        const newUserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setUserLocation(newUserLocation);
        setMapRegion(newUserLocation);
      }
    })();
  }, []);

  const handleZoomIn = () => {
    if (mapRegion) {
      const zoomInRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 0.8,
        longitudeDelta: mapRegion.longitudeDelta * 0.8,
      };
      setMapRegion(zoomInRegion);
    }
  };

  const handleZoomOut = () => {
    if (mapRegion) {
      const zoomOutRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 1.2,
        longitudeDelta: mapRegion.longitudeDelta * 1.2,
      };
      setMapRegion(zoomOutRegion);
    }
  };

  const handleCenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {userLocation ? (
        <>
          <View style={styles.zoomButtonsContainer}>
            <Button title="+" onPress={handleZoomIn} color="black" />
            <Button title="-" onPress={handleZoomOut} color="black" />
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion || { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
            showsUserLocation={true}
            showsMyLocationButton={false} // Hide the default "My Location" button
          />

          <TouchableOpacity style={styles.locationButton} onPress={handleCenterMap}>
            <MaterialIcons name="my-location" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading Map...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  map: {
    flex: 1,
  },
  zoomButtonsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
    width: 40,
  },
  locationButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
});