import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Alert, Modal, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {ProgressChart} from 'react-native-chart-kit'
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { FontAwesome5 } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingController from './TambahController';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))
const screenWidth = Dimensions.get('window').width;
var ArrDataKanal1 = '';
var ArrDataKanal2 = '';
var ArrDataKanal3 = '';
var ArrDataKanal4 = '';

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
    const [StatusKanal1, setStatusKanal1] = useState(0);
    const [StatusKanal2, setStatusKanal2] = useState(0);
    const [StatusKanal3, setStatusKanal3] = useState(0);
    const [StatusKanal4, setStatusKanal4] = useState(0);
    const [modalVisibleKanal, setmodalVisibleKanal] = useState(false);
    const [modalVisibleKanal2, setmodalVisibleKanal2] = useState(false);
    const [modalVisibleKanal3, setmodalVisibleKanal3] = useState(false);
    const [modalVisibleKanal4, setmodalVisibleKanal4] = useState(false);
    const [DataModal, setDataModal] = useState([]);



    const AmbilDataRoute = () => {
        if(route.params != undefined){
            setIDDevice(route.params.IDDevice);
            setIDUser(route.params.IDUser);
            setIDController(route.params.IDController);
            GetControllerUpdate(route.params.IDUser, route.params.IDController)
            CountingRender = 1;
        }
    }

    const GetControllerUpdate = async (id_user, id_controller) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/controller?id_user=' + id_user + '&id_controller=' + id_controller
            );
            let json = await response.json();
            if(json.status == true){
              setIDController(json.result[0].id_controller);
              setIDDevice(json.result[0].id_device);
              setNamaPerangkat(json.result[0].nama_perangkat);
              setJenisTanaman(json.result[0].tanaman);
              setHumMin(json.result[0].hum_min);
              setHumMax(json.result[0].hum_max);
              setLokasi(json.result[0].lokasi);
              setStatusKanal1(json.result[0].kanal1);
              setStatusKanal2(json.result[0].kanal2);
              setStatusKanal3(json.result[0].kanal3);
              setStatusKanal4(json.result[0].kanal4);
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
              ArrDataKanal1 = '';
              if(json.dataKanal1.length != 0){
                  for (let index = 0; index < json.dataKanal1.length; index++) {
                        ArrDataKanal1 += json.dataKanal1[index].id_device + ',';
                        PembagiRata2Kanal1++;
                        KelembabanTanahKanal1 = KelembabanTanahKanal1 + parseFloat(json.dataKanal1[index].hum_tanah);
                        KelembabanUdaraKanal1 = KelembabanUdaraKanal1 + parseFloat(json.dataKanal1[index].hum_udara);
                        SuhuUdaraKanal1 = SuhuUdaraKanal1 + parseFloat(json.dataKanal1[index].temp_udara);
                    }
                    // console.log('Data Kanal 1 : ' + ArrDataKanal1);
                    let HumTanah1 = (KelembabanTanahKanal1/PembagiRata2Kanal1)/100;
                    let HumUdara1 = (KelembabanUdaraKanal1/PembagiRata2Kanal1)/100;
                    let TempUdara1 = (SuhuUdaraKanal1/PembagiRata2Kanal1)/100;
                    setDataChartKanal1([HumTanah1,HumUdara1]);
              }else{
                  setDataChartKanal1([0,0]);
              }
              
                setDataKanal2(json.dataKanal2);
              let PembagiRata2Kanal2 = 0;
              let KelembabanTanahKanal2 = 0;
              let KelembabanUdaraKanal2 = 0;
              let SuhuUdaraKanal2 = 0;
              ArrDataKanal2 = '';
              if(json.dataKanal2.length != 0){
              for (let index = 0; index < json.dataKanal2.length; index++) {
                    ArrDataKanal2 += json.dataKanal2[index].id_device + ',';
                    PembagiRata2Kanal2++;
                    KelembabanTanahKanal2 = KelembabanTanahKanal2 + parseFloat(json.dataKanal2[index].hum_tanah);
                    KelembabanUdaraKanal2 = KelembabanUdaraKanal2 + parseFloat(json.dataKanal2[index].hum_udara);
                    SuhuUdaraKanal2 = SuhuUdaraKanal2 + parseFloat(json.dataKanal2[index].temp_udara);
                }
                // console.log('Data Kanal 2 : ' + ArrDataKanal2);
                let HumTanah2 = (KelembabanTanahKanal2/PembagiRata2Kanal2)/100;
                let HumUdara2 = (KelembabanUdaraKanal2/PembagiRata2Kanal2)/100;
                let TempUdara2 = (SuhuUdaraKanal2/PembagiRata2Kanal2)/100;
                setDataChartKanal2([HumTanah2,HumUdara2]);
            }else{
                setDataChartKanal2([0,0]);
            }
                
            setDataKanal3(json.dataKanal3);
              let PembagiRata2Kanal3 = 0;
              let KelembabanTanahKanal3 = 0;
              let KelembabanUdaraKanal3 = 0;
              let SuhuUdaraKanal3 = 0;
              ArrDataKanal3 = '';
              if(json.dataKanal3.length != 0){
              for (let index = 0; index < json.dataKanal3.length; index++) {
                    ArrDataKanal3 += json.dataKanal3[index].id_device + ',';
                    PembagiRata2Kanal3++;
                    KelembabanTanahKanal3 = KelembabanTanahKanal3 + parseFloat(json.dataKanal3[index].hum_tanah);
                    KelembabanUdaraKanal3 = KelembabanUdaraKanal3 + parseFloat(json.dataKanal3[index].hum_udara);
                    SuhuUdaraKanal3 = SuhuUdaraKanal3 + parseFloat(json.dataKanal3[index].temp_udara);
                }
                // console.log('Data Kanal 3 : ' + ArrDataKanal3);
                let HumTanah3 = (KelembabanTanahKanal3/PembagiRata2Kanal3)/100;
                let HumUdara3 = (KelembabanUdaraKanal3/PembagiRata2Kanal3)/100;
                let TempUdara3 = (SuhuUdaraKanal3/PembagiRata2Kanal3)/100;
                setDataChartKanal3([HumTanah3,HumUdara3]);
            }else{
                setDataChartKanal3([0,0]);
            }
                
                setDataKanal4(json.dataKanal4);
              let PembagiRata2Kanal4 = 0;
              let KelembabanTanahKanal4 = 0;
              let KelembabanUdaraKanal4 = 0;
              let SuhuUdaraKanal4 = 0;
              ArrDataKanal4 = '';
              if(json.dataKanal4.length != 0){
              for (let index = 0; index < json.dataKanal4.length; index++) {
                    ArrDataKanal4 += json.dataKanal4[index].id_device + ',';
                    PembagiRata2Kanal4++;
                    KelembabanTanahKanal4 = KelembabanTanahKanal4 + parseFloat(json.dataKanal4[index].hum_tanah);
                    KelembabanUdaraKanal4 = KelembabanUdaraKanal4 + parseFloat(json.dataKanal4[index].hum_udara);
                    SuhuUdaraKanal4 = SuhuUdaraKanal4 + parseFloat(json.dataKanal4[index].temp_udara);
                }
                // console.log('Data Kanal 4 : ' + ArrDataKanal4);
                let HumTanah4 = (KelembabanTanahKanal4/PembagiRata2Kanal4)/100;
                let HumUdara4 = (KelembabanUdaraKanal4/PembagiRata2Kanal4)/100;
                let TempUdara4 = (SuhuUdaraKanal4/PembagiRata2Kanal4)/100;
                setDataChartKanal4([HumTanah4,HumUdara4]);
            }else{
                setDataChartKanal4([0,0]);
            }
            }
        } catch (error) {
            console.error(error);
        }
    }
    console.log('Data Kanal 1');
    console.log(DataKanal1);

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
            // console.log(json);
            if(json.status == true){
                navigation.navigate('DaftarController', {IDUser:IDUser, IDController:IDController})
            }
        })
        .catch((error) => console.error(error))
    }

    const SettingController = () => {
        navigation.navigate('SettingController', {
            IDController:IDController,
            IDDevice:IDDevice,
            IDUser:IDUser,
            NamaPerangkat:NamaPerangkat,
            JenisTanaman:JenisTanaman,
            HumMin:HumMin,
            HumMax:HumMax,
            DataKanal1:ArrDataKanal1,
            DataKanal2:ArrDataKanal2,
            DataKanal3:ArrDataKanal3,
            DataKanal4:ArrDataKanal4,
            Lokasi:Lokasi,
            ScreenName:'DetailController',
        })
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        AmbilDataRoute();
        UpdateCurrentTime();
        CountingRender = 0;
    }, [isFocused]); 

    const SwitchKanal = (kanal, switchValue) => {
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://alicestech.com/kelasbertani/api/controller/control_button?id_device="+ IDDevice +"&kanal="+ kanal +"&switch=" + switchValue, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.status == true){
                GetControllerUpdate(IDUser, IDController);
            }
        })
        .catch(error => console.log('error', error));
    }

    const Item = ({ id_device, hum_tanah, hum_udara, temp_udara, jenis, created }) => (
        <View style={styles.CardKanal}>
            <Text style={styles.TextPoppins}>ID : {id_device} </Text>
            <Text style={styles.TextPoppins}>Last Update : {created}</Text>
            <View style={{flexDirection:'row', marginTop:5}}>
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'green'}}>{hum_tanah}%</Text>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black'}}>Soil Hum</Text>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'green'}}>{hum_udara}%</Text>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black'}}>Air Hum</Text>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'green'}}>{temp_udara}&deg;C</Text>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black'}}>Air Temp</Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }) => <Item id_device={item.id_device} hum_tanah={item.hum_tanah} hum_udara={item.hum_udara} temp_udara={item.temp_udara} created={item.created} jenis={item.jenis} />;

    const ShowModalDetail = (kanal) => {
        if(kanal == 'kanal1'){
            setDataModal(DataKanal1);
        }
        if(kanal == 'kanal2'){
            setDataModal(DataKanal2);
        }
        if(kanal == 'kanal3'){
            setDataModal(DataKanal3);
        }
        if(kanal == 'kanal4'){
            setDataModal(DataKanal4);
        }
        setmodalVisibleKanal(true);
    }

    const StatusKanal1Btn = () => {
        if(StatusKanal1 == 0){
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                    <TouchableOpacity style={styles.BtnON} onPress={()=>SwitchKanal('kanal1',1)}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                </View>
            );
        }else{
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                    <TouchableOpacity style={styles.BtnOFF} onPress={()=>SwitchKanal('kanal1',0)}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                </View>
            );
        }
    }

    const StatusKanal2Btn = () => {
        if(StatusKanal2 == 0){
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                    <TouchableOpacity style={styles.BtnON} onPress={()=>SwitchKanal('kanal2',1)}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                </View>
            );
        }else{
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                    <TouchableOpacity style={styles.BtnOFF} onPress={()=>SwitchKanal('kanal2',0)}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                </View>
            );
        }
    }

    const StatusKanal3Btn = () => {
        if(StatusKanal3 == 0){
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                    <TouchableOpacity style={styles.BtnON} onPress={()=>SwitchKanal('kanal3',1)}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                </View>
            );
        }else{
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                    <TouchableOpacity style={styles.BtnOFF} onPress={()=>SwitchKanal('kanal3',0)}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                </View>
            );
        }
    }

    const StatusKanal4Btn = () => {
        if(StatusKanal4 == 0){
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : NON-AKTIF</Text>
                    <TouchableOpacity style={styles.BtnON} onPress={()=>SwitchKanal('kanal4',1)}><Text style={styles.TextBtnON}>Hidupkan!</Text></TouchableOpacity>
                </View>
            );
        }else{
            return (
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.TextPoppins}>STATUS : AKTIF</Text>
                    <TouchableOpacity style={styles.BtnOFF} onPress={()=>SwitchKanal('kanal4',0)}><Text style={styles.TextBtnOFF}>Matikan!</Text></TouchableOpacity>
                </View>
            );
        }
    }

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
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleKanal}
            onRequestClose={() => {
            setmodalVisibleKanal(!modalVisibleKanal);
            }}>
            <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(243, 243, 243, 0.8)'}}>
                <View style={{backgroundColor:'white', borderRadius:10, width:'90%', height:'50%', alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:20, marginBottom:15}}>Detail Sensor Terpasang</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setmodalVisibleKanal(false)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>

                    <FlatList style={{width:'100%', paddingLeft:15}} data={DataModal} renderItem={renderItem} keyExtractor={item => item.id_hum_sensor} />

                </View>
            </SafeAreaView>
        </Modal>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Detail Controller</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> SettingController()}>
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
                    <TouchableOpacity style={{flexDirection:'row', borderRadius:10, backgroundColor:'green', paddingVertical:5, paddingHorizontal:10, alignItems:'center', justifyContent:'center'}} onPress={()=>navigation.goBack()}>
                        
                        <EvilIcons name="arrow-left" size={26} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{borderRadius:10, backgroundColor:'#D74608', paddingVertical:5, paddingHorizontal:10, alignItems:'center', justifyContent:'center', marginTop:10}} onPress={()=>HapusController()}>
                        
                        <EvilIcons name="trash" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Kanal */}
            <View style={{paddingHorizontal:20}}>
                {/* Kanal 1 */}
                <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 1</Text>
                    <TouchableOpacity onPress={()=> ShowModalDetail('kanal1')}>
                        {/* Chart Kanal 1 */}
                        <MyProgressChartKanal1 />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        {StatusKanal1Btn()}
                    </View>
                </View>

                {/* Kanal 2 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 2</Text>
                    <TouchableOpacity onPress={()=> ShowModalDetail('kanal2')}>
                        {/* Chart Kanal 2 */}
                        <MyProgressChartKanal2 />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        {StatusKanal2Btn()}
                    </View>
                </View>

                {/* Kanal 3 */}
                <View style={{marginTop:20}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 3</Text>
                    <TouchableOpacity onPress={()=> ShowModalDetail('kanal3')}>
                        {/* Chart Kanal 3 */}
                        <MyProgressChartKanal3 />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        {StatusKanal3Btn()}
                    </View>
                </View>

                {/* Kanal 4 */}
                <View style={{marginTop:20, marginBottom:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 4</Text>
                    <TouchableOpacity onPress={()=> ShowModalDetail('kanal4')}>
                        {/* Chart Kanal 4 */}
                        <MyProgressChartKanal4 />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                        {StatusKanal4Btn()}
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
        marginTop:5,
        marginHorizontal:10,
        marginBottom:10,
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
        width:'90%',
        alignItems:'center'
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