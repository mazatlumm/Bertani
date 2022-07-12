import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform,TextInput, Alert, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const UbahProfile = ({navigation}) => {

    const [IDUser, setIDUser] = useState('');
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

    const SimpanDataUser = () => {
        console.log('Ubah User Data');

        var dataToSend = { 
            id_user:IDUser,
            username: Username,
            nama: NamaPengguna,
            pekerjaan: Pekerjaan,
            email: Email,
            no_telp: NoTelp,
            alamat: AlamatRumah,
            password: Password,
            gender: Gender,
            birthday: TanggalLahir,
        }

        var formBody = [];
        for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        //POST request
        fetch('https://alicestech.com/kelasbertani/api/user/edit', {
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
            console.log(responseJson);
            if(responseJson.status == true){
                Alert.alert('Berhasil', 'Data Anda Berhasil Disimpan')
                SimpanDataUSerAsyn(responseJson.result)
            }else{
                Alert.alert('Gagal', 'Data Tidak Dapat Disimpan');
            }
        })
        //If response is not in json then in error
        .catch((error) => {
            console.error(error);
        });
    }

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        setIDUser(ParsingDataUser[0].id_user);
        setNamaPengguna(ParsingDataUser[0].nama);
        setUsername(ParsingDataUser[0].username);
        setPekerjaan(ParsingDataUser[0].pekerjaan);
        setNoTelp(ParsingDataUser[0].no_telp);
        setAlamatRumah(ParsingDataUser[0].alamat);
        setEmail(ParsingDataUser[0].email);
        setGender(ParsingDataUser[0].gender);
        setTanggalLahir(ParsingDataUser[0].birthday);
        } catch(e) {
        // error reading value
        }
    }

    const PilihKelamin = (jenis) => {
        setModalVisibleJenisKelamin(!modalVisibleJenisKelamin);
        setGender(jenis);
    }

    const CekPassword = (cek) => {
        setPasswordKonf(cek);
        if(Password != cek){
            console.log('Password Tidak Sesuai');
        }else{
            console.log('Password Sesuai');
        }
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
        LihatDataUser();
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
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Ubah Profile</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={{marginHorizontal:20, marginTop:20, marginBottom:10}}>
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
            <TouchableOpacity style={styles.BtnBox} onPress={()=>SimpanDataUser()}>
                <Text style={styles.BtnTitle}>Simpan Data</Text>
            </TouchableOpacity>
            </View>
           
        </ScrollView>
    </View>
  )
}

export default UbahProfile

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
    },
    TextInputFormList:{
        fontFamily:'Poppins-Regular',
        color:'black',
        fontSize:12
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
    FormInputList:{
        marginTop:10,
        zIndex:10
      },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
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
    }
})