import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WebviewPetani = () => {

  const [NamaUser, setNamaUser] = useState('');
  const [Email, setEmail] = useState('');
  const [Role, setRole] = useState('');

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

  const Tampilan = () => {
    if(Email != ''){
      return (
        <WebView 
          style={styles.container}
          source={{ uri: 'https://alicestech.com/petani/api/auto_login?email='+Email+'&nama='+NamaUser+'&role='+Role}}
        />
      )
    }else{
      return <View></View>
    }
  }

  return (
    Tampilan()
  )
}

export default WebviewPetani

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})