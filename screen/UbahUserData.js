import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform,TextInput, Alert, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const UbahUserData = ({navigation, route}) => {

    const [IDUserLogin, setIDUserLogin] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [NamaPengguna, setNamaPengguna] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [PasswordKonf, setPasswordKonf] = useState('');
    const [Pekerjaan, setPekerjaan] = useState('');
    const [Email, setEmail] = useState('');
    const [NoTelp, setNoTelp] = useState('');
    const [AlamatRumah, setAlamatRumah] = useState('');
    const [ModalGantiRole, setModalGantiRole] = useState(false);
    const [RoleUser, setRoleUser] = useState(false);

    const LihatDataUserLogin =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        setIDUserLogin(ParsingDataUser[0].id_user); 
        } catch(e) {
        // error reading value
        }
    }

    const AmbilDataRoute = () => {
        if(route.params != undefined){
            console.log('IDUser : ' + route.params.IDUser);
            setIDUser(route.params.IDUser);
            LihatDataUser(route.params.IDUser)
        }
    }

    const SimpanDataUser = () => {
        console.log('Ubah User Data');

        var dataToSend = { 
        id_user:IDUser,
        username: Username,
        nama: NamaPengguna,
        pekerjaan: Pekerjaan,
        password: Password,
        email: Email,
        no_telp: NoTelp,
        alamat: AlamatRumah,
        role: RoleUser,
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
                Alert.alert('Berhasil', 'Data User Berhasil Disimpan')
            }else{
                Alert.alert(responseJson.message, 'Akun lain telah menggunakan username ini');
            }
        })
        //If response is not in json then in error
        .catch((error) => {
            console.error(error);
        });
    }

    const LihatDataUser =  async(id_user) => {
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://alicestech.com/kelasbertani/api/user/detail?id_user="+id_user, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.status == true){
                console.log(result.result);
                setNamaPengguna(result.result[0].nama);
                setUsername(result.result[0].username);
                setPekerjaan(result.result[0].pekerjaan);
                setEmail(result.result[0].email);
                setAlamatRumah(result.result[0].alamat);
                setNoTelp(result.result[0].no_telp);
                setRoleUser(result.result[0].role);
            }else{
                console.log('Gagal Mendapatkan Data User')
            }
        })
        .catch(error => console.log('error', error));
    }

    const KonfirmasiHapusUser = () => {
        Alert.alert(
          "Apakah Anda Yakin?",
          "Akun Akan Dihapus Secara Permanen",
          [
            {
              text: "Batalkan",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Lanjutkan", onPress: () => {
                HapusUser();
            } }
          ]
        );
    }

    const HapusUser = () => {
        var dataToSend = { 
            id_user:IDUser,
            }
    
            var formBody = [];
            for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
            //POST request
            fetch('https://alicestech.com/kelasbertani/api/user/hapus?id_user='+IDUser, {
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
                    navigation.goBack();
                }else{
                    Alert.alert('Gagal', 'Data Tidak Dapat Dihapus');
                }
            })
            //If response is not in json then in error
            .catch((error) => {
                console.error(error);
            });
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

    const PilihRoleUser = (role) => {
        setRoleUser(role);
        setModalGantiRole(!ModalGantiRole);
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        AmbilDataRoute();
        LihatDataUserLogin();
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
        {/* Modal Ganti Role */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={ModalGantiRole}
            onRequestClose={() => {
                // Alert.alert("Modal has been closed.");
                setModalVisibleJenisKelamin(!ModalGantiRole);
            }}
            >
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
                <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20}}>
                    <Text style={styles.TextInputForm}>Pilih Role User</Text>
                    <TouchableOpacity onPress={()=>PilihRoleUser('Penyuluh')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', marginTop:10}}>
                    <Text style={styles.TextInputForm}>Penyuluh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>PilihRoleUser('Pengguna Umum')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', marginTop:10}}>
                    <Text style={styles.TextInputForm}>Pengguna Umum</Text>
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
                    <Text style={styles.TextPoppins}>Nama Lengkap</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={NamaPengguna => setNamaPengguna(NamaPengguna)}
                        defaultValue={NamaPengguna}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Username</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Username => setUsername(Username)}
                        defaultValue={Username}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Email</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Email => setEmail(Email)}
                        defaultValue={Email}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>No Telepon/WA</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={NoTelp => setNoTelp(NoTelp)}
                        defaultValue={NoTelp}
                        keyboardType={'phone-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Alamat Rumah</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={AlamatRumah => setAlamatRumah(AlamatRumah)}
                        defaultValue={AlamatRumah}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Pekerjaan</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Pekerjaan => setPekerjaan(Pekerjaan)}
                        defaultValue={Pekerjaan}
                        />
                    </View>
                </View>
                <View style={styles.FormInputList}>
                    <Text style={styles.TextPoppins}>Role User</Text>
                    <TouchableOpacity style={styles.FormInputBoxList} onPress={() => setModalGantiRole(!ModalGantiRole)}>
                        <View>
                        <Text style={styles.TextInputFormList}>{RoleUser}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Password</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} secureTextEntry={true} 
                        onChangeText={Password => setPassword(Password)}
                        defaultValue={Password}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Konfirmasi Password</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} secureTextEntry={true} 
                        onChangeText={PasswordKonf => CekPassword(PasswordKonf)}
                        defaultValue={PasswordKonf}
                        />
                    </View>
                    {WarningPassword()}
                </View>
                

                <TouchableOpacity style={styles.BtnBox} onPress={()=>SimpanDataUser()}>
                    <Text style={styles.BtnTitle}>Simpan Data</Text>
                </TouchableOpacity>

                <View style={{marginHorizontal:20, marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>Apakah pengguna ini melakukan pelanggaran?</Text>
                    <Text>Anda dapat menghapus user ini secara permanen dengan menekan tombol di bawah ini</Text>
                </View>
                <TouchableOpacity style={{backgroundColor:'red', paddingVertical:10, alignItems:'center', marginTop:10, borderRadius:10, marginHorizontal:20}} onPress={()=>KonfirmasiHapusUser()}>
                    <Text style={styles.TextBtn}>Hapus User</Text>
                </TouchableOpacity>
            </View>
           
        </ScrollView>
    </View>
  )
}

export default UbahUserData

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
    },
    FormInputList:{
        marginTop:10,
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
    TextInputFormList:{
        fontFamily:'Poppins-Regular',
        color:'black',
        fontSize:12
    },
})