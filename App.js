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
import TambahController from './screen/TambahController';
import Profile from './screen/Profile';
import TambahPengguna from './screen/TambahPengguna';
import PushNotification from './screen/PushNotification';
import UbahProfile from './screen/UbahProfile';
import DetectNitrogen from './screen/DetectNitrogen';
import SplashScreen from './screen/SplashScreen';
import DaftarController from './screen/DaftarController';
import QRScannerSC from './screen/QRScannerSC';
import UbahUserData from './screen/UbahUserData';
import QRScanCekTanah from './screen/QRScanCekTanah';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name="DetailSensor" component={DetailSensor} />
        <Stack.Screen name="CekTanah" component={CekTanah} options={{headerShown:false}} />
        <Stack.Screen name="DaftarController" component={DaftarController} options={{headerShown:false}} />
        <Stack.Screen name="DetailController" component={DetailController} options={{headerShown:false}} />
        <Stack.Screen name="SettingController" component={SettingController} options={{headerShown:false}} />
        <Stack.Screen name="QRScanner" component={QRScanner} options={{headerShown:false}} />
        <Stack.Screen name="QRScannerSC" component={QRScannerSC} options={{headerShown:false}} />
        <Stack.Screen name="TambahController" component={TambahController} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <Stack.Screen name="TambahPengguna" component={TambahPengguna} options={{headerShown:false}} />
        <Stack.Screen name="PushNotification" component={PushNotification} options={{headerShown:false}} />
        <Stack.Screen name="UbahProfile" component={UbahProfile} options={{headerShown:false}} />
        <Stack.Screen name="DetectNitrogen" component={DetectNitrogen} options={{headerShown:false}} />
        <Stack.Screen name="UbahUserData" component={UbahUserData} options={{headerShown:false}} />
        <Stack.Screen name="QRScanCekTanah" component={QRScanCekTanah} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;