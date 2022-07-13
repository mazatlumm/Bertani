import { registerRootComponent } from 'expo';
import {AppRegistry} from 'react-native';
import App from './App';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage'

PushNotification.configure({
    onRegister: function (token) {
        AsyncStorage.setItem('@token', token.token);
    },
    
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
    },
    requestPermissions: true,
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);

AppRegistry.registerComponent('main', () => App);
