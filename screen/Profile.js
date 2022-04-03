import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import UserImage from '../assets/images/boy.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Profile = ({navigation}) => {

    useEffect(() => {

      }, []);

    let [fontsLoaded] = useFonts({
        'Philosopher': require('../assets/fonts/Philosopher-Regular.ttf'),
        'Philosopher-Bold': require('../assets/fonts/Philosopher-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      });
    
      if (!fontsLoaded) {
        return <AppLoading />;
      }

      const HapusDataUser = async () => {
        try {
            await AsyncStorage.removeItem('@DataUser');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            navigation.navigate('Login');
            return true;
        }
        catch(exception) {
            return false;
        }
      }

      const LogoutGo = () => {
        HapusDataUser();
      }
  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
        <ScrollView style={{marginBottom:50, width:windowWidth}}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Profile Pengguna</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start', paddingHorizontal:10, marginTop:25}}>
                <View style={{backgroundColor:'#E2E2E2', width:100, height:100, borderRadius:50, alignItems:'center', justifyContent:'center'}}>
                    <Image source={UserImage} style={{width:70, resizeMode:'contain'}} />
                </View>
                <View style={{marginLeft:20}}>
                    <Text style={styles.TextPoppinsBold}>Admin Sistem Aplikasi</Text>
                    <Text style={styles.TextPoppins}>Kelas Bertani</Text>
                    <TouchableOpacity style={styles.BoxBtn} onPress={()=>navigation.navigate('UbahProfile')}>
                        <Text style={styles.TextBtn}>Ubah Akses</Text>
                        <AntDesign name="key" size={14} color="white" style={{marginLeft:5}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.BoxBtnLogout} onPress={()=>LogoutGo()}>
                        <Text style={styles.TextBtn}>Logout</Text>
                        <AntDesign name="logout" size={14} color="white" style={{marginLeft:5}} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginHorizontal:20, marginTop:20}}>
                <Text style={styles.TextPoppinsBoldGreen}>Daftar Pengguna Aplikasi</Text>

                <TouchableOpacity style={styles.CardListUser}>
                    <Text style={styles.TextPoppinsBold}>Budi Santoso</Text>
                    <Text style={styles.TextPoppins}>Penyuluh Lapangan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.CardListUser}>
                    <Text style={styles.TextPoppinsBold}>Ari Mustofa</Text>
                    <Text style={styles.TextPoppins}>Penyuluh Lapangan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.CardListUser}>
                    <Text style={styles.TextPoppinsBold}>Galih Pramana Adi</Text>
                    <Text style={styles.TextPoppins}>Penyuluh Lapangan</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.TambahUserBtn} onPress={()=>navigation.navigate('TambahPengguna')}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>

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
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
    TopBarBox:{
        ...Platform.select({
            ios:{
            marginTop:50,
            },
            android:{
            marginTop:35
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
                height:90,
            },
            android:{
                height:70
            }
        }), 
        backgroundColor:'#9CE5CB', 
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
    CardListUser:{
        width:'100%',
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
        marginTop:10,
        borderRadius:10,
    },
    BoxBtn:{
        backgroundColor:'grey',
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        marginTop:5,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    BoxBtnLogout:{
        backgroundColor:'red',
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        marginTop:5,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    TextBtn:{
        fontFamily:'Poppins-Bold',
        color:'white',
        fontSize:12
    },
    TambahUserBtn:{
        width:50,
        height:50,
        borderRadius:50/2,
        backgroundColor:'#0D986A',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:80,
        right:20
    }
})