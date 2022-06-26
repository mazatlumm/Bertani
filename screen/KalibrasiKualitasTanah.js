import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput, ToastAndroid } from 'react-native'
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));
let CountRender = 0;

const KalibrasiKualitasTanah = ({navigation, route}) => {

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            console.log('id_device : ' + route.params.id_device);
            setIDDevice(route.params.id_device);
            CekKalibrasiTersimpan(route.params.id_device);
        }
    }

    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('');
    const [Nitrogen, setNitrogen] = useState('');
    const [Phosphorus, setPhosphorus] = useState('');
    const [Kalium, setKalium] = useState('');
    const [Suhu, setSuhu] = useState('');
    const [Kelembaban, setKelembaban] = useState('');
    const [PH, setPH] = useState('');
    const [Konduktifitas, setKonduktifitas] = useState('');
    const [Salinitas, setSalinitas] = useState('');
    const [TDS, setTDS] = useState('');
    const [ArrKalibrasi, setArrKalibrasi] = useState([]);

    const CekKalibrasiTersimpan =  async(id_device) => {
        try {
            const jsonValue = await AsyncStorage.getItem('@Kalibrasi' + id_device)
            const KalibrasiSensor = JSON.parse(jsonValue);
            console.log(jsonValue)
            console.log(KalibrasiSensor)
            if(KalibrasiSensor == null){
            }else{
                setNitrogen(KalibrasiSensor[0].nitrogen)
                setPhosphorus(KalibrasiSensor[0].phosporus)
                setKalium(KalibrasiSensor[0].kalium)
                setSuhu(KalibrasiSensor[0].suhu)
                setKelembaban(KalibrasiSensor[0].kelembaban)
                setPH(KalibrasiSensor[0].ph)
                setKonduktifitas(KalibrasiSensor[0].konduktifitas)
                setSalinitas(KalibrasiSensor[0].salinitas)
                setTDS(KalibrasiSensor[0].tds)
            }
        } catch(e) {
        // error reading value
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        AmbilDataRoute();
        console.log('Kalibrasi Kualitas Tanah Mulai')
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

    const SetKalibrasi = () => {
        SimpanKalibrasi(ReadyPushKalibrasi);
        console.log('Set Kalibrasi')
    }

    const SimpanKalibrasi = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@Kalibrasi' + IDDevice, jsonValue)
            console.log('Simpan Kalibrasi Berhasil')
            //toast
            ToastAndroid.showWithGravity(
                "Kalibrasi Berhasil Disimpan",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        } catch (e) {
            // saving error
        }
    }

    const ReadyPushKalibrasi = [{
        id_user : IDUser,
        id_device : IDDevice,
        nitrogen : Nitrogen,
        phosporus : Phosphorus,
        kalium : Kalium,
        suhu : Suhu,
        kelembaban : Kelembaban,
        ph : PH,
        konduktifitas : Konduktifitas,
        salinitas : Salinitas,
        tds : TDS,
    }];

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Kalibrasi Kualitas Tanah</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={{marginHorizontal:20, marginTop:10, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Nitrogen</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Nitrogen => setNitrogen(Nitrogen)}
                        defaultValue={Nitrogen}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Phosporus</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Phosphorus => setPhosphorus(Phosphorus)}
                        defaultValue={Phosphorus}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kalium</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Kalium => setKalium(Kalium)}
                        defaultValue={Kalium}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Suhu</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Suhu => setSuhu(Suhu)}
                        defaultValue={Suhu}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Kelembaban => setKelembaban(Kelembaban)}
                        defaultValue={Kelembaban}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>PH</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={PH => setPH(PH)}
                        defaultValue={PH}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Konduktifitas</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Konduktifitas => setKonduktifitas(Konduktifitas)}
                        defaultValue={Konduktifitas}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Salinitas</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Salinitas => setSalinitas(Salinitas)}
                        defaultValue={Salinitas}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>TDS</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={TDS => setTDS(TDS)}
                        defaultValue={TDS}
                        keyboardType={'number-pad'}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.BtnBox} onPress={()=> SetKalibrasi()}>
                    <Text style={styles.BtnTitle}>Simpan Kalibrasi</Text>
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

export default KalibrasiKualitasTanah

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