import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView} from 'react-native'
import React from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Farmer from '../assets/images/farmer.png'
import iconsetcanal from '../assets/images/iconsetcanal.png'
import tanaman from '../assets/images/tanaman.png'
import iconHome from '../assets/images/iconHome.png'
import iconLove from '../assets/images/iconLove.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import TopBar from './TopBar';

// Icon
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const Dashboard = ({navigation}) => {

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
    <View style={{ flex: 1, alignItems: 'center', height:windowHeight}}>
      <ScrollView style={{marginBottom:50, width:'100%'}}>
          
          {/* Top Bar */}
          <TopBar />

          {/* Greating Text Box Hijau */}
          <View style={{width:'100%', paddingHorizontal:20}}>
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
          
          {/* Scan Tanaman */}
          <View style={{flexDirection:'row', width:'100%', paddingHorizontal:20, marginTop:20}}>
            <TouchableOpacity style={styles.BoxScanTanaman}>
              <Text style={styles.TextScan}>Scan Tanaman</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BoxSetKanal} onPress={()=>navigation.navigate('TambahController')}>
              <AntDesign name="pluscircleo" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={{width:'100%', marginTop:20, alignItems:'flex-start', paddingHorizontal:23}}>
            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'#0D986A'}}>Automatic & Control Pengairan</Text>
            <View style={{borderBottomWidth:2, borderBottomColor:'#0D986A', width:40, marginTop:5}}></View>
          </View>

          <TouchableOpacity style={{width:'100%', paddingHorizontal:20, marginTop:10, alignItems:'center', justifyContent:'center', position:'relative'}} onPress={()=>navigation.navigate('DetailController')}>
              <View style={styles.JajarGenjang}>
              </View>
              <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', position:'absolute', left:50, top:25}}>6 Sensor Aktif</Text>
              <Text style={{fontFamily:'Philosopher-Bold', fontSize:24, color:'black', position:'absolute', left:50, top:50}}>Lahan 1</Text>
              <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black', position:'absolute', left:50, top:85}}>Komoditas Tembakau</Text>
              <View style={{position:'absolute', right:0, bottom:40}}>
                <Image source={tanaman} style={{width:200, height:200,resizeMode:'contain'}} />
              </View>
              <View style={{position:'absolute', left:50, bottom:50, flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', fontSize:12}}>TEMP : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>20°C</Text>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', paddingLeft:10, fontSize:12}}>HUM : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>50%</Text>
              </View>
              <View style={{position:'absolute', left:50, bottom:20, width:260}}>
                <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black'}}>Lokasi : Ds. Grogol, Kec, Diwek, Kab. Jombang</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width:'100%', marginTop:20, paddingHorizontal:20, position:'relative', marginBottom:10}} onPress={()=>navigation.navigate('CekTanah')}>
            <View style={{height:160, backgroundColor:'#8CEC8A', opacity:0.3, borderRadius:20}}>
            </View>
            <View style={{width:240, position:'absolute', left:40, top:20}}>
              <Text style={{fontFamily:'Philosopher-Bold', fontSize:18, color:'black', position:'absolute'}}>Cek Kesuburan Tanah Lahan Pertanian</Text>
            </View>
            <View style={{width:160, position:'absolute', left:40, top:80}}>
              <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'#0D986A', position:'absolute'}}>Hidupkan perangkat IoT dan tancapkan sensor ke tanah</Text>
            </View>
            <View style={{width:50,height:50, borderRadius:25, position:'absolute', backgroundColor:'#0D986A', right:40, top:20}}></View>
            <View style={{width:15,height:15, borderRadius:15/2, position:'absolute', backgroundColor:'#0D986A', left:30, top:5}}></View>
            <View style={{width:10,height:10, borderRadius:10/2, position:'absolute', backgroundColor:'#0D986A', left:23, top:30}}></View>
            <View style={{width:30,height:30, borderRadius:30/2, position:'absolute', backgroundColor:'#0D986A', right:23, top:70}}></View>
            <View style={{width:20,height:20, borderRadius:20/2, position:'absolute', backgroundColor:'#0D986A', left:170, bottom:10}}></View>
            <TouchableOpacity style={{backgroundColor:'#0D986A', borderRadius:10, paddingHorizontal:20, paddingVertical:5, position:'absolute', bottom:30, right:80}} onPress={()=>navigation.navigate('CekTanah')}>
              <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Mulai</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
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

export default Dashboard

const styles = StyleSheet.create({
  TopBarBox:{
    marginTop:20, 
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
  BoxScanTanaman:{
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
  }
})