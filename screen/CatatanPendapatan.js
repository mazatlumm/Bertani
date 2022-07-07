import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform, TextInput, Alert, FlatList, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconUser from '../assets/images/iconUser.png'

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

// Icon
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const CatatanPendapatan = ({navigation}) => {

    const [IDUser, setIDUser] = useState('');
    const [ModalTambahPendapatan, setModalTambahPendapatan] = useState(false);
    const [JudulPendapatan, setJudulPendapatan] = useState('');
    const [Catatan, setCatatan] = useState('');
    const [TotalPendapatan, setTotalPendapatan] = useState('');
    const [TanggalPendapatanMasuk, setTanggalPendapatanMasuk] = useState('Tanggal Pendapatan Masuk');
    const [OpenDatePicker, setOpenDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [StartDate, setStartDate] = useState(new Date());
    const [EndDate, setEndDate] = useState(new Date());
    const [OpenStartDate, setOpenStartDate] = useState(false);
    const [OpenEndDate, setOpenEndDate] = useState(false);
    const [ArrayListPendapatan, setArrayListPendapatan] = useState([]);

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        // console.log(jsonValue)
        setIDUser(ParsingDataUser[0].id_user);
        UbahFormatTanggal(ParsingDataUser[0].id_user);
        } catch(e) {
        // error reading value
        }
    }

    const GetDataPendapatan = async (starDate, endDate) => {
      if(IDUser != ''){
        await axios.get('https://alicestech.com/kelasbertani/api/pendapatan', {
              params: {
                id_user: IDUser,
                start_date: starDate,
                end_date: endDate
              }
            })
            .then(response => {
              console.log(response.data.result)
            })
            .catch(e => {
              if (e.response.status === 404) {
                console.log(e.response.data)
              }
          });
      }
    }

    const SimpanPendapatan = async () => {
      const ParameterUrl = { 
        id_user: IDUser,
        judul: JudulPendapatan,
        catatan: Catatan,
        total: TotalPendapatan,
        tanggal: TanggalPendapatanMasuk,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/pendapatan', ParameterUrl)
      .then(response => {
        console.log(response.data)
        if(response.data.status == true){
          Alert.alert('Berhasil', 'Pendapatan telah tersimpan',[
            {
              text: "Batal",
              onPress: () => console.log("Batal"),
              style: "cancel"
            },
            { text: "Ok", onPress: () => setModalTambahPendapatan(!ModalTambahPendapatan) }
          ]);
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
          Alert.alert('Mohon Maaf', e.response.data.message);
        }
      });
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        console.log('Start Date: ' + moment(StartDate).format('YYYY-MM-DD'))
        var newDate = moment(StartDate, "YYYY-MM-DD").add(3, 'months');
        console.log('End Date: ' + moment(newDate).format('YYYY-MM-DD'));
        //set Tanggal
        setStartDate(moment(StartDate).format('YYYY-MM-DD'));
        setEndDate(moment(new Date(newDate)).format('YYYY-MM-DD')); 
        GetDataPendapatan(moment(StartDate).format('YYYY-MM-DD'), moment(new Date(newDate)).format('YYYY-MM-DD'))
      }, [isFocused, IDUser]);

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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
        <DatePicker
          modal
          open={OpenDatePicker}
          date={new Date(StartDate)}
          onConfirm={(date) => {
            const TanggalPendapatan = new Date(date);
            setTanggalPendapatanMasuk(moment(TanggalPendapatan).format('YYYY-MM-DD'));
            setOpenDatePicker(!OpenDatePicker);
            console.log(TanggalPendapatan);
          }}
          onCancel={() => {
            setOpenDatePicker(!OpenDatePicker)
          }}
          title="Pilih Tanggal"
          mode='date'
          locale='id'
          confirmText='Ok'
          cancelText='Batal'
        />
        <DatePicker
          modal
          open={OpenStartDate}
          date={date}
          onConfirm={(date) => {
            const TanggalPendapatan = new Date(date);
            setStartDate(moment(TanggalPendapatan).format('YYYY-MM-DD'));
            setOpenStartDate(!OpenStartDate);
            console.log(TanggalPendapatan);
          }}
          onCancel={() => {
            setOpenStartDate(!OpenStartDate)
          }}
          title="Pilih Tanggal"
          mode='date'
          locale='id'
          confirmText='Ok'
          cancelText='Batal'
        />
        <DatePicker
          modal
          open={OpenEndDate}
          date={new Date(EndDate)}
          onConfirm={(date) => {
            const TanggalPendapatan = new Date(date);
            setEndDate(moment(TanggalPendapatan).format('YYYY-MM-DD'));
            setOpenEndDate(!OpenEndDate);
            console.log(TanggalPendapatan);
          }}
          onCancel={() => {
            setOpenEndDate(!OpenEndDate)
          }}
          title="Pilih Tanggal"
          mode='date'
          locale='id'
          confirmText='Ok'
          cancelText='Batal'
        />
      <Modal
            animationType="slide"
            transparent={true}
            visible={ModalTambahPendapatan}
            onRequestClose={() => {
              setModalTambahPendapatan(!ModalTambahPendapatan);
            }}
          >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10}}>
              <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10}}>
                <TouchableOpacity onPress={()=> setModalTambahPendapatan(!ModalTambahPendapatan) } style={{position:'absolute', top:10, right:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginHorizontal:10, width:windowWidth-100}}>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Nama Pendapatan'
                      style={styles.TextInput}
                      onChangeText={JudulPendapatan => setJudulPendapatan(JudulPendapatan)}
                      defaultValue={JudulPendapatan}
                      />
                  </View>
                  
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Catatan Pendapatan'
                      style={styles.TextInput}
                      onChangeText={Catatan => setCatatan(Catatan)}
                      defaultValue={Catatan}
                      />
                  </View>
                  
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Total Pendapatan'
                      style={styles.TextInput}
                      onChangeText={TotalPendapatan => setTotalPendapatan(TotalPendapatan)}
                      defaultValue={TotalPendapatan}
                      keyboardType='number-pad'
                      />
                  </View>

                  <TouchableOpacity onPress={()=> setOpenDatePicker(!OpenDatePicker) }  style={styles.BoxInput}>
                    <View style={{marginTop:10}}>
                      <Text style={styles.TextPoppinsGrey}>{TanggalPendapatanMasuk}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=> SimpanPendapatan()} style={styles.BtnSuccess}>
                      <Text style={styles.TextBtnWhite}>Simpan Pendapatan</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </Modal>
        <View style={{marginBottom:20, width:windowWidth}}>
            {/* Top Bar */}
            <View style={styles.ColorTopBar}></View>
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <Text style={styles.TextPoppins}>Tanggal : </Text>
                    <TouchableOpacity onPress={()=> setOpenStartDate(!OpenStartDate)} style={{flex:0.5, justifyContent:'center', alignItems:'center', marginLeft:6, borderWidth:0.5, paddingTop:3, borderRadius:10}}>
                        <Text style={styles.TextPoppins}>{StartDate}</Text>
                        <View style={{borderTopWidth:1}}></View>
                    </TouchableOpacity>
                    <View style={{width:30, justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>-</Text>
                    </View>
                    <TouchableOpacity onPress={()=> setOpenEndDate(!OpenEndDate)} style={{flex:0.5, justifyContent:'center', alignItems:'center', borderWidth:0.5, paddingTop:3, borderRadius:10}}>
                        <Text style={styles.TextPoppins}>{EndDate}</Text>
                        <View style={{borderTopWidth:1}}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <View style={{backgroundColor:'white', borderRadius:10, marginHorizontal:20, paddingHorizontal:15, paddingVertical:10, width:windowWidth-20}}>
          <Text style={styles.TextPoppinsBold}>Pendapatan</Text>
          <Text style={styles.TextPoppins}>1 Juli 2022</Text>
          <View style={{borderTopWidth:0.5, borderTopColor:'grey', marginBottom:10}}></View>
          <Text style={styles.TextPoppinsBoldMedium}>Panen Jagung 1 Hektar</Text>
          <Text style={styles.TextPoppins}>Dibeli oleh bakul jagung dari Malang</Text>
          <Text style={styles.TextPoppinsBold}>Total Pendapatan</Text>
          <Text style={styles.TextPoppinsBoldGreen}>Rp 33.000.000</Text>
        </View>

        <TouchableOpacity onPress={()=> setModalTambahPendapatan(!ModalTambahPendapatan)} style={styles.TambahPendapatanBtn}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>

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

export default CatatanPendapatan

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
        backgroundColor:'white', 
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
    TextPoppinsGrey:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'grey'
    },
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
    },
    TextPoppinsBold:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black'
    },
    TextPoppinsBoldMedium:{
        fontFamily:'Poppins-Bold',
        fontSize:14,
        color:'black'
    },
    TextPoppinsBoldGreen:{
        fontFamily:'Poppins-Bold',
        fontSize:16,
        color:'#0D986A',
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
        marginTop:2,
        borderRadius:10,
        marginBottom:10
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
    TambahPendapatanBtn:{
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
    FormInput:{
        marginTop:10,
    },
    FormInputList:{
        marginTop:10,
        zIndex:10
      },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
    },
    TextInputFormList:{
        fontFamily:'Poppins-Regular',
        color:'black',
        fontSize:12
    },
    FormInputBoxList:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:0,
        paddingVertical:0,
        zIndex:10,
        paddingVertical:10,
        paddingHorizontal:10
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
    },
    BoxInput:{
      borderBottomWidth:1,
      marginBottom:10,
      flexDirection:'row',
      alignItems:'center',
    },
    TextInput:{
      fontSize:12,
      marginVertical:5,
      flex:5,
      color:'black',
      fontFamily:'Poppins-Regular'
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