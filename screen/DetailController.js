import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const DetailController = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [NamaPerangkat, setNamaPerangkat] = useState('Perangkat');
    const [JenisTanaman, setJenisTanaman] = useState('');
    const [HumMin, setHumMin] = useState(0);
    const [HumMax, setHumMax] = useState(0);
    const [Lokasi, setLokasi] = useState('Alamat Perangkat');
    const [LastUpdate, setLastUpdate] = useState('');
    const [StatusDevice, setStatusDevice] = useState('');
    const [DataKanal1, setDataKanal1] = useState([]);

    const [HumTanahKanal1, setHumTanahKanal1] = useState(0);
    const [HumUdaraKanal1, setHumUdaraKanal1] = useState(0);
    const [TempUdaraKanal1, setTempUdaraKanal1] = useState(0);
    
    const [HumTanahKanal2, setHumTanahKanal2] = useState(0);
    const [HumUdaraKanal2, setHumUdaraKanal2] = useState(0);
    const [TempUdaraKanal2, setTempUdaraKanal2] = useState(0);

    if(route.params != undefined){
        setTimeout(() => {
            // console.log(route.params.IDUser)
            // console.log(route.params.IDController)
            GetControllerUpdate(route.params.IDUser, route.params.IDController)
        }, 1000);
        
    }

    const GetControllerUpdate = async (id_user, id_controller) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/controller?id_user=' + id_user + '&id_controller=' + id_controller
            );
            let json = await response.json();
            if(json.status == true){
              setNamaPerangkat(json.result[0].nama_perangkat);
              setJenisTanaman(json.result[0].tanaman);
              setHumMin(json.result[0].hum_min);
              setHumMax(json.result[0].hum_max);
              setLokasi(json.result[0].lokasi);
              setLastUpdate(json.selisih_waktu);
              setStatusDevice(json.status_device);
              UpdateCurrentTime();
              GetKanalUpdate(json.result[0].id_device)
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const GetKanalUpdate = async (id_device_induk) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/kanal?id_device_induk=' + id_device_induk
            );
            let json = await response.json();
            if(json.status == true){
            //   console.log(json.dataKanal1);
              setDataKanal1(json.dataKanal1);
              let PembagiRata2Kanal1 = 0;
              let KelembabanTanahKanal1 = 0;
              let KelembabanUdaraKanal1 = 0;
              let SuhuUdaraKanal1 = 0;
              for (let index = 0; index < json.dataKanal1.length; index++) {
                  PembagiRata2Kanal1++;
                  KelembabanTanahKanal1 = KelembabanTanahKanal1 + parseFloat(json.dataKanal1[index].hum_tanah);
                  KelembabanUdaraKanal1 = KelembabanUdaraKanal1 + parseFloat(json.dataKanal1[index].hum_udara);
                  SuhuUdaraKanal1 = SuhuUdaraKanal1 + parseFloat(json.dataKanal1[index].temp_udara);
                }
                setHumTanahKanal1(KelembabanTanahKanal1/PembagiRata2Kanal1);
                setHumUdaraKanal1(KelembabanUdaraKanal1/PembagiRata2Kanal1);
                setTempUdaraKanal1(SuhuUdaraKanal1/PembagiRata2Kanal1);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        UpdateCurrentTime();
    }, []);

    const UpdateCurrentTime = () => {
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Detail Controller</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.navigate('SettingController')}>
                        <EvilIcons name="gear" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderBottomWidth:0.2, paddingVertical:5, marginHorizontal:20}}>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>PERANGKAT</Text>
                    <Text style={styles.TextPoppinsBold}>{NamaPerangkat}</Text>
                </View>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>STATUS</Text>
                    <Text style={styles.TextPoppinsBold}>{StatusDevice}</Text>
                </View>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>LAST UPDATE</Text>
                    <Text style={styles.TextPoppinsBold}>{LastUpdate}</Text>
                </View>
            </View>

            <View style={{marginHorizontal:20, marginTop:10}}>
                <Text style={styles.TextPoppins}>Waktu Saat ini  : {currentDate}</Text>
                <Text style={styles.TextPoppins}>Komoditas  : {JenisTanaman}</Text>
                <Text style={styles.TextPoppins}>Lokasi  : {Lokasi}</Text>
            </View>

            {/* Kanal */}
            <View style={{paddingHorizontal:20}}>
                {/* Kanal 1 */}
                <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 1</Text>
                    
                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                        <TouchableOpacity style={styles.BtnON}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 2 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 2</Text>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS001</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS002</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                        <TouchableOpacity style={styles.BtnOFF}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 3 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 3</Text>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS001</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS002</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                        <TouchableOpacity style={styles.BtnON}><Text style={styles.TextBtnON}>Matikan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 4 */}
                <View style={{marginTop:20, marginBottom:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 4</Text>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS001</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.CardKanal}>
                        <Text style={styles.TextPoppins}>SENS002</Text>
                        <View style={{marginTop:5, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <FontAwesome5 name="temperature-low" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>30&deg;C</Text>
                                    <Text style={styles.TextPoppins}>SUHU</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', flex:2}}>
                                <Ionicons name="water" size={24} color="#FCCC1F" />
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.TextPoppinsBoldGreen}>65%</Text>
                                    <Text style={styles.TextPoppins}>KELEMBABAN</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                        <TouchableOpacity style={styles.BtnOFF}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                    </View>
                </View>
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
    </SafeAreaView>
  )
}

export default DetailController

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:5
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
        // backgroundColor:'#9CE5CB', 
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
    CardKanal:{
        marginTop:10,
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:10,
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    BtnOFF:{
        backgroundColor:'#D74608',
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        width:100,
        alignItems:'center',
        marginLeft:20
    },
    TextBtnOFF:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    BtnON:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        width:100,
        alignItems:'center',
        marginLeft:20
    },
    TextBtnON:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    }
})