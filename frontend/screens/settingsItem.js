// screens/settingsItem.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SettingItem = ({ label, value, onChange, type, options }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onChange}
        />
      )}
      {type === 'select' && (
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          style={styles.picker}
        >
          {options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
  },
  picker: {
    flex: 1,
  },
});

export default SettingItem;
