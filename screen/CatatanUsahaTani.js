import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Alert, Modal, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { ProgressChart, LineChart } from 'react-native-chart-kit'
import { useIsFocused } from '@react-navigation/native';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import CatatanKeuanganPic from '../assets/images/CatatanKeuangan.jpg'
import PetaniActivityPic from '../assets/images/petaniactivity.png'

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))
const screenWidth = Dimensions.get('window').width;

const CatatanUsahaTani = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');

    const dataLineChart = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(0, 185, 35, ${opacity})`,
          },
          {
            data: [20, 30, 20, 65, 75, 90],
            color: (opacity = 1) => `rgba(207, 40, 40, ${opacity})`,
          }
        ],
        legend: ["Pendapatan", "Pengeluaran"] // optional
    };

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
            <View style={{paddingHorizontal:20, width:'100%', marginBottom:10}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Pencatatan Usaha Tani</Text>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex:0.5, alignItems:'flex-end'}}>
                        <EvilIcons name="arrow-left" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal:20}}>
                <View style={{marginTop:10}}>
                    <TouchableOpacity>
                        <LineChart
                            data={dataLineChart}
                            width={Dimensions.get('window').width - 50}
                            height={220}
                            chartConfig={{
                                backgroundColor: 'rgba(0, 185, 35, 0.3)',
                                backgroundGradientFrom: 'rgba(0, 185, 35, 0.3)',
                                backgroundGradientTo: 'white',
                                color: (opacity = 1) => `rgba(41, 41, 41, ${opacity})`,
                            }}
                            style={{borderRadius:15,}}
                        />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                    </View>
                </View>
            </View>
            <View style={{marginHorizontal:20, marginTop:10}}>
                <Text style={styles.TextPoppinsBold}>Buat Rencana Kegiatan Usaha Tani</Text>
                <Text style={styles.TextPoppins}>Rencana kegiatan akan membuat usaha Anda dapat berjalan dengan baik, Anda juga bisa mendapatkan notifikasi pada setiap kegiatan yang akan Anda lakukan</Text>
                <View style={{ alignItems:'center'}}>
                    <Image source={PetaniActivityPic} style={{width:400, height:200}} resizeMode="contain" />

                </View>
                <TouchableOpacity onPress={()=> navigation.navigate('AgendaKegiatanTani')} style={styles.BtnSuccess}>
                    <Text style={styles.TextBtnWhite}>Buat Rencana Kegiatan!</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal:20, marginTop:20}}>
                <Text style={styles.TextPoppinsBold}>Catat Pengeluaran & Pendapatan Usaha Tani Anda</Text>
                <Text style={styles.TextPoppins}>Kegiatan ini dapat membantu mengidentifikasi masalah keuangan usaha Anda, dan melihat apakah usaha Anda telah mencapai target yang Anda impikan selama ini</Text>
                <View style={{ alignItems:'center'}}>
                    <Image source={CatatanKeuanganPic} style={{width:400, height:200}} resizeMode="contain" />

                </View>
                <TouchableOpacity style={styles.BtnDanger}>
                    <Text style={styles.TextBtnWhite}>Tambah Catatan Sekarang!</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
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

export default CatatanUsahaTani

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:5
            },
            android:{
                marginBottom:60
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
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
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
    BtnDanger:{
        backgroundColor:'#d34539',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
        marginTop:20
    },
    BtnSuccess:{
        backgroundColor:'#30B700',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
        marginTop:20
    },
    TextBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
})