import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native'
import React, {useEffect, useState} from 'react'
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import artificialGif from '../assets/gif/ai.gif'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
//statusbar
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

const AIDetectPlant = ({navigation}) => {

  //statusbar
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(TRANSITIONS[0]);

    useEffect(() => {
        CekTSFlow();
      }, []);

    async function CekTSFlow() {
        await tf.ready();
    }

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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'black'}}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} />
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'black'}}>
          <Image source={artificialGif} style={{width:200, height:200}} />
          <View style={{marginHorizontal:20, marginTop:5}}>
            <Text style={{color:'white', fontSize:14, fontFamily:'Poppins-Regular', textAlign:'center'}}>Kami sedang mempersiapkan data AI, Anda dapat membantu kami untuk menyetorkan semua data yang kami butuhkan</Text>
          </View>
          <TouchableOpacity onPress={()=> navigation.navigate('PenyakitTanaman')} style={{backgroundColor:'blue', paddingVertical:10, paddingHorizontal:20, marginTop:10, borderRadius:10}}>
            <Text style={{color:'white', fontSize:12, fontFamily:'Poppins-Regular', textAlign:'center'}}>Deteksi Penyakit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate('CaptureDaun')} style={{backgroundColor:'blue', paddingVertical:10, paddingHorizontal:20, marginTop:10, borderRadius:10}}>
            <Text style={{color:'white', fontSize:12, fontFamily:'Poppins-Regular', textAlign:'center'}}>Cek Kadar Nitrogen</Text>
          </TouchableOpacity>
      </View>      
    </SafeAreaView>
  )
}

export default AIDetectPlant

const styles = StyleSheet.create({})