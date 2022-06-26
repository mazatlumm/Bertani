import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));
let CountRender = 0;

const SettingController = ({navigation, route}) => {

    const [IDController, setIDController] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('');
    const [NamaPerangkat, setNamaPerangkat] = useState('');
    const [JenisTanaman, setJenisTanaman] = useState('');
    const [HumMin, setHumMin] = useState('');
    const [HumMax, setHumMax] = useState('');
    const [DataKanal1, setDataKanal1] = useState('');
    const [DataKanal2, setDataKanal2] = useState('');
    const [DataKanal3, setDataKanal3] = useState('');
    const [DataKanal4, setDataKanal4] = useState('');
    const [Lokasi, setLokasi] = useState('');

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            setIDController(route.params.IDController);
            setIDDevice(route.params.IDDevice);
            setIDUser(route.params.IDUser);
            setNamaPerangkat(route.params.NamaPerangkat);
            setJenisTanaman(route.params.JenisTanaman);
            setHumMin(route.params.HumMin);
            setHumMax(route.params.HumMax);
            setDataKanal1(route.params.DataKanal1);
            setDataKanal2(route.params.DataKanal2);
            setDataKanal3(route.params.DataKanal3);
            setDataKanal4(route.params.DataKanal4);
            setLokasi(route.params.Lokasi);
        }
    }

    const DetailControllerCek = () => {
        CountRender = 0;
        navigation.navigate('DetailController', {IDUser:IDUser, IDController:IDController, IDDevice:IDDevice})
    }

    const OpenScanner = () => {
        CountRender = 0;
        navigation.navigate('QRScannerSC',{
            IDController:IDController,
            IDDevice:IDDevice,
            IDUser:IDUser,
            NamaPerangkat:NamaPerangkat,
            JenisTanaman:JenisTanaman,
            HumMin:HumMin,
            HumMax:HumMax,
            DataKanal1:DataKanal1,
            DataKanal2:DataKanal2,
            DataKanal3:DataKanal3,
            DataKanal4:DataKanal4,
            Lokasi:Lokasi,
            ScreenName:'DetailController',
        });
    }

    const UbahControllerAPI = () => {
        console.log('Ubah Controller');

        var dataToSend = { 
        id_controller:IDController,
        id_device: IDDevice,
        id_user: IDUser,
        nama_perangkat: NamaPerangkat,
        tanaman: JenisTanaman,
        hum_min: HumMin,
        hum_max: HumMax,
        lokasi: Lokasi,
        kanal1: DataKanal1,
        kanal2: DataKanal2,
        kanal3: DataKanal3,
        kanal4: DataKanal4,
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
        method: 'PUT', //Request Type
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
                navigation.navigate('DetailController', {IDUser:IDUser, IDController:IDController, IDDevice:IDDevice})
            }else{
                Alert.alert('Gagal', 'Perubahan Tidak Dapat Disimpan');
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
        console.log('SettingController Mulai')
        AmbilDataRoute()
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Setting Controller</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> DetailControllerCek()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={{marginHorizontal:20, marginTop:10, marginBottom:10}}>
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
                        onChangeText={JenisTanaman => setJenisTanaman(JenisTanaman)}
                        defaultValue={JenisTanaman}
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
                        onChangeText={DataKanal1 => setDataKanal1(DataKanal1)}
                        defaultValue={DataKanal1}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 2</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DataKanal2 => setDataKanal2(DataKanal2)}
                        defaultValue={DataKanal2}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 3</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DataKanal3 => setDataKanal3(DataKanal3)}
                        defaultValue={DataKanal3}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 4</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} 
                        onChangeText={DataKanal4 => setDataKanal4(DataKanal4)}
                        defaultValue={DataKanal4}
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

                <TouchableOpacity style={styles.BtnBox} onPress={()=> UbahControllerAPI()}>
                    <Text style={styles.BtnTitle}>Simpan Data</Text>
                    <MaterialIcons name="save-alt" style={{marginLeft:10}} size={18} color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
                <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('FavouriteLocalData')}>
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

export default SettingController

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:0
            },
            android:{
                marginBottom:50
            }
        }),
        width:windowWidth, 
        backgroundColor:'white',
        height:windowHeight
    },
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
        // backgroundColor:'white', 
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