import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, Alert, StatusBar, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopImage from '../assets/images/LoginImage.png'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { WebView } from 'react-native-webview';

//statusbar
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

// Icon
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const Login = ({navigation}) => {

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [SeePassword, setSeePassword] = useState(true);
    const [HideShowPassword, setHideShowPassword] = useState(true);
    const [IconPassword, setIconPassword] = useState('eye-slash');

    const [hidden, setHidden] = useState(false);
    const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
    const [statusBarTransition, setStatusBarTransition] = useState(TRANSITIONS[0]);
    const [SyaratKetentuan, setSyaratKetentuan] = useState(false)
    const [ModalSyaratKetentuan, setModalSyaratKetentuan] = useState(false)

    useEffect(() => {
        LihatDataUser()
    }, []);

    const LihatPassword = () => {
        setSeePassword(!SeePassword);
        if(SeePassword == false){
            setHideShowPassword(true);
            setIconPassword('eye-slash')
        }else{
            setHideShowPassword(false);
            setIconPassword('eye');
        }
    }

    const LihatDataUser = async () => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(ParsingDataUser[0].nama)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
        // error reading value
        }
    }
    

    const SimpanDataUSer = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@DataUser', jsonValue)
          console.log('Simpan Data User')
        } catch (e) {
          // saving error
        }
      }

      const SetujuiSyaratKetentuan = () => {
        setModalSyaratKetentuan(!ModalSyaratKetentuan);
        setSyaratKetentuan(true);
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

    // API Login App
    const getDataUsingPost = () => {
        //POST json
    var dataToSend = { username: Username, password: Password};
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //POST request API Login
    fetch('https://alicestech.com/kelasbertani/api/user/login', {
      method: 'POST', //Request Type
      body: formBody, //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        if(responseJson.status == true){
            SimpanDataUSer(responseJson.result)
            setTimeout(() => {
                navigation.navigate('Dashboard');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                });
            }, 1000);
        }else{
            Alert.alert('Status Login', 'Username & Password Tidak Sesuai');
        }
        console.log(responseJson.result);
      })
      //If response is not in json then in error
      .catch((error) => {
        console.error(error);
      });
    };

  return (
    <View style={{ flex: 1}}>
        <StatusBar
        animated={true}
        backgroundColor="green"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalSyaratKetentuan}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisibleJenisKelamin(!ModalSyaratKetentuan);
          }}
        >
         <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, flex:1, width:'100%',paddingHorizontal:20}}>
            <WebView 
              style={{flex:1}}
              source={{ uri: 'https://alicestech.com/kelasbertani/syarat_ketentuan'}}
            />
            <TouchableOpacity onPress={()=>SetujuiSyaratKetentuan()} style={styles.BtnBox}>
              <Text style={styles.BtnTitle}>Setuju Syarat & Ketentuan</Text>
            </TouchableOpacity>
            </View>
         </View>
        </Modal>
        <ScrollView>
        <View style={{alignItems: 'center', marginBottom:30}}>
            <Image source={TopImage} style={{width:'100%', resizeMode:'cover',height:400}} />
        </View>

        <View style={styles.FormLogin}>
            <View style={styles.BoxInput}>
                <TextInput 
                placeholder='Username'
                style={styles.TextInput}
                onChangeText={Username => setUsername(Username)}
                defaultValue={Username}
                />
                <FontAwesome name="user" size={20} color="black" />
            </View>
            <View style={styles.BoxInput}>
                <TextInput 
                placeholder='Password'
                style={styles.TextInput}
                secureTextEntry={HideShowPassword}
                onChangeText={Password => setPassword(Password)}
                defaultValue={Password}
                />
                <TouchableOpacity onPress={()=>LihatPassword()}>
                    <FontAwesome name={IconPassword} size={20} color="black" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>setSyaratKetentuan(!SyaratKetentuan)} style={{flexDirection:'row', alignItems:'center', marginTop:15}}>
                  <View style={{width:14, height:14, borderRadius:7, borderWidth:0.5, marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {SyaratKetentuan ? 
                      <View style={{width:8, height:8, borderRadius:4, borderWidth:0.5, backgroundColor:'blue'}}></View>
                      :
                      <View></View>
                    }

                  </View>
                  <Text style={styles.TextPoppins}>Menyetujui Syarat & Ketentuan yang berlaku</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setModalSyaratKetentuan(!ModalSyaratKetentuan)} style={{marginLeft:20}}>
                  <Text style={styles.TextPoppinsBlueUnderline}>Baca Syarat & Ketentuan Pengguna</Text>
                </TouchableOpacity>
            {SyaratKetentuan ?
                <TouchableOpacity style={styles.LoginButton} onPress={()=>getDataUsingPost()}>
                    <Text style={styles.TextLoginButton}>Masuk</Text>
                </TouchableOpacity>
                :
                <View style={styles.BtnBoxDisable}>
                    <Text style={styles.TextLoginButton}>Masuk</Text>
                </View>
            }

                <Text style={styles.TextFooter}>Belum Memiliki Akun?</Text>
            <TouchableOpacity style={styles.RegisterButton} onPress={()=>navigation.navigate('RegisterScreen')}>
                <Text style={styles.TextLoginButton}>Daftar Sekarang</Text>
            </TouchableOpacity>
            <View style={{marginTop:10}}></View>
            <Text style={styles.TextFooter}>Atau Lupa Password?</Text>
            <TouchableOpacity style={styles.ResetPassworButton} onPress={()=>navigation.navigate('ResetPassword')}>
                <Text style={styles.TextRSTPasswordButton}>Reset Password</Text>
            </TouchableOpacity>
            <View style={styles.FooterLogin}>
                <Text style={styles.TextFooter}>Kelas Bertani</Text>
                <Text style={styles.TextFooter}>Copyrigth {'\u00A9'}2022, All Rights Reserved</Text>
            </View>
           
        </View>
        </ScrollView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    FormLogin:{
        marginHorizontal:40,
        alignItems:'center'
    },
    BoxInput:{
        borderBottomWidth:1,
        marginBottom:20,
        flexDirection:'row',
        alignItems:'center',
    },
    TextInput:{
        fontSize:12,
        marginVertical:5,
        flex:5,
        color:'black',
        fontFamily:'Poppins-Regular'
    },
    LoginButton:{
        height:40,
        backgroundColor:'#0D986A',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        width:200,
        marginTop:20,
        marginBottom:10
    },
    RegisterButton:{
        height:40,
        backgroundColor:'#d34539',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        width:200,
        marginTop:0
    },
    ResetPassworButton:{
        height:40,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        width:200,
        marginTop:0,
        borderWidth:1
    },
    TextLoginButton:{
        color:'white',
        fontSize:14,
        fontWeight:'bold'
    },
    TextRSTPasswordButton:{
        color:'black',
        fontSize:14,
        fontWeight:'bold'
    },
    FooterLogin:{
        marginTop:20,
        alignItems:'center'
    },
    TextFooter:{
        fontSize:12,
        color:'grey',
        fontFamily:'Poppins-Regular',
    },
    TextPoppinsBlueUnderline:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'blue',
        textDecorationLine:'underline'
    },
    TextPoppins:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'black'
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
    BtnBoxDisable:{
        backgroundColor:'rgba(0,128,0,0.5)',
        height:40,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        width:200,
        marginTop:20,
        marginBottom:10
    },
})