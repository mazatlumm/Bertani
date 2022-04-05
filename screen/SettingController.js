import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));
let CountRender = 0;

const SettingController = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [IDController, setIDController] = useState('');

    if(route.params != undefined && CountRender == 0){
        setIDController(route.params.IDCntrlPass)
        CountRender = 1;
    }

    const OpenScanner = () => {
        navigation.navigate('QRScanner');
        CountRender = 0;
    }

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

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Setting Controller</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack() }>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={{marginHorizontal:20, marginTop:10, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={IDController => setIDController(IDController)}
                            defaultValue={IDController}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup} onPress={()=> OpenScanner()}>
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Nama Perangkat</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Tanaman</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban Minimal</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm}
                            keyboardType={'number-pad'}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup}>
                            <MaterialCommunityIcons name="water-percent" size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban Maksimal</Text>
                    <View style={styles.FormGroup}>
                        <View style={styles.FormInputBoxGroup}>
                            <TextInput 
                            style={styles.TextInputForm}
                            keyboardType={'number-pad'}
                            />
                        </View>
                        <TouchableOpacity style={styles.IconFormGroup}>
                            <MaterialCommunityIcons name="water-percent" size={24} color="orange" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 1</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 2</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 3</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>ID Device Sensor Kanal 4</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} placeholder={'ID_Device_1,ID_Device_2'} />
                    </View>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Lokasi Controller</Text>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} />
                    </View>
                </View>

                <TouchableOpacity style={styles.BtnBox}>
                    <Text style={styles.BtnTitle}>Simpan Data</Text>
                    <MaterialIcons name="save-alt" style={{marginLeft:10}} size={18} color="white" />
                </TouchableOpacity>
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

export default SettingController

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:0
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
        // backgroundColor:'white', 
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
    FormInput:{
        marginTop:10,
    },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
    },
    FormInputBoxGroup:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        flex:3,
        justifyContent:'center'
    },
    FormGroup:{
        flexDirection:'row'
    },
    IconFormGroup:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        marginLeft:5,
        alignItems:'center',
        justifyContent:'center'
    },
    TextInputForm:{
        fontFamily:'Poppins-Regular',
        color:'black',
        fontSize:12
    },
    BtnBox:{
        borderRadius:10,
        backgroundColor:'green',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        flexDirection:'row'
    },
    BtnTitle:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    }
})