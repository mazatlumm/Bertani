import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform, Alert, Modal, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import plantGrow from '../assets/images/plantGrow.png'
import IconSmile from '../assets/images/IconSmile.png'
import iconLove from '../assets/images/iconLove.png'
import Angin from '../assets/images/Angin.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Icon
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const CekTanah = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [TimeClock, setTimeClock] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('ID DEVICE');
    const [StatusDevice, setStatusDevice] = useState('Tidak Terhubung');
    const [Nitrogen, setNitrogen] = useState('');
    const [Phospor, setPhospor] = useState('');
    const [Kalium, setKalium] = useState('');
    const [Suhu, setSuhu] = useState('');
    const [Kelembaban, setKelembaban] = useState('');
    const [PH, setPH] = useState('');
    const [Mikroorganisme, setMikroorganisme] = useState('');
    const [ColorConnected, setColorConnected] = useState('red');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [Latitude, setLatitude] = useState(null);
    const [Longitude, setLongitude] = useState(null);
    const [LoveColor, setLoveColor] = useState('grey');
    const [ArrayFavourite, setArrayFavourite] = useState([]);
    const [modalVisibleFavourite, setmodalVisibleFavourite] = useState(false);
    const [NamaKomoditas, setNamaKomoditas] = useState('');
    const [KeteranganLainnya, setKeteranganLainnya] = useState('');

    const CekLocation = () => {
        (async () => {
            if (Platform.OS === 'android' && !Constants.isDevice) {
              setErrorMsg(
                'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
              );
              return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          })();
    }

    const CekAsynFavourite =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@TanahFavourite')
        const ParsingDataTanah = JSON.parse(jsonValue);
        // console.log(jsonValue)
        // console.log(ParsingDataTanah)
        if(ParsingDataTanah == null){
            setArrayFavourite([]);
        }else{
            setArrayFavourite(ParsingDataTanah);
        }
        } catch(e) {
        // error reading value
        }
    }

    const ReadyPushFavourite = [{
        id_user : IDUser,
        id_device : IDDevice,
        komoditas : NamaKomoditas,
        keterangan : KeteranganLainnya,
        nitrogen : Nitrogen,
        phospor : Phospor,
        kalium : Kalium,
        suhu : Suhu,
        kelembaban : Kelembaban,
        ph : PH,
        mikroorganisme : Mikroorganisme,
        get_time : currentDate,
    }];

    const PrepareSaveFavourite = () => {
        setmodalVisibleFavourite(true);
    }

    const CekDataFavourite = () => {
        SaveFavourite();
        console.log(ArrayFavourite);
        SimpanDataTanah(ArrayFavourite);
        setmodalVisibleFavourite(false);
        Alert.alert('Berhasil', 'Data pengukuran kualitas tanah berhasil disimpan, Anda dapat menguploadnya ketika sudah online')
    }

    const SimpanDataTanah = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@TanahFavourite', jsonValue)
            console.log('Simpan Data Tanah Berhasil')
        } catch (e) {
            // saving error
        }
    }

    const SaveFavourite = () => {
        ArrayFavourite.push(ReadyPushFavourite);
        setLoveColor('red');
    }


    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        setIDUser(ParsingDataUser[0].id_user); 
        } catch(e) {
        // error reading value
        }
    }

    const AmbilDataRoute = () => {
        if(route.params != undefined){
            let id_device = route.params.IDDevice;
            setIDDevice(id_device);
            AmbilDataDevice(id_device);
        }
    }

    const AmbilDataDevice = (id_device) => {
        // Mencari Lokasi
        CekLocation();
        let text = 'Waiting..';
        if (errorMsg) {
            text = errorMsg;
        } else if (location) {
            text = JSON.stringify(location);
            const ParseDataLocation = JSON.parse(text);
            setLatitude(ParseDataLocation.coords.latitude);
            setLongitude(ParseDataLocation.coords.longitude);
            // console.log(ParseDataLocation.coords.latitude)
            // console.log(ParseDataLocation.coords.longitude)
        }

        setLoveColor('grey')
        
        // console.log('Ambil Data Dari Device')
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        // fetch("https://alicestech.com/kelasbertani/api/cek_tanah/tes_alat?id_device="+id_device, requestOptions)
        fetch("https://alicestech.com/kelasbertani/api/cek_tanah/tes_alat?id_device=SENSOR001", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
            if(result.status == true){
                setStatusDevice('Terhubung');
                setColorConnected('#0D986A');
                setNitrogen(result.result[0].nitrogen);
                setPhospor(result.result[0].phospor);
                setKalium(result.result[0].kalium);
                setSuhu(result.result[0].suhu);
                setKelembaban(result.result[0].kelembaban);
                setPH(result.result[0].ph);
                setMikroorganisme(result.result[0].mikroorganisme);
                CekTime();
                console.log('success');
            }
            if(result.status == false){
                setStatusDevice('Tidak Terhubung');
                setColorConnected('red');
                console.log('failed');
                // Alert.alert('Tidak Terhubung', 'Silahkan Scan Kembali Perangkat Anda')
            }
        })
        .catch(error => console.log('error', error));
    }

    const CekTime = () => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
          year + '-' + month + '-' + date 
          + ' ' + hours + ':' + min + ':' + sec
        );
        setTimeClock(hours + ':' + min + ':' + sec);
    }

    const MovePage = (ScreenName) => {
        if(StatusDevice == 'Terhubung'){
            Alert.alert(
                "Apakah Anda Ingin Memutus Perangkat?",
                "Tekan lanjutkan jika Anda ingin meninggalkan halaman ini",
                [
                  {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Lanjutkan", onPress: () => {
                        setIDDevice('ID DEVICE');
                        setStatusDevice('Tidak Terhubung');
                        setColorConnected('red');
                        if(ScreenName == 'DaftarController'){
                            setTimeout(() => {
                                navigation.navigate(ScreenName, {IDUser:IDUser});
                            }, 1000);
                        }else{
                            setTimeout(() => {
                                navigation.navigate(ScreenName);
                            }, 1000);
                        }
                  }}
                ]
            );
        }else{
            if(ScreenName == 'DaftarController'){
                navigation.navigate(ScreenName, {IDUser:IDUser});
            }else{
                navigation.navigate(ScreenName);
            }
        }
    }


    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        AmbilDataRoute();
        CekTime();
        CekLocation();
        CekAsynFavourite();
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'#0D986A'}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleFavourite}
            onRequestClose={() => {
            setmodalVisibleFavourite(!modalVisibleFavourite);
            }}>
            <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(243, 243, 243, 0.8)'}}>
                <View style={{backgroundColor:'white', borderRadius:10, width:'90%', alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:20, marginBottom:15}}>Buat Keterangan</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setmodalVisibleFavourite(false)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={{paddingHorizontal:20, width:'100%', marginBottom:20}}>
                        <View style={styles.BoxInput}>
                            <TextInput 
                            placeholder='Nama Komoditas'
                            style={styles.TextInput}
                            onChangeText={NamaKomoditas => setNamaKomoditas(NamaKomoditas)}
                            defaultValue={NamaKomoditas}
                            />
                        </View>
                        <View style={styles.BoxInput}>
                            <TextInput 
                            placeholder='Keterangan Lainnya ...'
                            multiline={true}
                            numberOfLines={4}
                            style={styles.TextInput}
                            onChangeText={KeteranganLainnya => setKeteranganLainnya(KeteranganLainnya)}
                            defaultValue={KeteranganLainnya}
                            />
                        </View>
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#0D986A', borderRadius:20}} onPress={()=>CekDataFavourite()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Simpan Hasil Pengukuran</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
        <ScrollView style={styles.ScrollViewSet}>
            {/* Top Bar */}
            <TopBar />
            <View style={styles.JajarGenjang}></View>
            <Image source={Angin} style={{position:'absolute', width:windowWidth, resizeMode:'contain', top:0, left:0}} />
            <View style={{paddingHorizontal:20, position:'relative', height:300}}>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Nama Perangkat</Text>
                <Text style={{fontFamily:'Philosopher-Bold', fontSize:24, marginTop:5}}>{IDDevice}</Text>
                <TouchableOpacity style={{backgroundColor:'white', paddingVertical:5, paddingHorizontal:10, borderRadius:10, position:'absolute', top:10, right:20 }} onPress={()=> navigation.navigate('QRScanCekTanah')}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#0D986A', fontSize:12}}>Hubungkan</Text>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:40}}>STATUS</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>{StatusDevice}</Text>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:10}}>LAST UPDATE</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>{TimeClock} WIB</Text>
                <Image source={plantGrow} style={{width:200, height:200, position:'absolute', bottom:40, right:20}} />

                <View style={styles.ActionButtonGL}>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:ColorConnected, justifyContent:'center', alignItems:'center', borderRadius:20}} onPress={()=>AmbilDataDevice(IDDevice)}>
                        <Image source={IconSmile} style={{width:28, height:16, resizeMode:'contain'}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:20, marginLeft:10}} onPress={()=>PrepareSaveFavourite()}>
                        <AntDesign name="heart" size={24} color={LoveColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal:20, marginTop:20}}>
                <Text style={styles.DataSensorText}>Data Sensor</Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Nitrogen} ml</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Nitrogen</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Phospor}%</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Phosphorus</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Kalium} mg</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kalium</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Suhu} &deg;C</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Suhu</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Kelembaban}%</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kelembaban</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{PH}</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>PH</Text>
                    </View>
                </View>

                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Konduktifitas Mikro Organisme</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Kandungan Mikro Organisme)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:24, color:'#0D986A'}}>{Mikroorganisme}%</Text>
                    </View>
                </View>
                
                <View style={{marginTop:10, flexDirection:'row', marginBottom:20}}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Waktu Pengambilan Data</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{currentDate}</Text>
                    </View>
                </View>
        </View>
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('DaftarController')}>
            <SimpleLineIcons name="game-controller" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('Profile')}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default CekTanah

const styles = StyleSheet.create({
    JajarGenjang:{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 300,
        borderRightWidth: 0,
        borderBottomWidth: 80,
        borderLeftWidth: windowWidth,
        borderTopColor: '#9CE5CB',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#9CE5CB',
        borderBottomRightRadius:50,
        borderBottomLeftRadius:50,
        position:'absolute', 
        zIndex:-1
    },
    ActionButtonGL:{
        flexDirection:'row',
        ...Platform.select({
        ios:{
            marginTop:70
        },
        android:{
            marginTop:20
        }
        }),
    },
    DataSensorText:{
    ...Platform.select({
            ios:{
                fontFamily:'Poppins-Bold', 
                fontSize:16
            },
            android:{
            fontFamily:'Poppins-Bold', 
            fontSize:14
            }
        })
    },
    NilaiSensor:{
        fontFamily:'Poppins-Bold', 
        color:'#0D986A', 
        ...Platform.select({
            ios:{
                fontSize:20, 
            },
            android:{
                fontSize:14, 
            }
        }),
        margin:0, 
        padding:0
    },
    ButtonSimpanPengukuran:{
        paddingVertical:10, 
        paddingHorizontal:10, 
        borderRadius:10, 
        ...Platform.select({
            ios:{
                marginTop:20
            },
            android:{
                marginTop:10
            }
        }),
        backgroundColor:'#0D986A', 
        alignItems:'center',
        marginBottom:10
    },
    BoxHasilBawah:{
        ...Platform.select({
            ios:{
                marginTop:30
            },
            android:{
                marginTop:20
            }
        }),
        flexDirection:'row'
    },
    ScrollViewSet:{
        ...Platform.select({
            ios:{
                marginBottom:20, 
            },
            android:{
                marginBottom:50, 
            }
        }),
        width:windowWidth, 
        backgroundColor:'white'
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
})