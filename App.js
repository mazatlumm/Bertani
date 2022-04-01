// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screen/Dashboard';
import DetailSensor from './screen/DetailSensor';
import Login from './screen/Login';
import CekTanah from './screen/CekTanah';
import DetailController from './screen/DetailController';
import SettingController from './screen/SettingController';
import QRScanner from './screen/QRScanner';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name="DetailSensor" component={DetailSensor} />
        <Stack.Screen name="CekTanah" component={CekTanah} options={{headerShown:false}} />
        <Stack.Screen name="DetailController" component={DetailController} options={{headerShown:false}} />
        <Stack.Screen name="SettingController" component={SettingController} options={{headerShown:false}} />
        <Stack.Screen name="QRScanner" component={QRScanner} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;