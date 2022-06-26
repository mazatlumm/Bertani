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

const DetailDataTanahOnline = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [TimeClock, setTimeClock] = useState('');
    const [IDCekTanah, setIDCekTanah] = useState('');
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
    const [Salinitas, setSalinitas] = useState('');
    const [TDS, setTDS] = useState('');
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

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            setIDCekTanah(route.params.id_cek_tanah);
            setIDDevice(route.params.id_device);
            setIDUser(route.params.id_user);
            setNamaKomoditas(route.params.komoditas);
            setKeteranganLainnya(route.params.keterangan);
            setNitrogen(route.params.nitrogen);
            setPhospor(route.params.phospor);
            setKalium(route.params.kalium);
            setSuhu(route.params.suhu);
            setKelembaban(route.params.kelembaban);
            setPH(route.params.ph);
            setMikroorganisme(route.params.mikroorganisme);
            setSalinitas(route.params.salinitas);
            setTDS(route.params.tds);
            setCurrentDate(route.params.get_time);
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        AmbilDataRoute();
      }, [isFocused]);

    const HapusData = (id_cek_tanah) => {
        Alert.alert('Apakah Anda Yakin?', 'Data ini akan dihapus secara permanen!', [
            {
              text: "Batalkan",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Lanjutkan", onPress: () => HapusDataTanah(id_cek_tanah)}
          ]);
    }

    const SimpanPerubahan = () => {
        var dataToSend = { id_cek_tanah: IDCekTanah, komoditas: NamaKomoditas, keterangan : KeteranganLainnya};
        var formBody = [];
        for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        //POST request
        fetch('https://alicestech.com/kelasbertani/api/cek_tanah/edit', {
        method: 'POST', 
        body: formBody, 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == true){
                Alert.alert('Berhasil', 'Perubahan data telah disimpan')
                setmodalVisibleFavourite(false)
            }else{
                Alert.alert('Gagal', 'Coba kembali beberapa saat')
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const HapusDataTanah = async (id_cek_tanah) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/cek_tanah/hapus?id_cek_tanah=' + id_cek_tanah);
            let json = await response.json();
            if(json.status == true){
              setTimeout(() => {
                navigation.navigate('FavouriteOnlineData');
              }, 1000);
            }
        } catch (error) {
            console.error(error);
        }
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
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:20, marginBottom:15}}>Ubah Keterangan</Text>
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
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#0D986A', borderRadius:20}} onPress={()=>SimpanPerubahan()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Simpan Perubahan</Text>
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
                
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:10}}>Nama Tanaman</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>{NamaKomoditas}</Text>
                
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:10}}>Pengambilan Data</Text>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, marginTop:0}}>{currentDate} WIB</Text>

                <Image source={plantGrow} style={{width:200, height:200, position:'absolute', bottom:40, right:20}} />

                <View style={styles.ActionButtonGL}>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:ColorConnected, justifyContent:'center', alignItems:'center', borderRadius:20}} onPress={()=>HapusData(IDCekTanah)}>
                        <EvilIcons name="trash" size={30} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:'green', justifyContent:'center', alignItems:'center', borderRadius:20, marginLeft:10}} onPress={()=>setmodalVisibleFavourite(true)}>
                        <AntDesign name="edit" size={24} color={'white'} />
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
                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Tingkat Salinitas Tanah</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Kadar Garam)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'#0D986A'}}>{Salinitas} %</Text>
                    </View>
                </View>
                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>TDS</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Total Dissolved Solid)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'#0D986A'}}>{TDS} %</Text>
                    </View>
                </View>
                
                <View style={{marginTop:10, flexDirection:'row', marginBottom:20}}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Keterangan Tambahan</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{KeteranganLainnya}</Text>
                    </View>
                </View>
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
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('DaftarController')}>
            <SimpleLineIcons name="game-controller" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default DetailDataTanahOnline

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
            marginTop:50
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