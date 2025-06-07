// screens/settingsSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingSection = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f8f9fa', // Light background color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333', // Darker color for section title
  },
});

export default SettingSection;
