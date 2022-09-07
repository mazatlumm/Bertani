import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useEffect, useState, useRef} from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons'; 

const WebviewInfoTani = () => {

  const [NamaUser, setNamaUser] = useState('');
  const [Email, setEmail] = useState('');
  const [Role, setRole] = useState('');
  const webViewRef = useRef()

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log('Cek Data user di Dashboard');
    LihatDataUser()
  }, [isFocused])

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    console.log(jsonValue)
    console.log(ParsingDataUser[0].id_user)
    if(ParsingDataUser[0].id_user){
        setNamaUser(ParsingDataUser[0].nama);
        setEmail(ParsingDataUser[0].email);
        setRole(ParsingDataUser[0].role);
    }
    } catch(e) {
    // error reading value
    }
  }

  const BackHalaman = () => {
    webViewRef.current?.goBack()
  }

  const Tampilan = () => {
    if(Email != ''){
      return (
        <View style={{flex:1}}>
          <WebView 
            style={styles.container}
            source={{ uri: 'https://kelasbertani.com/infotani'}}
            ref={webViewRef}
          />
          <TouchableOpacity onPress={()=> BackHalaman()} style={{width:50, height:50, borderRadius:25, backgroundColor:'grey', position:'absolute', right:10, bottom:30, alignItems:'center', justifyContent:'center'}}>
            <AntDesign name="leftcircle" size={30} color="white" style={{marginLeft:5}} />
          </TouchableOpacity>
        </View>
      )
    }else{
      return <View></View>
    }
  }

  return (
    Tampilan()
  )
}

export default WebviewInfoTani

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})