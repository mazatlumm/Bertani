import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform,TextInput, Alert, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
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

const RegisterScreen = ({navigation}) => {

    const [NamaPengguna, setNamaPengguna] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [PasswordKonf, setPasswordKonf] = useState('');
    const [Pekerjaan, setPekerjaan] = useState('');
    const [Email, setEmail] = useState('');
    const [NoTelp, setNoTelp] = useState('');
    const [AlamatRumah, setAlamatRumah] = useState('');
    const [Gender, setGender] = useState('Pilih Jenis Kelamin');
    const [TanggalLahir, setTanggalLahir] = useState('Tanggal Lahir')
    const [modalVisibleJenisKelamin, setModalVisibleJenisKelamin] = useState(false);
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const SimpanDataUSerAsyn = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@DataUser', jsonValue)
          console.log('Simpan Data User')
        } catch (e) {
          // saving error
        }
    }

    const CekPassword = (cek) => {
        setPasswordKonf(cek);
        if(Password != cek){
            console.log('Password Tidak Sesuai');
        }else{
            console.log('Password Sesuai');
        }
    }


    const UserRegister = async () => {
      let hitungData = 0;
      if(NamaPengguna != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Nama Lengkap Belum Diisi');
      }
      if(Username != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Username Belum Diisi');
      }
      if(Email != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Email Belum Diisi');
      }
      if(Gender != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Jenis Kelamin Belum Diisi');
      }
      if(TanggalLahir != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Tanggal Lahir Belum Diisi');
      }
      if(Pekerjaan != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Pekerjaan Belum Diisi');
      }
      if(NoTelp != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'No Handphone Belum Diisi');
      }
      if(AlamatRumah != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Alamat Rumah Belum Diisi');
      }
      if(Password != ''){
        hitungData++;
      }else{
        Alert.alert('Peringatan', 'Password Belum Diisi');
      }
      if(hitungData == 9){
        const ParameterUrl = { 
          nama:NamaPengguna,
          username:Username,
          email:Email,
          gender:Gender,
          birthday:TanggalLahir,
          pekerjaan:Pekerjaan,
          no_telp:NoTelp,
          alamat:AlamatRumah,
          role:"Pengguna Umum",
          password:Password,
        }
        console.log(ParameterUrl)
        await axios.post('https://alicestech.com/kelasbertani/api/user/register', ParameterUrl)
        .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            Alert.alert('Berhasil', 'Akun Anda Berhasil Dibuat, Login Sekarang',[
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
        });
      }else{
          Alert.alert('Peringatan', 'Data Belum Lengkap');
      }
    }

    const PilihKelamin = (jenis) => {
      setModalVisibleJenisKelamin(!modalVisibleJenisKelamin);
      setGender(jenis);
    }

    const WarningPassword = () => {
        if(Password != PasswordKonf){
            return (
                <View>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'red', marginBottom:5}}>Password Tidak Sesuai</Text>
                </View>
            )
        }
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
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(date) => {
            setOpen(false)
            setDate(date)
            var formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

            setTanggalLahir(formattedDate)
          }}
          onCancel={() => {
            setOpen(false)
          }}
          mode={"date"}
          title={"Pilih Tanggal Lahir"}
          confirmText={"Selesai"}
          cancelText={"Batal"}
          locale="id"
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleJenisKelamin}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisibleJenisKelamin(!modalVisibleJenisKelamin);
          }}
        >
         <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20}}>
                <Text style={styles.TextInputForm}>Pilih Jenis Kelamin</Text>
                <TouchableOpacity onPress={()=>PilihKelamin('Laki-Laki')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', marginTop:10}}>
                  <Text style={styles.TextInputForm}>Laki-Laki</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>PilihKelamin('Perempuan')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', marginTop:10}}>
                  <Text style={styles.TextInputForm}>Perempuan</Text>
                </TouchableOpacity>
            </View>
         </View>
      </Modal>
        <ScrollView style={{width:windowWidth}}>
          <View style={{width:'100%', alignItems:'center', marginTop:10}}>
            <Image source={farmer} style={{height:100, width:100}} />
            <Text style={styles.TitleFormPendaftaran}>Form Pendaftaran Akun Bertani</Text>
          </View>
            <View style={{marginHorizontal:20, marginTop:5, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={NamaPengguna => setNamaPengguna(NamaPengguna)}
                        defaultValue={NamaPengguna}
                        placeholder='Nama Lengkap'
                        />
                    </View>
                </View>
                <View style={styles.FormInputList}>
                    <TouchableOpacity style={styles.FormInputBoxList} onPress={() => setModalVisibleJenisKelamin(!modalVisibleJenisKelamin)}>
                        <View>
                          <Text style={styles.TextInputFormList}>{Gender}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInputList}>
                    <TouchableOpacity style={styles.FormInputBoxList} onPress={() => setOpen(true)}>
                        <View>
                          <Text style={styles.TextInputFormList}>{TanggalLahir}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Username => setUsername(Username)}
                        defaultValue={Username}
                        placeholder='Username'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Email => setEmail(Email)}
                        defaultValue={Email}
                        placeholder='Email Aktif'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Pekerjaan => setPekerjaan(Pekerjaan)}
                        defaultValue={Pekerjaan}
                        placeholder='Pekerjaan'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={NoTelp => setNoTelp(NoTelp)}
                        defaultValue={NoTelp}
                        keyboardType={'phone-pad'}
                        placeholder='Nomor Handphone/WA'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={AlamatRumah => setAlamatRumah(AlamatRumah)}
                        defaultValue={AlamatRumah}
                        placeholder='Alamat Rumah'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} secureTextEntry={true} 
                        onChangeText={Password => setPassword(Password)}
                        defaultValue={Password}
                        placeholder='Password'
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} secureTextEntry={true} 
                        onChangeText={PasswordKonf => CekPassword(PasswordKonf)}
                        defaultValue={PasswordKonf}
                        placeholder='Ketik Ulang Password'
                        />
                    </View>
                    {WarningPassword()}
                </View>
                

                <TouchableOpacity style={styles.BtnBox} onPress={()=>UserRegister()}>
                    <Text style={styles.BtnTitle}>Daftar Sekarang</Text>
                </TouchableOpacity>
            </View>
           
        </ScrollView>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    TopBarBox:{
        ...Platform.select({
            ios:{
            marginTop:50,
            },
            android:{
            marginTop:10
            }
        }),
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
    },
    ColorTopBar:{
        position:'absolute', 
        width:windowWidth,
        ...Platform.select({
            ios:{
                height:90,
            },
            android:{
                height:50
            }
        }), 
        backgroundColor:'#9CE5CB', 
        top:0, 
        left:0, 
        zIndex:-2
    },
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