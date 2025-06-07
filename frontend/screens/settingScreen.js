// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import SettingSection from './settingsSection';
import SettingItem from './settingsItem';

const SettingsScreen = () => {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('abdullah@gmail.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState('light'); // Add theme state

  const handleSaveChanges = () => {
    alert('Settings saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <SettingSection title="Notifications">
        <SettingItem
          label="Enable Notifications"
          value={notificationsEnabled}
          onChange={setNotificationsEnabled}
          type="toggle"
        />
      </SettingSection>

      <SettingSection title="Appearance">
        <SettingItem
          label="Theme"
          value={theme}
          onChange={setTheme}
          type="select"
          options={['light', 'dark']}
        />
      </SettingSection>

      <Button title="Save Changes" onPress={handleSaveChanges} color="#6200ee" style={styles.saveButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 10,
    elevation: 3,
  },
});

export default SettingsScreen;
