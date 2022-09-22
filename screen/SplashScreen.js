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
        console.log('splash screen')
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        // const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        if(jsonValue){
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
            setTimeout(() => {
                navigation.navigate('Dashboard');
            }, 2000);
        }else{
            setTimeout(() => {
                navigation.navigate('Login');
            }, 2000);
        }
    }

    return (
        <View style={styles.Container}>
            <Image source={SplashScreenLogo} style={{width:'90%', resizeMode:'contain'}} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#9CE5CB'
    }
})