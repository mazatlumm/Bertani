import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import TopBarDetailController from './TopBarDetailController';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const DetailController = ({navigation}) => {

    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
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

  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
        <ScrollView style={{marginBottom:50, width:windowWidth}}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <TopBarDetailController />

            <View style={{marginTop:10, flexDirection:'row', borderBottomWidth:0.2, paddingVertical:5, marginHorizontal:20}}>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>PERANGKAT</Text>
                    <Text style={styles.TextPoppinsBold}>Lahan 1</Text>
                </View>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>STATUS</Text>
                    <Text style={styles.TextPoppinsBold}>Online</Text>
                </View>
                <View style={{marginTop:10, flex:2}}>
                    <Text style={styles.TextPoppins}>LAST UPDATE</Text>
                    <Text style={styles.TextPoppinsBold}>1 Menit</Text>
                </View>
            </View>

            <View style={{marginHorizontal:20, marginTop:10}}>
                <Text style={styles.TextPoppins}>Waktu Saat ini  : {currentDate}</Text>
                <Text style={styles.TextPoppins}>Komoditas  : Tembakau</Text>
                <Text style={styles.TextPoppins}>Lokasi  : Ds. Grogol, Kec, Diwek, Kab. Jombang</Text>
            </View>

            {/* Kanal */}
            <View style={{paddingHorizontal:20}}>
                {/* Kanal 1 */}
                <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsBold}>KANAL 1</Text>
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
    </View>
  )
}

export default DetailController

const styles = StyleSheet.create({
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