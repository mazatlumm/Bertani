import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Alert, FlatList, Platform, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconUser from '../assets/images/iconUser.png'
// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import DetailDataTanahOnline from './DetailDataTanahOnline';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const FavouriteOnlineData = ({navigation, route}) => {

    const [DataFlatList, setDataFlatList] = useState([]);
    const [modalVisibleFavourite, setmodalVisibleFavourite] = useState([]);
    
    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
    }, [isFocused])
    
    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        console.log(ParsingDataUser[0].id_user)
        if(ParsingDataUser[0].id_user){
            GetCekTanah(ParsingDataUser[0].id_user, ParsingDataUser[0].role);
        }
        } catch(e) {
        // error reading value
        }
    }

    const GetCekTanah = async (id_user, role) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/cek_tanah?id_user=' + id_user + '&role=' + role);
            let json = await response.json();
            if(json.status == true){
              console.log(json.result[0]);
              setDataFlatList(json.result);
            }
        } catch (error) {
            console.error(error);
        }
      }

    const CekDetailTanahOnline = (komoditas, keterangan, nitrogen, phospor, kalium, suhu, kelembaban, ph, mikroorganisme, get_time, id_device, id_cek_tanah, salinitas, tds) => {
        navigation.navigate('DetailDataTanahOnline', {
            komoditas : komoditas,
            keterangan : keterangan,
            nitrogen : nitrogen,
            phospor : phospor,
            kalium : kalium,
            suhu : suhu,
            kelembaban : kelembaban,
            ph : ph, 
            mikroorganisme : mikroorganisme, 
            salinitas : salinitas, 
            tds : tds, 
            get_time : get_time,
            id_device : id_device,
            id_cek_tanah : id_cek_tanah,
        })
    }

    const Item = ({ komoditas, keterangan, nitrogen, phospor, kalium, suhu, kelembaban, ph, mikroorganisme, get_time, id_device, id_cek_tanah, salinitas, tds }) => (
        <TouchableOpacity style={styles.Card} onPress={()=>CekDetailTanahOnline(komoditas, keterangan, nitrogen, phospor, kalium, suhu, kelembaban, ph, mikroorganisme, get_time, id_device, id_cek_tanah, salinitas, tds)}>
            <View style={{marginBottom:5, borderBottomWidth:0.3, paddingBottom:5}}>
                <Text style={styles.TextPoppinsBold}>{komoditas}</Text>
                <Text style={styles.TextPoppins}>{keterangan}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:2}}>
                    <Text style={styles.TextPoppins}>Nitrogen : {nitrogen} ml</Text>
                    <Text style={styles.TextPoppins}>Phospor : {phospor} %</Text>
                    <Text style={styles.TextPoppins}>Kalim : {kalium} mg</Text>
                    <Text style={styles.TextPoppins}>Suhu : {suhu}&deg;C</Text>
                </View>
                <View style={{flex:2}}>
                    <Text style={styles.TextPoppins}>Kelembaban : {kelembaban}%</Text>
                    <Text style={styles.TextPoppins}>PH : {ph}</Text>
                    <Text style={styles.TextPoppins}>Mikroorganisme : {mikroorganisme}%</Text>
                    <Text style={styles.TextPoppins}>Waktu : {get_time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    const renderItem = ({ item }) => <Item komoditas={item.komoditas} keterangan={item.keterangan} nitrogen={item.nitrogen} kalium={item.kalium} phospor={item.phospor} suhu={item.suhu} kelembaban={item.kelembaban} ph={item.ph} mikroorganisme={item.mikroorganisme} get_time={item.get_time} id_device={item.id_device} id_cek_tanah={item.id_cek_tanah} salinitas={item.salinitas} tds={item.tds}/>;

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{paddingHorizontal:20, width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:3, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Kualitas Tanah Online</Text>
                </View>
                <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <EvilIcons name="arrow-left" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.BoxFlatList}>
            <FlatList data={DataFlatList} renderItem={renderItem} keyExtractor={item => item.id_cek_tanah} />
        </View>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:10, paddingBottom:5, justifyContent:'center', alignItems:'center', width:'100%'}}>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
                <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
                <Text style={styles.TextPoppinsKecil}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('FavouriteLocalData')}>
                <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
                <Text style={styles.TextPoppinsKecil}>Data Tanah</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('DaftarController', {IDUser:IDUser})}>
                <SimpleLineIcons name="game-controller" size={24} color="black" />
                <Text style={styles.TextPoppinsKecil}>Controller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
                <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
                <Text style={styles.TextPoppinsKecil}>Akun</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default FavouriteOnlineData

const styles = StyleSheet.create({
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
        ...Platform.select({
            ios:{
                fontSize:12,
            },
            android:{
                fontSize:10
            }
        }),
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
    Card:{
        width:'97%',
        backgroundColor:'white',
        paddingHorizontal:20,
        paddingVertical:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:2,
        borderRadius:10,
        marginBottom:10,
        marginHorizontal:5
    },
    BtnUploadData:{
        width:50,
        height:50,
        borderRadius:50/2,
        backgroundColor:'#0D986A',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:80,
        right:20
    },
    BoxFlatList:{
        marginTop:20, 
        width:'100%', 
        paddingHorizontal:20,
        ...Platform.select({
            ios:{
                marginBottom:60,
            },
            android:{
                marginBottom:100
            }
        })
    },
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
    },
})