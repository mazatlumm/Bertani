import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import * as Location from 'expo-location';
import axios from 'axios';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import 'moment/locale/id'
import { WebView } from 'react-native-webview';

import iconHome from '../assets/images/iconHome.png'
import iconLove from '../assets/images/iconLove.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import GIFCuaca from '../assets/gif/cuaca.gif'

import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons'; 

const Cuaca = ({navigation}) => {

    const [errorMsg, setErrorMsg] = useState(null);
    const [ArrayCuacaFix, setArrayCuacaFix] = useState([]);
    const [FetchCuaca, setFetchCuaca] = useState(false);
    const [Latitude, setLatitude] = useState('');
    const [Longitude, setLongitude] = useState('');
    const [AddressFull, setAddressFull] = useState([]);
    

    const isFocused = useIsFocused();
    useEffect(() => {
        CekLokasi()
    }, [isFocused])

    const CekLokasi = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            console.log(location.coords);
            setTimeout(() => {
                AmbilDataOpenWeather(location.coords.latitude, location.coords.longitude,); 
            }, 2000);
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
      }

      const AmbilDataOpenWeather = async (latitude, longitude) => {   
        console.log('Ambil Data Dari OpenWeather')     
        let GeoCodingData = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
        // console.log(GeoCodingData);
        setAddressFull(GeoCodingData[0].district + ', ' + GeoCodingData[0].city + ', ' + GeoCodingData[0].subregion)
        await axios.get('https://api.openweathermap.org/data/2.5/onecall?', {
            params: {
              lat: latitude,
              lon: longitude,
              exclude: 'current,minutely,hourly',
              appid: '3805c5b035c59b637431659685137022',
              units: 'metric',
              lang: 'id'
            }
          })
          .then(response => {
            console.log(response.data)
            setFetchCuaca(true)
            const ArrayCuaca = [];
            for (let index = 0; index < response.data.daily.length; index++) {
                var Tanggal = new Date(response.data.daily[index].dt * 1000);
                var TanggalForecast = Moment(Tanggal).utcOffset('+07:00').format('dddd, DD MMMM YYYY')
                let nilaiHujan = 0;
                if(response.data.daily[index].rain != undefined){
                    nilaiHujan = response.data.daily[index].rain;
                }
                ArrayCuaca[index] = {
                    id : index+1,
                    tanggal : TanggalForecast,
                    icon : response.data.daily[index].weather[0].icon,
                    kelembaban : response.data.daily[index].humidity,
                    hujan : nilaiHujan,
                    uvi : response.data.daily[index].uvi,
                    suhu : response.data.daily[index].temp.day,
                    kecepatan_angin : response.data.daily[index].wind_speed,
                    awan : response.data.daily[index].clouds,
                    deskripsi : response.data.daily[index].weather[0].description.replace(/\b(\w)/g, s => s.toUpperCase()),
                };
            }
            console.log(ArrayCuaca);
            setArrayCuacaFix(ArrayCuaca);
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
          });
      }

      const Item = ({ hujan, icon, kecepatan_angin, kelembaban, suhu, tanggal, uvi, deskripsi, awan }) => (
        <View style={{marginTop:0}}>
            <View style={{borderRadius:10, paddingVertical:10, paddingHorizontal:20, marginBottom:5, backgroundColor:'#79e9ce'}}
            >
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{alignItems:'flex-start', flex:1.5}}>
                        <Image style={{width:70, height:70}} resizeMode="contain" source={{uri:`http://openweathermap.org/img/wn/${icon}.png`}} />
                        <Text style={styles.ValueCuacaDeskripsi}>{deskripsi}</Text>
                        <Text style={styles.ValueCuacaTanggal}>{tanggal}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.ValueCuaca}>{suhu}&deg;C</Text>
                        <Text style={styles.ValueCuacaKet}>Suhu</Text>
                        <Text style={styles.ValueCuaca}>{hujan} mm</Text>
                        <Text style={styles.ValueCuacaKet}>hujan</Text>
                        <Text style={styles.ValueCuaca}>{uvi}</Text>
                        <Text style={styles.ValueCuacaKet}>UV</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.ValueCuaca}>{kelembaban}%</Text>
                        <Text style={styles.ValueCuacaKet}>Kelembaban</Text>
                        <Text style={styles.ValueCuaca}>{kecepatan_angin} ms</Text>
                        <Text style={styles.ValueCuacaKet}>Angin</Text>
                        <Text style={styles.ValueCuaca}>{awan}%</Text>
                        <Text style={styles.ValueCuacaKet}>Awan</Text>
                    </View>
                </View>
                {/* Card Cuaca */}
            </View>
        </View>
    );

      const renderItem = ({ item }) => <Item hujan={item.hujan} icon={item.icon} kecepatan_angin={item.kecepatan_angin} kelembaban={item.kelembaban} suhu={item.suhu} tanggal={item.tanggal} uvi={item.uvi} deskripsi={item.deskripsi} awan={item.awan} />;
    
    let [fontsLoaded] = useFonts({
    'Philosopher': require('../assets/fonts/Philosopher-Regular.ttf'),
    'Philosopher-Bold': require('../assets/fonts/Philosopher-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded) {
    return <AppLoading />;
    }

    const OlahPesanWeb = (event) => {
        console.log(event.nativeEvent.data);
        const DataLokasiBaru = JSON.parse(event.nativeEvent.data);
        console.log('Jenis Data: ' + DataLokasiBaru.data)
        AmbilDataOpenWeather(DataLokasiBaru.latitude, DataLokasiBaru.longitude)
    }

    const Tampilan = () => {
        if(FetchCuaca == false){
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'white'}}>
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Image style={{width:200}} resizeMode={'contain'} source={GIFCuaca} />
                        <Text style={styles.ValueCuacaDeskripsi}>Sedang Mengambil Data Cuaca ...</Text>
                    </View>
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
                </View>
            )
        }else{
            return (
            <View style={{flex:1}}>
                <View style={{height:350}}>
                    {AddressFull != '' ? 
                        <View style={{position:'absolute', bottom:5, right:0, paddingHorizontal:10, paddingVertical:5, zIndex:10, backgroundColor:'white', borderBottomLeftRadius:10, borderTopLeftRadius:10}}>
                            <Text style={styles.ValueAlamatCuaca}>{AddressFull}</Text>
                        </View>
                        :
                        <View></View>
                    }
                    <WebView 
                        style={styles.container}
                        source={{ uri: 'https://alicestech.com/geptan/cuaca_map'}}
                        onMessage={(event)=> OlahPesanWeb(event)}
                    />
                </View>
                <View>
                    <FlatList style={{marginHorizontal:10, marginBottom:400, marginTop:10}} data={ArrayCuacaFix} renderItem={renderItem} keyExtractor={item => item.id} scrollEnabled={true} />
                </View>
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
            </View>
            )
        }
    }
    
  return (
    Tampilan()
  )
}

export default Cuaca

const styles = StyleSheet.create({
    ValueCuacaDeskripsi:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        textAlign:'center'
    },
    ValueAlamatCuaca:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        textAlign:'right'
    },
    ValueCuacaKet:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
    },
    ValueCuacaTanggal:{
        fontFamily:'Poppins-Bold',
        fontSize:10,
        color:'black',
    },
    ValueCuaca:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black',
    },
    containerWebView:{
        flex:1
    }
})