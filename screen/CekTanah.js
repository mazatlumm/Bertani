import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

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

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const CekTanah = ({navigation}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [IDUser, setIDUser] = useState('');

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        setIDUser(ParsingDataUser[0].id_user); 
        } catch(e) {
        // error reading value
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
          date + '/' + month + '/' + year 
          + ' ' + hours + ':' + min + ':' + sec
        );
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
        <ScrollView style={{marginBottom:0, width:windowWidth, backgroundColor:'white'}}>
            {/* Top Bar */}
            <TopBar />
            <View style={styles.JajarGenjang}></View>
            <Image source={Angin} style={{position:'absolute', width:windowWidth, resizeMode:'contain', top:0, left:0}} />
            <View style={{paddingHorizontal:20, position:'relative', height:300}}>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Nama Perangkat</Text>
                <Text style={{fontFamily:'Philosopher-Bold', fontSize:24, marginTop:5}}>SENSOR001</Text>
                <TouchableOpacity style={{backgroundColor:'white', paddingVertical:5, paddingHorizontal:10, borderRadius:10, position:'absolute', top:10, right:20 }}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#0D986A', fontSize:12}}>Hubungkan</Text>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:40}}>STATUS</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>Online</Text>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:10}}>LAST UPDATE</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>1 menit</Text>
                <Image source={plantGrow} style={{width:200, height:200, position:'absolute', bottom:40, right:20}} />

                <View style={styles.ActionButtonGL}>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:'#0D986A', justifyContent:'center', alignItems:'center', borderRadius:20}}>
                        <Image source={IconSmile} style={{width:28, height:16, resizeMode:'contain'}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:20, marginLeft:10}}>
                        <Image source={iconLove} style={{width:28, height:16, resizeMode:'contain'}} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal:20, marginTop:20}}>
                <Text style={styles.DataSensorText}>Data Sensor</Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>250 ml</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Nitrogen</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>35%</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Phosphorus</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>35 mg</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kalium</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>32 &deg;C</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Suhu</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>50%</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kelembaban</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>4.5</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>PH</Text>
                    </View>
                </View>

                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Konduktifitas Mikro Organisme</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Kandungan Mikro Organisme)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:24, color:'#0D986A'}}>100%</Text>
                    </View>
                </View>
                
                <View style={{marginTop:10, flexDirection:'row'}}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Waktu Pengambilan Data</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{currentDate}</Text>
                    </View>
                </View>
            <TouchableOpacity style={styles.ButtonSimpanPengukuran}>
            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Simpan Hasil Pengukuran</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
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
            alignItems:'center'
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
        }

        
})