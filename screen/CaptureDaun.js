import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TouchableOpacity, TextInput, Modal, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import Tembakau from '../assets/images/tembakau.jpeg'

import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));

const CaptureDaun = ({navigation}) => {

  const [URL, setURL] = useState('https://alicestech.com/kelasbertani/');
  const [ResourcePath, setResourchPath] = useState('');
  const [UriPhoto, setUriPhoto] = useState(null);
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [Rekesa1, setRekesa1] = useState('');
  const [Rekesa2, setRekesa2] = useState('');
  const [Rekesa3, setRekesa3] = useState('');
  const [Rekesa4, setRekesa4] = useState('');
  const [Rekesa5, setRekesa5] = useState('');
  const [Rekesa6, setRekesa6] = useState('');
  const [Rekesa7, setRekesa7] = useState('');
  const [Rekesa8, setRekesa8] = useState('');
  const [ModalStandardNitrogen, setModalStandardNitrogen] = useState(false);

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

  const GetStandardNitrogen = async () => {
    await axios.get(URL + 'api/standard_nitrogen')
    .then(response => {
      if(response.data.status == true){
          const DataResult = response.data.result[0];
          console.log(DataResult);
          setRekesa1(DataResult.rekesa1);
          setRekesa2(DataResult.rekesa2);
          setRekesa3(DataResult.rekesa3);
          setRekesa4(DataResult.rekesa4);
          setRekesa5(DataResult.rekesa5);
          setRekesa6(DataResult.rekesa6);
          setRekesa7(DataResult.rekesa7);
          setRekesa8(DataResult.rekesa8);
      }
    })
    .catch(e => {
      if (e.response.status === 404) {
        console.log(e.response.data)
      }
    });
  }

  const SimpanReksa = async () => {
    const ParameterUrl = { 
      rekesa1 : Rekesa1,
      rekesa2 : Rekesa2,
      rekesa3 : Rekesa3,
      rekesa4 : Rekesa4,
      rekesa5 : Rekesa5,
      rekesa6 : Rekesa6,
      rekesa7 : Rekesa7,
      rekesa8 : Rekesa8,
    }
    console.log(ParameterUrl)
    await axios.post(URL + 'api/standard_nitrogen', ParameterUrl)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
    });
  }

  const SettingStandard = () => {
    setModalStandardNitrogen(!ModalStandardNitrogen)
  }

  const isFocused = useIsFocused();
  useEffect(() => {
      console.log('Standard Nitrogen')
      GetStandardNitrogen();
    }, [isFocused]);

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
    <View style={styles.container}>
      <Modal
          animationType="fade"
          transparent={true}
          visible={ModalStandardNitrogen}
          onRequestClose={() => {
            setModalStandardNitrogen(!ModalStandardNitrogen);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
            <ScrollView style={{paddingHorizontal:20, paddingVertical:10, marginHorizontal:20, backgroundColor:'white', borderRadius:10,  width:windowWidth}}>
                <TouchableOpacity onPress={()=> setModalStandardNitrogen(!ModalStandardNitrogen)} style={{position:'absolute', top:0, right:5, zIndex:10}}>
                    <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                {/* Skala 1 */}
                <View style={{marginTop:20}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 1, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#8fab52'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa1 => setRekesa1(Rekesa1)}
                        defaultValue={Rekesa1}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>

                {/* Skala 2 */}
                <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 2, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#799d4d'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa2 => setRekesa2(Rekesa2)}
                        defaultValue={Rekesa2}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>

              {/* Skala 3 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 3, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#679049'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa3 => setRekesa3(Rekesa3)}
                        defaultValue={Rekesa3}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
              
              {/* Skala 4 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 4, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#528345'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa4 => setRekesa4(Rekesa4)}
                        defaultValue={Rekesa4}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
              
              {/* Skala 5 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 5, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#407641'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa5 => setRekesa5(Rekesa5)}
                        defaultValue={Rekesa5}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
              
              {/* Skala 6 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 6, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#2b693d'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa6 => setRekesa6(Rekesa6)}
                        defaultValue={Rekesa6}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
              
              {/* Skala 7 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 7, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#175c39'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa7 => setRekesa7(Rekesa7)}
                        defaultValue={Rekesa7}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
              
              {/* Skala 8 */}
              <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Skala BWD 8, Contoh Warna Daun </Text>
                <View style={{width:'100%', height:20, backgroundColor:'#0c5039'}}></View>
                <Text style={styles.TextPoppins}>Buat Saran/Rekomendasi/Kesimpulan :</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa8 => setRekesa8(Rekesa8)}
                        defaultValue={Rekesa8}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>

                <View style={{marginTop:10}}></View>
                <TouchableOpacity onPress={()=>SimpanReksa()} style={styles.BtnSimpanReksa}>
                    <Text style={styles.BtnTitle}>Simpan</Text>
                </TouchableOpacity>
                <View style={{marginBottom:30}}></View>
              </ScrollView>
          </View>
        </Modal>
          <TouchableOpacity style={styles.SettingStandard} onPress={()=>SettingStandard()}>
              <AntDesign name="setting" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.ColorTopBar}></View>
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
  },
  SettingStandard:{
    width:50,
    height:50,
    borderRadius:50/2,
    backgroundColor:'grey',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:30,
    right:20
},
FormInput:{
  marginTop:10,
  width:'100%'
},
FormInputBox:{
  borderWidth:1,
  borderRadius:10,
  paddingHorizontal:10,
  paddingVertical:5,
  width:'100%'
},
FormInputBoxInput:{
  borderWidth:1,
  borderTopRightRadius:10,
  borderBottomRightRadius:10,
  paddingHorizontal:10,
  paddingVertical:5,
  flex:1
},
FormInputBoxInputLabel:{
  borderTopLeftRadius:10,
  borderBottomLeftRadius:10,
  paddingHorizontal:10,
  paddingVertical:10,
  backgroundColor:'grey'
},
FormInputBoxGroup:{
  borderWidth:1,
  borderRadius:10,
  paddingHorizontal:10,
  paddingVertical:5,
  flex:3,
  justifyContent:'center'
},
FormGroup:{
  flexDirection:'row'
},
IconFormGroup:{
  borderWidth:1,
  borderRadius:10,
  paddingHorizontal:10,
  paddingVertical:5,
  marginLeft:5,
  alignItems:'center',
  justifyContent:'center'
},
TextInputForm:{
  fontFamily:'Poppins-Regular',
  color:'black',
  fontSize:12
},
TextPoppins:{
  fontFamily:'Poppins-Bold',
  color:'black',
  fontSize:12
},
BtnSimpanReksa:{
  borderRadius:10,
  backgroundColor:'green',
  paddingHorizontal:10,
  paddingVertical:10,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'row',
},
BtnTitle:{
  fontFamily:'Poppins-Bold',
  fontSize:12,
  color:'white',
},
});