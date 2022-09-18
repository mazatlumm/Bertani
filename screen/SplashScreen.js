import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenLogo from '../assets/splash.png'

const SplashScreen = ({navigation}) => {

    useEffect(() => {
        console.log('Cek Data User')
        LihatDataUser()
    }, []);

    const LihatDataUser = async () => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        if(jsonValue == '' || jsonValue == null){
            navigation.navigate('Login');
        }else{
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
            navigation.navigate('Dashboard');
        }
        } catch(e) {
            // error reading value
            navigation.navigate('Login');
        }
    }

    return (
        <View style={styles.Container}>
            <Image source={SplashScreenLogo} style={{width:'100%', resizeMode:'contain'}} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})