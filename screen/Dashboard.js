import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, Alert, StatusBar} from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Farmer from '../assets/images/farmer.png'
import iconsetcanal from '../assets/images/iconsetcanal.png'
import tanaman from '../assets/images/tanaman.png'
import iconHome from '../assets/images/iconHome.png'
import iconLove from '../assets/images/iconLove.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import Simco from '../assets/images/simco.png'
import Sawentar from '../assets/images/sawentar.png'
import Penyuluhan from '../assets/images/penyuluhan.png'
import LocationIcon from '../assets/images/location.png'
import TesTanahIcon from '../assets/images/growing-plant.png'
import PenyiramanIcon from '../assets/images/penyiraman.png'
import NitrogenIcon from '../assets/images/nitrogenicon.png'
import HamaPenyakitIcon from '../assets/images/caterpillar.png'
import UsahaTaniIcon from '../assets/images/usahatani.png'
import CuacaIcon from '../assets/images/cloudy.png'
import PermodalanIcon from '../assets/images/permodalan.png'
import MarketplaceIcon from '../assets/images/marketplace.png'
import DiskusiIcon from '../assets/images/chatbubble.png'
import TanyaPakaricon from '../assets/images/tanyapakar.png'
import TopBar from './TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

//statusbar
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

// Icon
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons'; 

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const Dashboard = ({navigation}) => {

  const [IDUser, setIDUser] = useState(0);
  const [IDController, setIDController] = useState(0);
  const [NamaPerangkat, setNamaPerangkat] = useState('Perangkat');
  const [JenisTanaman, setJenisTanaman] = useState('');
  const [HumMin, setHumMin] = useState(0);
  const [HumMax, setHumMax] = useState(0);
  const [Lokasi, setLokasi] = useState('Alamat Perangkat');
  //statusbar
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(TRANSITIONS[0]);

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log('Cek Data user di Dashboard');
    LihatDataUser()
  }, [isFocused])

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    console.log(jsonValue)
    console.log(ParsingDataUser[0].id_user)
    if(ParsingDataUser[0].id_user){
        GetController(ParsingDataUser[0].id_user);
    }
    } catch(e) {
    // error reading value
    }
}

  const GetController = async (id_user) => {
    try {
        let response = await fetch(
        'https://alicestech.com/kelasbertani/api/controller/last?id_user=' + id_user
        );
        let json = await response.json();
        if(json.status == true){
          console.log(json.result[0]);
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
    if(IDController != 0){
      navigation.navigate('DaftarController', {IDUser:IDUser, IDController:IDController})
    }else{
      Alert.alert('Controller Tidak Tersedia', 'Tambahkan Controller Terlebih Dahulu');
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
      <StatusBar
        animated={true}
        backgroundColor="green"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} />
      <ScrollView style={styles.ScrollViewBox}>  
          {/* Top Bar */}
          {/* <TopBar /> */}

          {/* Greating Text Box Hijau */}
          <View style={{width:'100%', paddingHorizontal:10, marginTop:10}}>
            <View style={styles.BoxGreating}>
              <Image source={Farmer} style={styles.FarmerImg} />
              <View style={{width:175, marginLeft:15, marginTop:45}}>
                <Text style={styles.TextGreating}>Teknologi AI dan IoT Pertanian</Text>
              </View>
              <View style={{width:160, marginLeft:15, marginTop:20}}>
                <Text style={styles.TextGreatingExpln}>Monitoring & Control 100% Online 24/7</Text>
              </View>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.MenuListBox}>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=>navigation.navigate('WebviewSimco')} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#fec043', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={Penyuluhan} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Petani Kita</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={()=> navigation.navigate('WebviewSawentar')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={LocationIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Pemetaan Wilayah</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('CekTanah')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={TesTanahIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Tes Tanah</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> DaftarControllerCek()} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={PenyiramanIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Penyiraman Otomatis</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity onPress={()=> navigation.navigate('CaptureDaun')} style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={NitrogenIcon} style={{width:60, height:60}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Cek Kadar Nitrogen</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity onPress={()=> navigation.navigate('PenyakitTanaman')} style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={HamaPenyakitIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Deteksi Hama & Penyakit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={CuacaIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Cuaca</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={UsahaTaniIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Pencatatan Usaha Tani</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuBox}>
              {/* Icon Menu */}
              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start', flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#d34539', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={PermodalanIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Permodalan</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#2883e1', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={MarketplaceIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Pemasaran</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#fec043', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={DiskusiIcon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Grup Diskusi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems:'center', justifyContent:'flex-start' , flex:1}}>
                <View style={{width:70, height:70, backgroundColor:'#06934f', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                  <Image source={TanyaPakaricon} style={{width:50, height:50}} />
                </View>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', marginTop:5, textAlign:'center'}}>Tanya Pakar</Text>
              </TouchableOpacity>
            </View>

          </View>
          
          {/* Daftar Controller */}
          <View style={{flexDirection:'row', width:'100%', paddingHorizontal:20, marginTop:20}}>
            <TouchableOpacity style={styles.BoxDaftarController} onPress={()=>DaftarControllerCek()}>
              <Text style={styles.TextScan}>Daftar Controller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BoxSetKanal} onPress={()=>navigation.navigate('TambahController')}>
              <AntDesign name="pluscircleo" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={{width:'100%', marginTop:20, alignItems:'flex-start', paddingHorizontal:23}}>
            <TouchableOpacity onPress={()=> DaftarControllerCek()}>
              <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'#0D986A'}}>Automatic & Control Pengairan</Text>
              <View style={{borderBottomWidth:2, borderBottomColor:'#0D986A', width:40, marginTop:5}}></View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={{width:'100%', paddingHorizontal:20, marginTop:10, alignItems:'center', justifyContent:'center', position:'relative'}} onPress={()=>DetailControllerCek()}>
              <View style={styles.JajarGenjang}>
              </View>
              <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', position:'absolute', left:50, top:25}}>Detail Data</Text>
              <Text style={{fontFamily:'Philosopher-Bold', fontSize:18, color:'black', position:'absolute', left:50, top:50}}>{NamaPerangkat}</Text>
              <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black', position:'absolute', left:50, top:85}}>Tanaman {JenisTanaman}</Text>
              <View style={{position:'absolute', right:0, bottom:50}}>
                <Image source={tanaman} style={{width:190, height:190,resizeMode:'contain'}} />
              </View>
              <View style={{position:'absolute', left:50, bottom:50, flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', fontSize:12}}>Hum Min : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>{HumMin}%</Text>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', paddingLeft:10, fontSize:12}}>Hum Max : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>{HumMax}%</Text>
              </View>
              <View style={{position:'absolute', left:50, bottom:20, width:260}}>
                <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black'}}>Lokasi : {Lokasi}</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width:'100%', marginTop:20, paddingHorizontal:20, position:'relative', marginBottom:10}}>
            <View style={{height:160, backgroundColor:'#8CEC8A', opacity:0.3, borderRadius:20}}>
            </View>
            <View style={{width:240, position:'absolute', left:40, top:20}}>
              <Text style={{fontFamily:'Philosopher-Bold', fontSize:18, color:'black', position:'absolute'}}>Cari Produk Hasil Pertanian Nusantara</Text>
            </View>
            <View style={{width:160, position:'absolute', left:40, top:80}}>
              <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'#0D986A', position:'absolute'}}>Penuhi kebutuhan usaha anda dengan produk unggulan pertanian Indonesia</Text>
            </View>
            <View style={{width:50,height:50, borderRadius:25, position:'absolute', backgroundColor:'#0D986A', right:40, top:20}}></View>
            <View style={{width:15,height:15, borderRadius:15/2, position:'absolute', backgroundColor:'#0D986A', left:30, top:5}}></View>
            <View style={{width:10,height:10, borderRadius:10/2, position:'absolute', backgroundColor:'#0D986A', left:23, top:30}}></View>
            <View style={{width:30,height:30, borderRadius:30/2, position:'absolute', backgroundColor:'#0D986A', right:23, top:70}}></View>
            <View style={{width:20,height:20, borderRadius:20/2, position:'absolute', backgroundColor:'#0D986A', left:170, bottom:10}}></View>
            <TouchableOpacity style={{backgroundColor:'#0D986A', borderRadius:10, paddingHorizontal:20, paddingVertical:5, position:'absolute', bottom:30, right:60}} onPress={()=>navigation.navigate('CekTanah')}>
              <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Cek Sekarang</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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

export default Dashboard

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
    height:200,
    borderRadius:10,
  },
  FarmerImg:{
    width:175, 
    height:175,
    resizeMode:'contain',
    position:'absolute',
    right:0,
    bottom:0
  },
  TextGreating:{
    fontFamily:'Philosopher-Bold',
    fontSize:20,
    color:'black'
  },
  TextGreatingExpln:{
    fontFamily:'Poppins-Regular',
    fontSize:12,
    color:'black'
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
  }
})