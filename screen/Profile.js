import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform, TextInput, Alert, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

import plantGrow from '../assets/images/plantGrow.png'
import IconSmile from '../assets/images/IconSmile.png'
import iconLove from '../assets/images/iconLove.png'
import Angin from '../assets/images/Angin.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import UserImage from '../assets/images/boy.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const Profile = ({navigation}) => {

    const [IDUser, setIDUser] = useState('');
    const [NamaPengguna, setNamaPengguna] = useState('');
    const [Pekerjaan, setPekerjaan] = useState('');
    const [Role, setRole] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [PasswordKonf, setPasswordKonf] = useState('');
    const [DataListUser, setDataListUser] = useState('');

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        // console.log(jsonValue)
        setIDUser(ParsingDataUser[0].id_user);
        setNamaPengguna(ParsingDataUser[0].nama);
        setUsername(ParsingDataUser[0].username);
        setPekerjaan(ParsingDataUser[0].pekerjaan);
        setRole(ParsingDataUser[0].role);

        } catch(e) {
        // error reading value
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

    const ActionUserAkses = () => {
        if(Role == 'admin'){
            return(
                <View style={{marginLeft:20}}>
                    <Text style={styles.TextPoppinsBold}>{NamaPengguna}</Text>
                    <Text style={styles.TextPoppins}>{Pekerjaan}</Text>
                    <TouchableOpacity style={styles.BoxBtn} onPress={()=>navigation.navigate('UbahProfile')}>
                        <Text style={styles.TextBtn}>Ubah Akses</Text>
                        <AntDesign name="key" size={14} color="white" style={{marginLeft:5}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.BoxBtnLogout} onPress={()=>LogoutGo()}>
                        <Text style={styles.TextBtn}>Logout</Text>
                        <AntDesign name="logout" size={14} color="white" style={{marginLeft:5}} />
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
            <View style={{marginLeft:20}}>
                <Text style={styles.TextPoppinsBold}>{NamaPengguna}</Text>
                <Text style={styles.TextPoppins}>{Pekerjaan}</Text>
                <TouchableOpacity style={styles.BoxBtnLogout} onPress={()=>LogoutGo()}>
                    <Text style={styles.TextBtn}>Logout</Text>
                    <AntDesign name="logout" size={14} color="white" style={{marginLeft:5}} />
                </TouchableOpacity>
            </View>
            )
        }
    }

    const Item = ({ nama, pekerjaan, id_user }) => (
        <TouchableOpacity style={styles.CardListUser} onPress={()=>navigation.navigate('UbahUserData', {IDUser:id_user})}>
            <Text style={styles.TextPoppinsBold}>{nama}</Text>
            <Text style={styles.TextPoppins}>{pekerjaan}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item nama={item.nama} pekerjaan={item.pekerjaan} id_user={item.id_user} />;

    const GetDataUser = () => {
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://alicestech.com/kelasbertani/api/user/list", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.status == true){
                console.log(result.result);
                setDataListUser(result.result);
            }
        })
        .catch(error => console.log('error', error));
    }

    const BtnAddUser = () => {
        if(Role == 'admin'){
            return(
                <TouchableOpacity style={styles.TambahUserBtn} onPress={()=>navigation.navigate('TambahPengguna')}>
                    <AntDesign name="pluscircleo" size={24} color="white" />
                </TouchableOpacity>
            )
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

    const ContentProfile = () => {
        if(Role == 'admin'){
            return (
                <View style={{marginHorizontal:20, marginTop:20, marginBottom:5}}>
                    <Text style={styles.TextPoppinsBoldGreen}>Daftar Pengguna Aplikasi</Text>

                    <FlatList data={DataListUser} renderItem={renderItem} keyExtractor={item => item.id_user} />
                   
    
                </View>
            )
        }else{
            return (
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
                    <View style={styles.FormInput}>
                        <Text style={styles.TextPoppins}>Tugas/Jabatan/Status</Text>
                        <View style={styles.FormInputBox}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Pekerjaan => setPekerjaan(Pekerjaan)}
                            defaultValue={Pekerjaan}
                            />
                        </View>
                    </View>
                    

                    <TouchableOpacity style={styles.BtnBox} onPress={()=>SimpanDataUser()}>
                        <Text style={styles.BtnTitle}>Simpan Data</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const SimpanDataUSerAsyn = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@DataUser', jsonValue)
            // console.log('Simpan Data User')
        } catch (e) {
            // saving error
        }
    }

    const SimpanDataUser = () => {
        // console.log('Ubah User Data');

        var dataToSend = { 
        id_user:IDUser,
        username: Username,
        nama: NamaPengguna,
        pekerjaan: Pekerjaan,
        password: Password,
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
            // console.log(responseJson);
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

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        GetDataUser();
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

      const HapusDataUser = async () => {
        try {
            await AsyncStorage.removeItem('@DataUser');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            navigation.navigate('Login');
            return true;
        }
        catch(exception) {
            return false;
        }
      }

      const LogoutGo = () => {
        HapusDataUser();
      }
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center'}}>
        <View style={{marginBottom:50, width:windowWidth}}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Profile Pengguna</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start', paddingHorizontal:10, marginTop:25}}>
                <View style={{backgroundColor:'#E2E2E2', width:100, height:100, borderRadius:50, alignItems:'center', justifyContent:'center'}}>
                    <Image source={UserImage} style={{width:70, resizeMode:'contain'}} />
                </View>
                {ActionUserAkses()}
            </View>
            {ContentProfile()}
        </View>
        
        {BtnAddUser()}

        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('FavouriteLocalData')} style={{flex:1, alignItems:'center'}}>
            <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('DaftarController', {IDUser:IDUser})}>
            <SimpleLineIcons name="game-controller" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
    TopBarBox:{
        ...Platform.select({
            ios:{
            marginTop:14,
            },
            android:{
            marginTop:14
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
                height:50,
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
        color:'#0D986A',
        marginBottom:10
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
        marginTop:2,
        borderRadius:10,
        marginBottom:10
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
    BoxBtnLogout:{
        backgroundColor:'red',
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
    }
})