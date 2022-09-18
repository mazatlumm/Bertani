import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, Alert, StatusBar, ActivityIndicator, Modal} from 'react-native'
import React, {useEffect, useState} from 'react'
import * as Location from 'expo-location';
import axios from 'axios';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Farmer from '../assets/images/farmer.png'
import Penyuluhan from '../assets/images/penyuluhan.png'
import LocationIcon from '../assets/images/location.png'
import TesTanahIcon from '../assets/images/growing-plant.png'
import PenyiramanIcon from '../assets/images/penyiraman.png'
import NitrogenIcon from '../assets/images/nitrogenicon.png'
import HamaPenyakitIcon from '../assets/images/caterpillar.png'
import UsahaTaniIcon from '../assets/images/usahatani.png'
import CuacaIcon from '../assets/images/cloudy.png'
import PermodalanIcon from '../assets/images/permodalan.png'
import SimcoIcon from '../assets/images/simco.png'
import MarketplaceIcon from '../assets/images/marketplace.png'
import DiskusiIcon from '../assets/images/chatbubble.png'
import InfoTaniIcon from '../assets/images/envelope.png'
import GoPenyuluhIcon from '../assets/images/motocross.png'
import CekTernakIcon from '../assets/images/livestock.png'
import TanyaPakaricon from '../assets/images/tanyapakar.png'
import MarketImage from '../assets/images/market.jpg'
import KelolaProdukPic from '../assets/images/kelolaproduk.jpg'
import CariModalPic from '../assets/images/carimodal.jpg'
import KasihModalPic from '../assets/images/kasihmodal.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

//statusbar
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

// Icon
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const Dashboard = ({navigation}) => {

  const [IDUser, setIDUser] = useState(0);
  const [IDController, setIDController] = useState(0);
  const [NamaUser, setNamaUser] = useState('Perangkat');
  const [Role, setRole] = useState('');
  const [NamaPerangkat, setNamaPerangkat] = useState('Perangkat');
  const [JenisTanaman, setJenisTanaman] = useState('');
  const [HumMin, setHumMin] = useState(0);
  const [HumMax, setHumMax] = useState(0);
  const [Lokasi, setLokasi] = useState('Alamat Perangkat');
  //statusbar
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(TRANSITIONS[0]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Suhu, setSuhu] = useState('');
  const [Kelembaban, setKelembaban] = useState('');
  const [TekananUdara, setTekananUdara] = useState('');
  const [IconCuaca, setIconCuaca] = useState('');
  const [Altitude, setAltitude] = useState('');
  const [DeskripsiCuaca, setDeskripsiCuaca] = useState('');
  const [AddressFull, setAddressFull] = useState('');
  const [modalActivityIndicator, setmodalActivityIndicator] = useState(true);
  const [ModalPemasaran, setModalPemasaran] = useState(false);
  const [ModalPermodalan, setModalPermodalan] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    setmodalActivityIndicator(true)
    console.log('Cek Data user di Dashboard');
    LihatDataUser()
    CekLokasi()
    CekToken()
  }, [isFocused, IDUser, Role])

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    console.log(jsonValue)
    setIDUser(ParsingDataUser[0].id_user)
    if(ParsingDataUser[0].id_user){
        setNamaUser(ParsingDataUser[0].nama);
        setRole(ParsingDataUser[0].role);
        GetController(ParsingDataUser[0].id_user);
        CekToken(ParsingDataUser[0].id_user)
    }
    } catch(e) {
      // console.log(e)
    }
  }

  const CekToken =  async(id_user) => {
    try {
    const tokenSave = await AsyncStorage.getItem('@token')
    console.log('Token Tersimpan : ' + tokenSave);
    SimpanTokenKeServer(id_user, tokenSave);
    } catch(e) {
      // console.log(e)
    }
  }

  const SimpanTokenKeServer = async (IdUser, Token) => {
    if(IdUser != '' || IdUser != null){
      const ParameterUrl = { 
        id_user:IdUser,
        token:Token,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/token/change', ParameterUrl)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
      });
    }
  }

  const KirimLokasi = async (lat, long) => {
    if(IDUser && Role){
      const ParameterUrl = { 
        id_user:IDUser,
        role:Role,
        latitude:lat,
        longitude:long,
      }
  
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/user/location', ParameterUrl)
      .then(response => {
        console.log(response.data)
        if(response.data.status == true){
          setmodalActivityIndicator(false);
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          
        }
      });
    }else{
      console.log('IDUser dan Role Belum Terisi');
    }
  }

  const CekLokasi = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // console.log(location.coords);
      setAltitude(location.coords.altitude);

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      KirimLokasi(latitude, longitude);
      
      let GeoCodingData = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      // console.log(GeoCodingData);
      setAddressFull(GeoCodingData[0].district + ', ' + GeoCodingData[0].city)

      await axios.get('https://alicestech.com/kelasbertani/api/cuaca/dashboard', {
        params: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        }
      })
      .then(response => {
        // console.log(response.data)
        setIconCuaca('http://openweathermap.org/img/wn/'+response.data.current.weather[0].icon +'.png')
        let SuhuCek = response.data.current.temp
        setSuhu(Math.ceil(SuhuCek))
        setKelembaban(response.data.current.humidity)
        setTekananUdara(response.data.current.pressure)
        setDeskripsiCuaca(response.data.current.weather[0].description.replace(/\b(\w)/g, s => s.toUpperCase()));
        setmodalActivityIndicator(false);
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
          setmodalActivityIndicator(false);
        }
      });
  }

  const GetController = async (id_user) => {
    try {
        let response = await fetch(
        'https://alicestech.com/kelasbertani/api/controller/last?id_user=' + id_user
        );
        let json = await response.json();
        if(json.status == true){
          // console.log(json.result[0]);
          setIDUser(id_user);
          setIDController(json.result[0].id_controller);
          setNamaPerangkat(json.result[0].nama_perangkat);
          setJenisTanaman(json.result[0].tanaman);
          setHumMin(json.result[0].hum_min);
          setHumMax(json.result[0].hum_max);
          setLokasi(json.result[0].lokasi);
        }
    } catch (error) {
        console.error(error);
    }
  }

  const DetailControllerCek = () => {
    if(IDController != 0){
      navigation.navigate('DetailController', {IDUser:IDUser, IDController:IDController})
    }else{
      Alert.alert('Controller Tidak Tersedia', 'Tambahkan Controller Terlebih Dahulu');
    }
  }
  
  const DaftarControllerCek = () => {
      navigation.navigate('DaftarController', {IDUser:IDUser, IDController:IDController})
  }

  const TanyaPakarGo = () => {
    if(Role == 'admin' || Role == 'pakar'){
      navigation.navigate('ListChatPakar');
    }else{
      console.log('ID User yang dikirim : ' + IDUser);
      navigation.navigate('RoomDiskusiPakar', {id_user:IDUser});
    }
  }

  const KelolaProduk = () => {
    navigation.navigate('KelolaProduk')
    setModalPemasaran(!ModalPemasaran);
  }

  const PasarBertani = () => {
    navigation.navigate('PasarBertani')
    setModalPemasaran(!ModalPemasaran);
  }
  
  const KasihModal = () => {
    navigation.navigate('KasihModal')
    setModalPermodalan(!ModalPermodalan);
  }
  
  const CariModal = () => {
    navigation.navigate('CariModal')
    setModalPermodalan(!ModalPermodalan);
  }
  
  const GoPenyuluh = () => {
    if(Role != 'Penyuluh'){
      navigation.navigate('GoPenyuluh', {IDUser:IDUser});
    }else{
      console.log('Halaman Penyuluh')
      navigation.navigate('MapPenyuluh');
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center'}}>
       <Modal
          animationType="fade"
          transparent={true}
          visible={modalActivityIndicator}
          onRequestClose={() => {
            setmodalActivityIndicator(!modalActivityIndicator);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
              <ActivityIndicator size="large" color="#00ff00" />
        </View>
        </Modal>
        {/* Modal Pemasaran */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalPemasaran}
          onRequestClose={() => {
            setModalPemasaran(!ModalPemasaran);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
            <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, flexDirection:'row', width:windowWidth, alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity onPress={()=> setModalPemasaran(!ModalPemasaran)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                <SimpleLineIcons name="close" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems:'center'}} onPress={()=>KelolaProduk()}>
                <Image source={KelolaProdukPic} style={{width:100, height:100}} resizeMode="contain"/>
                <View style={{borderWidth:1, alignItems:'center', borderRadius:10, paddingVertical:5, paddingHorizontal:5, width:'100%'}}>
                  <Text style={styles.TextDeskrispiCuaca}>Kelola Produk Anda</Text>
                </View>
              </TouchableOpacity>
              <View style={{borderLeftWidth:0.5, marginHorizontal:10, borderLeftColor:'grey', height:'100%'}}></View>
              <TouchableOpacity style={{alignItems:'center'}} onPress={()=>PasarBertani()}>
                <Image source={MarketImage} style={{width:100, height:100}} resizeMode="contain"/>
                <View style={{borderWidth:1, alignItems:'center', borderRadius:10, paddingVertical:5, paddingHorizontal:5, width:'100%'}}>
                  <Text style={styles.TextDeskrispiCuaca}>Masuk Pasar Bertani</Text>
                </View>
              </TouchableOpacity>
              </View>
        </View>
        </Modal>
          {/* Modal Permodalan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalPermodalan}
          onRequestClose={() => {
            setModalPermodalan(!ModalPermodalan);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
            <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, flexDirection:'row', width:windowWidth, alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity onPress={()=> setModalPermodalan(!ModalPermodalan)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                <SimpleLineIcons name="close" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems:'center'}} onPress={()=>KasihModal()}>
                <Image source={KasihModalPic} style={{width:100, height:100}} resizeMode="contain"/>
                <View style={{borderWidth:1, alignItems:'center', borderRadius:10, paddingVertical:5, paddingHorizontal:5, width:'100%'}}>
                  <Text style={styles.TextDeskrispiCuaca}>Kasih Modal</Text>
                </View>
              </TouchableOpacity>
              <View style={{borderLeftWidth:0.5, marginHorizontal:10, borderLeftColor:'grey', height:'100%'}}></View>
              <TouchableOpacity style={{alignItems:'center'}} onPress={()=>CariModal()}>
                <Image source={CariModalPic} style={{width:100, height:100}} resizeMode="contain"/>
                <View style={{borderWidth:1, alignItems:'center', borderRadius:10, paddingVertical:5, paddingHorizontal:5, width:'100%'}}>
                  <Text style={styles.TextDeskrispiCuaca}>Cari Modal</Text>
                </View>
              </TouchableOpacity>
              </View>
        </View>
        </Modal>

      <StatusBar
        animated={true}
        backgroundColor="green"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} />

      <TouchableOpacity onPress={()=>navigation.navigate('Profile')} style={{width:'100%', paddingHorizontal:13, backgroundColor:'white', paddingTop:10, flexDirection:'row', alignItems:'center'}}>
        <View style={{width:20, height:20, borderWidth:1, borderRadius:10, alignItems:'center', justifyContent:'center'}}>
          <FontAwesome name="user" size={16} color="black" />
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontFamily:'Poppins-Bold', fontSize:14, color:'black', marginLeft:5}}>  Hai, </Text>
          <Text style={{fontFamily:'Poppins-Bold', fontSize:14, color:'black', textDecorationLine:'underline'}}>{NamaUser}</Text>
        </View>
      </TouchableOpacity>
      <ScrollView style={styles.ScrollViewBox}>  
          {/* Greating Text Box Hijau */}
          <View style={{width:'100%', paddingHorizontal:10, marginTop:10}}>
            <View style={styles.BoxGreating}>
              <View style={{flex:2}}>
                <View style={{marginLeft:15,}}>
                  <Text style={styles.TextGreating}>Aplikasi Bertani</Text>
                  <Text style={styles.TextDeskrispiCuaca}>Adalah aplikasi yang berbasis teknologi AI dan IoT yang menyediakan data dan informasi pertanian</Text>
                  <View style={{borderTopWidth:0.5, marginBottom:8, marginTop:5}}></View>
                </View>
                <View style={{marginLeft:15, marginTop:0, alignItems:'center', flexDirection:'row'}}>
                    <SimpleLineIcons name="location-pin" size={12} color="black" style={{paddingRight:5}}/>
                    <Text style={styles.TextDeskrispiCuaca}>{AddressFull}</Text>
                </View>
                <View style={{marginLeft:15, marginTop:0, alignItems:'center', flexDirection:'row'}}>
                  {IconCuaca != '' ?
                  <View style={{flex:1}}>
                    <Image source={{uri:IconCuaca}} style={{width:50, height:30,borderWidth:1}}/>
                    <Text style={styles.TextDeskrispiCuaca}>{DeskripsiCuaca}</Text>
                  </View>
                  : <View></View>
                  }
                  <View style={{alignItems:'flex-start', flex:1, paddingLeft:10}}>
                    <Text style={styles.TextSuhu}>{Suhu}&deg;C</Text>
                  </View>
                </View>
                <View style={{marginLeft:15, marginTop:0, alignItems:'center', flexDirection:'row'}}>
                  <View style={{flex:1}}>
                    <Text style={styles.TextValueCuaca}>{Kelembaban}%</Text>
                    <Text style={styles.TextDeskrispiCuaca}>Kelembaban</Text>
                  </View>
                  <View style={{falignItems:'flex-start', flex:1, paddingLeft:10}}>
                    <Text style={styles.TextValueCuaca}>{TekananUdara} hPa</Text>
                    <Text style={styles.TextDeskrispiCuaca}>Tekanan Udara</Text>
                  </View>
                </View>
              </View>
              <View style={{flex:1, paddingLeft:10,justifyContent:'center', alignItems:'center'}}>
                <Image source={Farmer} style={styles.FarmerImg} />
              </View>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.MenuListBox}>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=>navigation.navigate('WebviewPetani')} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#fec043', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={Penyuluhan} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Data Petani</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={()=> navigation.navigate('WebviewSawentar')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={LocationIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Pemetaan Wilayah</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('CekTanah')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={TesTanahIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Tes Tanah</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> DaftarControllerCek()} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={PenyiramanIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Penyiraman Otomatis</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=> navigation.navigate('CaptureDaun')} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={NitrogenIcon} style={{width:60, height:60}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Cek Kadar Nitrogen</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity onPress={()=> navigation.navigate('PenyakitTanaman')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={HamaPenyakitIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Deteksi Hama & Penyakit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('Cuaca')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={CuacaIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Cuaca</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('CatatanUsahaTani')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={UsahaTaniIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Pencatatan Usaha Tani</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=>setModalPermodalan(!ModalPermodalan)} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={PermodalanIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Permodalan</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity onPress={()=> setModalPemasaran(!ModalPemasaran)} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={MarketplaceIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Pemasaran</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('ListTopikDiskusi', {IDUser:IDUser})} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#fec043', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={DiskusiIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Grup Diskusi</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> TanyaPakarGo()} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={TanyaPakaricon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Tanya Pakar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=>navigation.navigate('WebviewSimco')} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={SimcoIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Data Penyuluh</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity onPress={()=> navigation.navigate('WebviewInfoTani')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#fec043', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={InfoTaniIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Info Tani</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>GoPenyuluh()} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={GoPenyuluhIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Go Penyuluh</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('CekTernak')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={CekTernakIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:10, color:'black', marginTop:5, textAlign:'center'}}>Cek Ternak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
  </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  ScrollViewBox:{
    ...Platform.select({
        ios:{
            marginBottom:0
        },
        android:{
            marginBottom:0
        }
    }),
    width:'100%', 
    backgroundColor:'white',
    height:windowHeight,
},
  TopBarBox:{
    // marginTop:20, 
    width:'100%', 
    alignItems:'flex-start', 
    flexDirection:'row',
    alignItems:'center',
    marginLeft:30
  },
  BoxGreating:{
    backgroundColor:'#9CE5CB',
    width:'100%',
    // height:200,
    borderRadius:10,
    paddingBottom:10,
    paddingTop:10,
    flexDirection:'row'
  },
  FarmerImg:{
    width:150, 
    height:150,
    resizeMode:'contain',
  },
  TextGreating:{
    fontFamily:'Poppins-Bold',
    fontSize:16,
    color:'black'
  },
  TextGreatingExpln:{
    fontFamily:'Poppins-Regular',
    fontSize:12,
    color:'black',
  },
  TextDeskrispiCuaca:{
    fontFamily:'Poppins-Regular',
    fontSize:10,
    color:'black',
  },
  TextDeskrispiLoading:{
    fontFamily:'Poppins-Regular',
    fontSize:10,
    color:'black',
    textAlign:'center'
  },
  TextValueCuaca:{
    fontFamily:'Poppins-Bold',
    fontSize:12,
    color:'black',
  },
  TextSuhu:{
    fontFamily:'Poppins-Regular',
    fontSize:24,
    color:'black',
  },
  TextNamaUser:{
    fontFamily:'Poppins-Regular',
    fontSize:12,
    color:'black',
    fontWeight:'bold',
  },
  BoxDaftarController:{
    borderWidth:1,
    borderRadius:10,
    height:40,
    flex:5,
    alignItems:'center',
    justifyContent:'center'
  },
  BoxSetKanal:{
    borderWidth:1,
    borderRadius:10,
    height:40,
    marginLeft:10,
    width:40,
    alignItems:'center',
    justifyContent:'center'
  },
  TextScan:{
    fontFamily:'Poppins-Regular',
    fontSize:12,
    color:'black'
  },
  JajarGenjang:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 170,
    borderLeftWidth: windowWidth,
    borderTopColor: 'transparent',
    borderRightColor: '#9CE5CB',
    borderBottomColor: '#9CE5CB',
    borderLeftColor: '#9CE5CB',
    borderTopRightRadius:80,
    borderBottomRightRadius:50,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
  },
  JajarGenjangSimco:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 170,
    borderLeftWidth: windowWidth,
    borderTopColor: 'transparent',
    borderRightColor: '#B2E28D',
    borderBottomColor: '#B2E28D',
    borderLeftColor: '#B2E28D',
    borderTopRightRadius:80,
    borderBottomRightRadius:50,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
  },
  JajarGenjangSawentar:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 170,
    borderLeftWidth: windowWidth,
    borderTopColor: 'transparent',
    borderRightColor: '#9CE5CB',
    borderBottomColor: '#9CE5CB',
    borderLeftColor: '#9CE5CB',
    borderTopRightRadius:80,
    borderBottomRightRadius:50,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
  },
  JajarGenjangPenyuluhan:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 170,
    borderLeftWidth: windowWidth,
    borderTopColor: 'transparent',
    borderRightColor: '#8CEC8A',
    borderBottomColor: '#8CEC8A',
    borderLeftColor: '#8CEC8A',
    borderTopRightRadius:80,
    borderBottomRightRadius:50,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
  },
  MenuBox:{
    flexDirection:'row',
    marginHorizontal:5,
    marginBottom:5
  },
  MenuListBox:{
    paddingVertical:15,
    marginTop:10,
    marginBottom:10,
    marginHorizontal:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor:'white',
    borderRadius:10,
  },
  TextPoppinsKecil:{
    fontFamily:'Poppins-Regular',
    fontSize:10,
    color:'black',
    marginTop:3
},
})