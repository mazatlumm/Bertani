import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));
let CountRender = 0;

const SettingController = ({navigation, route}) => {

    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('');
    const [NamaPerangkat, setNamaPerangkat] = useState('');
    const [Tanaman, setTanaman] = useState('');
    const [HumMin, setHumMin] = useState('');
    const [HumMax, setHumMax] = useState('');
    const [DeviceKanal1, setDeviceKanal1] = useState('');
    const [DeviceKanal2, setDeviceKanal2] = useState('');
    const [DeviceKanal3, setDeviceKanal3] = useState('');
    const [DeviceKanal4, setDeviceKanal4] = useState('');
    const [Lokasi, setLokasi] = useState('');

    if(route.params != undefined && CountRender == 0){
        setIDDevice(route.params.IDDevice);
        console.log(route.params.IDDevice);
        CountRender = 1;
    }

    const OpenScanner = () => {
        navigation.navigate('QRScanner');
        CountRender = 0;
    }

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        console.log(ParsingDataUser[0].id_user)
        if(ParsingDataUser[0].id_user){
            setIDUser(ParsingDataUser[0].id_user);
        }
        } catch(e) {
        // error reading value
        }
    }

    const TambahControllerAPI = () => {
        console.log('Tambah Controller');

        var dataToSend = { 
        id_device: IDDevice,
        id_user: IDUser,
        nama_perangkat: NamaPerangkat,
        tanaman: Tanaman,
        hum_min: HumMin,
        hum_max: HumMax,
        lokasi: Lokasi,
        kanal1: DeviceKanal1,
        kanal2: DeviceKanal2,
        kanal3: DeviceKanal3,
        kanal4: DeviceKanal4,
        }

        var formBody = [];
        for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        //POST request
        fetch('https://alicestech.com/kelasbertani/api/controller', {
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
                navigation.navigate('DaftarController', {IDUser:IDUser})
            }else{
                Alert.alert('Gagal', 'Perangkat Sudah Terdaftar');
            }
        })
        //If response is not in json then in error
        .catch((error) => {
            console.error(error);
        });
        console.log('Udah Simpan?')
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
        <ScrollView style={{marginBottom:50, width:windowWidth}}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Tambah Controller</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack() }>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={{marginHorizontal:20, marginTop:20, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={IDDevice => setIDDevice(IDDevice)}
                            defaultValue={IDDevice}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup} onPress={()=> OpenScanner()}>
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Nama Perangkat</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={NamaPerangkat => setNamaPerangkat(NamaPerangkat)}
                        defaultValue={NamaPerangkat}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Tanaman</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Tanaman => setTanaman(Tanaman)}
                        defaultValue={Tanaman}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban Minimal</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm}
                            keyboardType={'number-pad'}
                            onChangeText={HumMin => setHumMin(HumMin)}
                            defaultValue={HumMin}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup}>
                            <MaterialCommunityIcons name="water-percent" size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban Maksimal</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm}
                            keyboardType={'number-pad'}
                            onChangeText={HumMax => setHumMax(HumMax)}
                            defaultValue={HumMax}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup}>
                            <MaterialCommunityIcons name="water-percent" size={24} color="orange" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 1</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DeviceKanal1 => setDeviceKanal1(DeviceKanal1)}
                        defaultValue={DeviceKanal1}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 2</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DeviceKanal2 => setDeviceKanal2(DeviceKanal2)}
                        defaultValue={DeviceKanal2}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 3</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DeviceKanal3 => setDeviceKanal3(DeviceKanal3)}
                        defaultValue={DeviceKanal3}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 4</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'}
                        onChangeText={DeviceKanal4 => setDeviceKanal4(DeviceKanal4)}
                        defaultValue={DeviceKanal4}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Lokasi Controller</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Lokasi => setLokasi(Lokasi)}
                        defaultValue={Lokasi}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.BtnBox} onPress={()=> TambahControllerAPI()}>
                    <Text style={styles.BtnTitle}>Simpan Data</Text>
                    <MaterialIcons name="save-alt" style={{marginLeft:10}} size={18} color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            <Image source={iconBag} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default SettingController

const styles = StyleSheet.create({
    TopBarBox:{
        ...Platform.select({
            ios:{
            marginTop:50,
            },
            android:{
            marginTop:35
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
                height:70
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