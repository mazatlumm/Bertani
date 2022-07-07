import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import tanaman from '../assets/images/tanaman.png'

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

let CountingRender = 0;

const DaftarController = ({navigation, route}) => {

    const [ArrayListController, setArrayListController] = useState([]);
    const [IDUser, setIDUser] = useState([]);
    const [IDController, setIDController] = useState([]);

    if(route.params != undefined){
        setTimeout(() => {
            // console.log(route.params.IDUser)
            // console.log(route.params.IDController)
            if(CountingRender == 0){
                setIDUser(route.params.IDUser);
                setIDController(route.params.IDController);
                GetControllerUpdate(route.params.IDUser)
                CountingRender = 1;
            }
        
        }, 1000);
        
    }

    const GetControllerUpdate = async (id_user) => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/controller?id_user=' + id_user
            );
            let json = await response.json();
            if(json.status == true){
              console.log(json);
              setArrayListController(json.result);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const DetailControllerCek = (id_controller, id_device) => {
        navigation.navigate('DetailController', {IDUser:IDUser, IDController:id_controller, IDDevice:id_device})
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        CountingRender = 0;
    }, [isFocused]);

    const Item = ({ nama_perangkat, id_controller, lokasi, hum_max, hum_min, NamaTanaman, IDDevice }) => (
        <TouchableOpacity style={{width:'100%', marginTop:30, alignItems:'center', justifyContent:'center', position:'relative'}} onPress={()=>DetailControllerCek(id_controller, IDDevice)}>
              <View style={styles.JajarGenjang}>
              </View>
              <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'black', position:'absolute', left:50, top:25}}>Detail Data</Text>
              <Text style={{fontFamily:'Philosopher-Bold', fontSize:18, color:'black', position:'absolute', left:50, top:50}}>{nama_perangkat}</Text>
              <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black', position:'absolute', left:50, top:85}}>Tanaman {NamaTanaman}</Text>
              <View style={{position:'absolute', right:0, bottom:50}}>
                <Image source={tanaman} style={{width:190, height:190,resizeMode:'contain'}} />
              </View>
              <View style={{position:'absolute', left:50, bottom:50, flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', fontSize:12}}>Hum Min : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>{hum_min}%</Text>
                <Text style={{color:'black',fontFamily:'Poppins-Regular', paddingLeft:10, fontSize:12}}>Hum Max : </Text>
                <Text style={{color:'black',fontFamily:'Poppins-Bold', paddingLeft:0, fontSize:14}}>{hum_max}%</Text>
              </View>
              <View style={{position:'absolute', left:50, bottom:20, width:260}}>
                <Text style={{fontFamily:'Philosopher', fontSize:12, color:'black'}}>Lokasi : {lokasi}</Text>
              </View>
          </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item nama_perangkat={item.nama_perangkat} id_controller={item.id_controller} lokasi={item.lokasi} hum_min={item.hum_min} hum_max={item.hum_max} NamaTanaman={item.tanaman} IDDevice={item.id_device} />;


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
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{paddingHorizontal:20, width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:3, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>List Controller</Text>
                </View>
                <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <EvilIcons name="arrow-left" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList style={{marginHorizontal:10}} data={ArrayListController} renderItem={renderItem} keyExtractor={item => item.id_controller} scrollEnabled={true} />
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

export default DaftarController

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:50,
                height:windowHeight-140,
            },
            android:{
                marginBottom:50,
                height:windowHeight-130,
            }
        }),
        width:windowWidth, 
        backgroundColor:'white',
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
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
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
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
    },
})