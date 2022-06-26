import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Tembakau from '../assets/images/tembakau.jpeg'

const CaptureDaun = ({navigation}) => {

  const [ResourcePath, setResourchPath] = useState('');
  const [UriPhoto, setUriPhoto] = useState(null);
  const [pickedImagePath, setPickedImagePath] = useState('');

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
      setUriPhoto(result.uri);
    }
  }

  const CekFotoSebelumDeteksi = () => {
    if(UriPhoto == null){
        Alert.alert('Upps, Bagaimana Cara Menggunakannya?', 'Silahkan menekan tombol "Ambil Foto Daun" dan lanjutkan dengan memotret daun yang akan dideteksi kadar Nitrogennya');
    }else{
        navigation.navigate('DeteksiNitrogen', {uriImage:UriPhoto})
    }
  }

  return (
    <View style={styles.container}>
          <Text style={{fontSize:16, textAlign:'center', paddingBottom:5, color:'black', fontWeight:'bold'}}>Perhatian!</Text>
          <Text style={{fontSize:12, textAlign:'center', paddingBottom:10, color:'grey'}}>Aplikasi ini mengambil sample warna untuk dibandingkan dengan Bagan Warna Daun, perhatikan dengan baik, agar tidak mengalami salah tafsir</Text>
            {UriPhoto != null ? 
                <Image
                source={{ uri: UriPhoto }}
                style={{ width: 300, height: 300, borderRadius:10 }}
                />  : <Image
                source={Tembakau}
                style={{ width: 300, height: 300, borderRadius:10 }}
                />   
            }
            
            <Text style={{ alignItems: 'center' }}>
            {ResourcePath.uri}
            </Text> 

            <TouchableOpacity onPress={()=> openCamera()} style={styles.button}  >
                <Text style={styles.buttonText}>Ambil Foto Daun</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> CekFotoSebelumDeteksi()} style={styles.button}  >
                <Text style={styles.buttonText}>Jalankan Deteksi Nitrogen</Text>
            </TouchableOpacity>
        </View>
  );
}

export default CaptureDaun;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  button: {
    width: 250,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom:12    
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    paddingVertical:10
  }
});