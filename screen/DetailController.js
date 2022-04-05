import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {ProgressChart} from 'react-native-chart-kit'

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
const screenWidth = Dimensions.get('window').width;

let CountingRender = 0;

const DetailController = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [NamaPerangkat, setNamaPerangkat] = useState('Perangkat');
    const [JenisTanaman, setJenisTanaman] = useState('');
    const [HumMin, setHumMin] = useState(0);
    const [HumMax, setHumMax] = useState(0);
    const [Lokasi, setLokasi] = useState('Alamat Perangkat');
    const [LastUpdate, setLastUpdate] = useState('');
    const [StatusDevice, setStatusDevice] = useState('');
    const [IDDevice, setIDDevice] = useState('');
    const [IDController, setIDController] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [DataKanal1, setDataKanal1] = useState([]);
    const [DataKanal2, setDataKanal2] = useState([]);
    const [DataKanal3, setDataKanal3] = useState([]);
    const [DataKanal4, setDataKanal4] = useState([]);
    const [DataChartKanal1, setDataChartKanal1] = useState([0.4, 0.6, 0.8]);
    const [DataChartKanal2, setDataChartKanal2] = useState([0.4, 0.6, 0.8]);
    const [DataChartKanal3, setDataChartKanal3] = useState([0.4, 0.6, 0.8]);
    const [DataChartKanal4, setDataChartKanal4] = useState([0.4, 0.6, 0.8]);

    if(route.params != undefined){
        setTimeout(() => {
            // console.log(route.params.IDUser)
            // console.log(route.params.IDController)
            if(CountingRender == 0){
                setIDDevice(route.params.IDDevice);
                setIDUser(route.params.IDUser);
                setIDController(route.params.IDController);
                GetControllerUpdate(route.params.IDUser, route.params.IDController)
                CountingRender = 1;
            }
        
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
    
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

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
                let HumTanah1 = (KelembabanTanahKanal1/PembagiRata2Kanal1)/100;
                let HumUdara1 = (KelembabanUdaraKanal1/PembagiRata2Kanal1)/100;
                let TempUdara1 = (SuhuUdaraKanal1/PembagiRata2Kanal1)/100;
                setDataChartKanal1([HumTanah1,HumUdara1,TempUdara1]);
              
                setDataKanal2(json.dataKanal2);
              let PembagiRata2Kanal2 = 0;
              let KelembabanTanahKanal2 = 0;
              let KelembabanUdaraKanal2 = 0;
              let SuhuUdaraKanal2 = 0;
              for (let index = 0; index < json.dataKanal2.length; index++) {
                  PembagiRata2Kanal2++;
                  KelembabanTanahKanal2 = KelembabanTanahKanal2 + parseFloat(json.dataKanal2[index].hum_tanah);
                  KelembabanUdaraKanal2 = KelembabanUdaraKanal2 + parseFloat(json.dataKanal2[index].hum_udara);
                  SuhuUdaraKanal2 = SuhuUdaraKanal2 + parseFloat(json.dataKanal2[index].temp_udara);
                }
                let HumTanah2 = (KelembabanTanahKanal2/PembagiRata2Kanal2)/100;
                let HumUdara2 = (KelembabanUdaraKanal2/PembagiRata2Kanal2)/100;
                let TempUdara2 = (SuhuUdaraKanal2/PembagiRata2Kanal2)/100;
                setDataChartKanal2([HumTanah2,HumUdara2,TempUdara2]);
                
                setDataKanal3(json.dataKanal3);
              let PembagiRata2Kanal3 = 0;
              let KelembabanTanahKanal3 = 0;
              let KelembabanUdaraKanal3 = 0;
              let SuhuUdaraKanal3 = 0;
              for (let index = 0; index < json.dataKanal3.length; index++) {
                  PembagiRata2Kanal3++;
                  KelembabanTanahKanal3 = KelembabanTanahKanal3 + parseFloat(json.dataKanal3[index].hum_tanah);
                  KelembabanUdaraKanal3 = KelembabanUdaraKanal3 + parseFloat(json.dataKanal3[index].hum_udara);
                  SuhuUdaraKanal3 = SuhuUdaraKanal3 + parseFloat(json.dataKanal3[index].temp_udara);
                }
                let HumTanah3 = (KelembabanTanahKanal3/PembagiRata2Kanal3)/100;
                let HumUdara3 = (KelembabanUdaraKanal3/PembagiRata2Kanal3)/100;
                let TempUdara3 = (SuhuUdaraKanal3/PembagiRata2Kanal3)/100;
                setDataChartKanal3([HumTanah3,HumUdara3,TempUdara3]);
                
                setDataKanal4(json.dataKanal4);
              let PembagiRata2Kanal4 = 0;
              let KelembabanTanahKanal4 = 0;
              let KelembabanUdaraKanal4 = 0;
              let SuhuUdaraKanal4 = 0;
              for (let index = 0; index < json.dataKanal4.length; index++) {
                  PembagiRata2Kanal4++;
                  KelembabanTanahKanal4 = KelembabanTanahKanal4 + parseFloat(json.dataKanal4[index].hum_tanah);
                  KelembabanUdaraKanal4 = KelembabanUdaraKanal4 + parseFloat(json.dataKanal4[index].hum_udara);
                  SuhuUdaraKanal4 = SuhuUdaraKanal4 + parseFloat(json.dataKanal4[index].temp_udara);
                }
                let HumTanah4 = (KelembabanTanahKanal4/PembagiRata2Kanal4)/100;
                let HumUdara4 = (KelembabanUdaraKanal4/PembagiRata2Kanal4)/100;
                let TempUdara4 = (SuhuUdaraKanal4/PembagiRata2Kanal4)/100;
                setDataChartKanal4([HumTanah4,HumUdara4,TempUdara4]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const MyProgressChartKanal1 = () => {
        return (
          <>
            <Text style={styles.header}><Text style={styles.header}>Rata-rata sensor Kanal 1</Text></Text>
            <ProgressChart
                data={DataChartKanal1}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'grey',
                backgroundGradientTo: 'black',
                decimalPlaces: 2,
                color: (opacity = 10) => `rgba(46, 204, 133, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                marginRight:25
                }}
            />
        </>
        );
    };
    
    const MyProgressChartKanal2 = () => {
        return (
          <>
            <Text style={styles.header}>Rata-rata sensor Kanal 2</Text>
            <ProgressChart
                data={DataChartKanal2}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'grey',
                backgroundGradientTo: 'black',
                decimalPlaces: 2,
                color: (opacity = 10) => `rgba(46, 204, 133, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                marginRight:25
                }}
            />
        </>
        );
    };
    
    const MyProgressChartKanal3 = () => {
        return (
          <>
            <Text style={styles.header}>Rata-rata sensor Kanal 3</Text>
            <ProgressChart
                data={DataChartKanal3}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'grey',
                backgroundGradientTo: 'black',
                decimalPlaces: 2,
                color: (opacity = 10) => `rgba(46, 204, 133, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                marginRight:25
                }}
            />
        </>
        );
    };
    
    const MyProgressChartKanal4 = () => {
        return (
          <>
            <Text style={styles.header}>Rata-rata sensor Kanal 4</Text>
            <ProgressChart
                data={DataChartKanal4}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'grey',
                backgroundGradientTo: 'black',
                decimalPlaces: 2,
                color: (opacity = 10) => `rgba(46, 204, 133, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                marginRight:25
                }}
            />
        </>
        );
    };

    const HapusController = () => {
        Alert.alert(
            "Apakah Anda Yakin?",
            "Perangkat Anda Akan Terhapus Secara Permanen",
            [
              {
                text: "Batal",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Lanjutkan", onPress: () => ApiHapusController() }
        ])
    }

    const ApiHapusController = () => {
        fetch('https://alicestech.com/kelasbertani/api/controller/hapus?id_device=' + IDDevice)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            if(json.status == true){
                navigation.navigate('DaftarController', {IDUser:IDUser, IDController:IDController})
            }
        })
        .catch((error) => console.error(error))
    }

    useEffect(() => {
        UpdateCurrentTime();
        CountingRender = 0;
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

            <View style={{marginHorizontal:20, marginTop:10, flexDirection:'row', alignItems:'center'}}>
                <View>
                    <Text style={styles.TextPoppins}>ID Device  : {IDDevice}</Text>
                    <Text style={styles.TextPoppins}>Waktu Saat ini  : {currentDate}</Text>
                    <Text style={styles.TextPoppins}>Komoditas  : {JenisTanaman}</Text>
                    <Text style={styles.TextPoppins}>Lokasi  : {Lokasi}</Text>
                </View>
                <View style={{flex:1, marginLeft:30}}>
                    <TouchableOpacity style={{flexDirection:'row', borderRadius:10, backgroundColor:'#D74608', paddingVertical:5, paddingHorizontal:10, alignItems:'center', justifyContent:'center'}} onPress={()=>HapusController()}>
                        <Text style={styles.TextBtnON}>Hapus</Text>
                        <EvilIcons name="trash" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Kanal */}
            <View style={{paddingHorizontal:20}}>
                {/* Kanal 1 */}
                <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 1</Text>

                    {/* Chart Kanal 1 */}
                    <MyProgressChartKanal1 />

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                        <TouchableOpacity style={styles.BtnON}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 2 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 2</Text>
                    
                    {/* Chart Kanal 2 */}
                    <MyProgressChartKanal2 />

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                        <TouchableOpacity style={styles.BtnOFF}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 3 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 3</Text>
                    
                    {/* Chart Kanal 3 */}
                    <MyProgressChartKanal3 />

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                        <TouchableOpacity style={styles.BtnON}><Text style={styles.TextBtnON}>Matikan!</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Kanal 4 */}
                <View style={{marginTop:20, marginBottom:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 4</Text>
                    
                    {/* Chart Kanal 4 */}
                    <MyProgressChartKanal4 />

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