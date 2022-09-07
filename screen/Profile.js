import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform, TextInput, Alert, FlatList, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'

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
    const [DataAllUser, setDataAllUser] = useState('');
    const [Email, setEmail] = useState('');
    const [NoTelp, setNoTelp] = useState('');
    const [AlamatRumah, setAlamatRumah] = useState('');
    const [RoleUser, setRoleUser] = useState('');
    const [SearchPengguna, setSearchPengguna] = useState('');
    const [ProfileImage, setProfileImage] = useState('');
    const [Gender, setGender] = useState('Pilih Jenis Kelamin');
    const [TanggalLahir, setTanggalLahir] = useState('Tanggal Lahir')
    const [modalVisibleJenisKelamin, setModalVisibleJenisKelamin] = useState(false);
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

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
        setProfileImage(ParsingDataUser[0].photo);
        CekDataUserUpdate(ParsingDataUser[0].id_user);
        setGender(ParsingDataUser[0].gender);
        setTanggalLahir(ParsingDataUser[0].birthday);
        setRoleUser(ParsingDataUser[0].role);
        } catch(e) {
        // error reading value
        }
    }

    const CekDataUserUpdate =  async(id_user) => {
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        console.log('fetch user dengan id: ' + id_user)

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
                setProfileImage(result.result[0].photo);
                setGender(result.result[0].gender);
                setTanggalLahir(result.result[0].birthday);
                setRoleUser(result.result[0].role);
            }else{
                console.log('Gagal Mendapatkan Data User')
            }
        })
        .catch(error => console.log('error', error));
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {

            var myHeaders = new Headers();
            
            let localUri = result.uri;
            let filename = localUri.split('/').pop();
          
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            var formdata = new FormData();
            formdata.append("id_user", IDUser);
            formdata.append("image", { uri: localUri, name: filename, type: type});
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow'
            };
        
            await fetch("https://alicestech.com/kelasbertani/api/user/photo_profile", requestOptions)
              .then(response => response.json())
              .then(result => {
                  console.log(result);
                  setProfileImage(result.photo)
                  console.log('Simpan Data User')
                  SimpanDataUser()
              })
              .catch(error => console.log('error', error));
          
        }
    };

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

    const ActionUserAkses = () => {
        if(Role == 'admin'){
            return(
                <View style={{marginLeft:20}}>
                    <Text style={styles.TextPoppinsBold}>{NamaPengguna}</Text>
                    <Text style={styles.TextPoppins}>{Pekerjaan}</Text>
                    <TouchableOpacity style={styles.BoxBtn} onPress={()=>navigation.navigate('UbahProfile')}>
                        <Text style={styles.TextBtn}>Ubah Data User</Text>
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
                // console.log(result.result);
                setDataListUser(result.result);
                setDataAllUser(result.result);
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

    const SearchUser = (cari) => {
        const search = what => DataListUser.find(element => element.email === what);
        const found = search(cari);
        if (found && cari != "") {
            console.log(found);
            setDataListUser([found])
        } else {
            console.log('No result found');
            setDataListUser(DataAllUser);
        }
    }

    const ContentProfile = () => {
        if(Role == 'admin'){
            return (
                <View style={{marginHorizontal:20, marginTop:20, flex:1}}>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={SearchPengguna => SearchUser(SearchPengguna)}
                            defaultValue={SearchPengguna}
                            placeholder='Cari Berdasarkan Email'
                            />
                        </View>
                    </View>
                    <View style={{marginBottom:10}}></View>
                    <Text style={styles.TextPoppinsBoldGreen}>Daftar Pengguna Aplikasi</Text>
                    
                    <FlatList data={DataListUser} renderItem={renderItem} keyExtractor={item => item.id_user} />
                   
    
                </View>
            )
        }else{
            return (
                <View style={{marginHorizontal:20, marginTop:20, flex:1}}>
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

                    <ScrollView style={{marginBottom:5}} contentContainerStyle={{ flexGrow: 1 }}>
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
                    </ScrollView>
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
        email: Email,
        no_telp: NoTelp,
        alamat: AlamatRumah,
        password: Password,
        gender: Gender,
        birthday: TanggalLahir,
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
            // console.log(responseJson);
            if(responseJson.status == true){
                Alert.alert('Berhasil', 'Data Anda Berhasil Disimpan')
                SimpanDataUSerAsyn(responseJson.result)
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
        <View style={{width:windowWidth, flex:1}}>
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
                <TouchableOpacity onPress={()=> pickImage()} style={{backgroundColor:'#E2E2E2', width:100, height:100, borderRadius:50, alignItems:'center', justifyContent:'center'}}>
                {ProfileImage == '' ? 
                    <Image source={UserImage} style={{width:70, resizeMode:'contain'}} />
                    : <Image source={{uri: 'https://alicestech.com/kelasbertani/upload/profile/'+ProfileImage}} style={{width:100, height:100, borderRadius:50}} />
                }
                </TouchableOpacity>
                {ActionUserAkses()}
            </View>
            {ContentProfile()}
        </View>
        
        {BtnAddUser()}
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
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
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
        bottom:30,
        right:20
    },
    FormInput:{
        marginTop:10,
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