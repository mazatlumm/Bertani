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

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const FavouriteLocalData = ({navigation, route}) => {

    const [DataFlatList, setDataFlatList] = useState([]);
    const [modalVisibleFavourite, setmodalVisibleFavourite] = useState(false);
    
    const isFocused = useIsFocused();
    useEffect(() => {
        CekAsynFavourite();
    }, [isFocused])
    
    const CekAsynFavourite =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@TanahFavourite')
        const ParsingDataTanah = JSON.parse(jsonValue);
        // console.log(jsonValue)
        console.log(ParsingDataTanah)
        if(ParsingDataTanah != null){
            setDataFlatList(ParsingDataTanah);
        }else{
            // Alert.alert('Data Kosong', 'Anda belum melakukan pengukuran kualitas tanah lagi, Ukur sekarang!', [
            //     {
            //       text: "Batalkan",
            //       onPress: () => console.log("Cancel Pressed"),
            //       style: "cancel"
            //     },
            //     { text: "Lanjutkan", onPress: () => navigation.navigate('CekTanah')}
            //   ]);
        }
        } catch(e) {
        // error reading value
        }
    }

    const CekOnlineData = () => {
        setmodalVisibleFavourite(!modalVisibleFavourite);
        navigation.navigate('FavouriteOnlineData');
    }

    const HapusDataFavorit = async () => {
        await AsyncStorage.removeItem('@TanahFavourite');
    }
    
    const HapusDataFavoritGo = async () => {
        await AsyncStorage.removeItem('@TanahFavourite');
        setmodalVisibleFavourite(!modalVisibleFavourite);
        setTimeout(() => {
            navigation.navigate('CekTanah');
        }, 1000);
    }

    const UploadData = () => {
        console.log('Upload Data')

        var dataToSend = { data_arr: JSON.stringify(DataFlatList)};
        var formBody = [];
        for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        //POST request
        fetch('https://alicestech.com/kelasbertani/api/cek_tanah/', {
        method: 'POST',
        body: formBody, 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.status == true){
                Alert.alert('Berhasil', 'Data anda telah berada di cloud server');
                HapusDataFavorit();
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const Item = ({ komoditas, keterangan, nitrogen, phospor, kalium, suhu, kelembaban, ph, mikroorganisme, get_time }) => (
        <View style={styles.Card}>
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
        </View>
    );
    const renderItem = ({ item }) => <Item komoditas={item[0].komoditas} keterangan={item[0].keterangan} nitrogen={item[0].nitrogen} kalium={item[0].kalium} phospor={item[0].phospor} suhu={item[0].suhu} kelembaban={item[0].kelembaban} ph={item[0].ph} mikroorganisme={item[0].mikroorganisme} get_time={item[0].get_time}/>;

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleFavourite}
            onRequestClose={() => {
            setmodalVisibleFavourite(!modalVisibleFavourite);
            }}>
            <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(243, 243, 243, 0.8)'}}>
                <View style={{backgroundColor:'white', borderRadius:10, width:'90%', alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:20, marginBottom:15}}>Cloud & Local Server</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setmodalVisibleFavourite(!modalVisibleFavourite)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={{paddingHorizontal:20, width:'100%', marginBottom:20}}>
                        <Text style={styles.TextPoppins}>Apakah Anda ingin mengunggah data pengukuran kualitas tanah ke cloud server?</Text>
                        <Text style={styles.TextPoppins}>Anda dapat melakukannya dengan menekan tombol di bawah ini.</Text>
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#0D986A', borderRadius:20, marginTop:5}} onPress={()=>UploadData()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Upload Ke Cloud Sever</Text>
                        </TouchableOpacity>
                        <View style={{marginTop:15}}></View>
                        <Text style={styles.TextPoppins}>Apakah Anda ingin melihat seluruh data pengukuran kualitas tanah di cloud server?</Text>
                        <Text style={styles.TextPoppins}>Anda dapat melakukannya dengan menekan tombol di bawah ini.</Text>
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'orange', borderRadius:20, marginTop:5}} onPress={()=>CekOnlineData()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Periksa Data Online</Text>
                        </TouchableOpacity>
                        <View style={{marginTop:15}}></View>
                        <Text style={styles.TextPoppins}>Apakah Anda ingin menghapus semua data local server dan melakukan pengukuran lagi?</Text>
                        <Text style={styles.TextPoppins}>Anda dapat melakukannya dengan menekan tombol di bawah ini.</Text>
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'red', borderRadius:20, marginTop:5}} onPress={()=>HapusDataFavoritGo()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Hapus Data Offline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{paddingHorizontal:20, width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:3, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Kualitas Tanah</Text>
                </View>
                <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <EvilIcons name="arrow-left" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.BoxFlatList}>
            <FlatList data={DataFlatList} renderItem={renderItem} keyExtractor={item => item[0].get_time} />
        </View>

        <TouchableOpacity style={styles.BtnUploadData} onPress={()=> setmodalVisibleFavourite(true)}>
            <Entypo name="creative-cloud" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}}>
            {/* <Image source={iconBag} style={{height:24, width:24, resizeMode:'contain'}} /> */}
            <SimpleLineIcons name="game-controller" size={24} color="black" />          
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default FavouriteLocalData

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
    }
})