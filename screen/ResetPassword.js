import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform,TextInput, Alert, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import axios from 'axios';

import farmer from '../assets/images/farmer.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const ResetPassword = ({navigation}) => {
    const [Email, setEmail] = useState('');

    const ResetPasswordGo = async () => {
        const ParameterUrl = { 
          email:Email,
        }
        console.log(ParameterUrl)
        await axios.post('https://alicestech.com/kelasbertani/api/user/reset_password', ParameterUrl)
        .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            Alert.alert('Berhasil', 'Silahkan periksa INBOX email Anda, jika tidak menemukan email Reset Password, periksa folder SPAM',[
              {
                text: "Batal",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Login", onPress: () => navigation.navigate('Login') }
            ]);
          }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)
            Alert.alert('Mohon Maaf', e.response.data.message);
          }
        });;
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        
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
    <View style={{ flex: 1, alignItems: 'center'}}>
        <ScrollView style={{width:windowWidth}}>
          <View style={{width:'100%', alignItems:'center', marginTop:10}}>
            <Image source={farmer} style={{height:100, width:100}} />
            <Text style={styles.TitleFormPendaftaran}>Reset Password Akun BERTANI</Text>
          </View>
            <View style={{marginHorizontal:20, marginTop:5, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Email => setEmail(Email)}
                        defaultValue={Email}
                        placeholder='Email Anda'
                        keyboardType='email-address'
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.BtnBox} onPress={()=>ResetPasswordGo()}>
                    <Text style={styles.BtnTitle}>Reset Password Sekarang</Text>
                </TouchableOpacity>
            </View>
           
        </ScrollView>
    </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
    H1Philoshoper:{
        fontFamily:'Philosopher-Bold',
        color:'black',
        marginTop:10,
        ...Platform.select({
            ios:{
                fontSize:24
            },
            android:{
                fontSize:16
            }
        })
    },
    TextPoppins:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'black'
    },
    TextPoppinsBold:{
        fontFamily:'Poppins-Bold',
        fontSize:16,
        color:'black'
    },
    TextPoppinsBoldGreen:{
        fontFamily:'Poppins-Bold',
        fontSize:14,
        color:'#0D986A'
    },
    CardListUser:{
        width:'100%',
        backgroundColor:'white',
        paddingHorizontal:20,
        paddingVertical:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:10,
        borderRadius:10,
    },
    BoxBtn:{
        backgroundColor:'grey',
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        marginTop:5,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    TextBtn:{
        fontFamily:'Poppins-Bold',
        color:'white',
        fontSize:12
    },
    TambahUserBtn:{
        width:50,
        height:50,
        borderRadius:50/2,
        backgroundColor:'#0D986A',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:80,
        right:20
    },
    FormInput:{
        marginTop:10,
        zIndex:0
    },
    FormInputList:{
      marginTop:10,
      zIndex:10
    },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        zIndex:10
    },
    FormInputBoxList:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:0,
        paddingVertical:0,
        zIndex:10,
        paddingVertical:10,
        paddingHorizontal:10
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
    TextInputFormList:{
        fontFamily:'Poppins-Regular',
        color:'black',
        fontSize:12
    },
    BtnBox:{
        borderRadius:10,
        backgroundColor:'green',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        flexDirection:'row'
    },
    BtnTitle:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    TitleFormPendaftaran:{
        fontFamily:'Poppins-Bold',
        fontSize:14,
        color:'black',
    }
})