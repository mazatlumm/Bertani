import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions} from 'react-native'
import React from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import IconBar from '../assets/images/TopBarIcon.png'
import MenuIcon from '../assets/images/menuicon.png'
import Farmer from '../assets/images/farmer.png'
import iconsetcanal from '../assets/images/iconsetcanal.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = Dimensions.get('window').height;

const Dashboard = ({navigation}) => {

  console.log(windowWidth);
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
      {/* Top Bar */}
        <View style={styles.TopBarBox}>
          <View style={{flex:0.5,}}>
            <Image source={IconBar} style={{width:35, resizeMode:'contain'}} />
          </View>
          <View style={{flex:2, justifyContent:'flex-start'}}>
            <Text style={{ fontFamily: 'Philosopher-Bold', fontSize: 25, marginLeft:10 }}>Kelas Bertani</Text>
          </View>
          <TouchableOpacity style={{flex:0.5,}}>
            <Image source={MenuIcon} style={{width:35, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>

        {/* Greating Text Box Hijau */}
        <View style={{width:'100%', paddingHorizontal:20}}>
          <View style={styles.BoxGreating}>
            <Image source={Farmer} style={styles.FarmerImg} />
            <View style={{width:200, marginLeft:15, marginTop:45}}>
              <Text style={styles.TextGreating}>Teknologi AI dan IoT Pertanian</Text>
            </View>
            <View style={{width:180, marginLeft:15, marginTop:20}}>
              <Text style={styles.TextGreatingExpln}>Monitoring & Control 100% Online 24/7</Text>
            </View>
          </View>
        </View>
        
        {/* Scan Tanaman */}
        <View style={{flexDirection:'row', width:'100%', paddingHorizontal:20, marginTop:20}}>
          <TouchableOpacity style={styles.BoxScanTanaman}>
            <Text style={styles.TextScan}>Scan Tanaman</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxSetKanal}>
            <Image source={iconsetcanal} style={{width:20, height:18, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>

        <View style={{width:'100%', marginTop:20, alignItems:'flex-start', paddingHorizontal:23}}>
          <Text style={{fontFamily:'Poppins-Bold', fontSize:14, color:'#0D986A'}}>Automatic & Control Pengairan</Text>
          <View style={{borderBottomWidth:2, borderBottomColor:'#0D986A', width:40, marginTop:5}}></View>
        </View>

        <View style={{width:'100%', paddingHorizontal:20, marginTop:10, alignItems:'center', justifyContent:'center'}}>
            <View style={styles.JajarGenjang}>
            </View>
            <Text style={{fontFamily:'Poppins-Bold', fontSize:16, color:'black', position:'absolute', left:50, top:25}}>6 Sensor Aktif</Text>
            <Text style={{fontFamily:'Philosopher-Bold', fontSize:30, color:'black', position:'absolute', left:50, top:50}}>Lahan 1</Text>
            <Text style={{fontFamily:'Philosopher', fontSize:16, color:'black', position:'absolute', left:50, top:85}}>Komoditas Tembakau</Text>
        </View>
  </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  TopBarBox:{
    marginTop:10, 
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
    position:'absolute',
    right:0,
    bottom:0
  },
  TextGreating:{
    fontFamily:'Philosopher-Bold',
    fontSize:24,
    color:'black'
  },
  TextGreatingExpln:{
    fontFamily:'Poppins-Regular',
    fontSize:14,
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
    fontSize:18,
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