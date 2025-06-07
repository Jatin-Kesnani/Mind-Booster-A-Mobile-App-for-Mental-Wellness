import React from 'react';
import { View, Text } from 'react-native';

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Loading.....</Text>
    </View>
  );
};

export default Loading;
