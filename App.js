// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screen/Dashboard';
import DetailSensor from './screen/DetailSensor';
import Login from './screen/Login';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DetailSensor" component={DetailSensor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;