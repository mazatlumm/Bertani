import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native'
import React from 'react'
import TopBarIcon2 from '../assets/images/TopBarIcon2.png'
import MenuIcon from '../assets/images/menuicon.png'

import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

const TopBar = () => {

    let [fontsLoaded] = useFonts({
        'Philosopher': require('../assets/fonts/Philosopher-Regular.ttf'),
        'Philosopher-Bold': require('../assets/fonts/Philosopher-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      });
    
      if (!fontsLoaded) {
        return <AppLoading />;
      }

  return (
    <View style={{paddingHorizontal:20, width:'100%'}}>
        <View style={styles.TopBarBox}>
            <View style={{flex:0.5,}}>
                <Image source={TopBarIcon2} style={{width:35, resizeMode:'contain'}} />
            </View>
            <View style={{flex:2, justifyContent:'flex-start'}}>
                <Text style={styles.TopBarText}>Bertani</Text>
            </View>
            <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}}>
                <Image source={MenuIcon} style={{width:35, resizeMode:'contain'}} />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default TopBar

const styles = StyleSheet.create({
    TopBarBox:{
      // marginTop:25, 
      width:'100%', 
      alignItems:'flex-start', 
      flexDirection:'row',
      alignItems:'center',
    },
    TopBarText:{
      fontFamily: 'Philosopher-Bold', 
      ...Platform.select({
        ios:{
          fontSize:24
        }, 
        android:{
          fontSize:18
        }
      }), 
      marginLeft:10 
    }
})