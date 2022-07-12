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
import {
  formatCurrency,
  getSupportedCurrencies,
} from "react-native-format-currency";

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
    const [ModalEditPendapatan, setModalEditPendapatan] = useState(false);
    const [JudulPendapatan, setJudulPendapatan] = useState('');
    const [Catatan, setCatatan] = useState('');
    const [TotalPendapatan, setTotalPendapatan] = useState('');
    const [TanggalPendapatanMasuk, setTanggalPendapatanMasuk] = useState('Tanggal Pendapatan Masuk');
    const [IDPendapatanEdit, setIDPendapatanEdit] = useState('');
    const [JudulPendapatanEdit, setJudulPendapatanEdit] = useState('');
    const [CatatanEdit, setCatatanEdit] = useState('');
    const [TotalPendapatanEdit, setTotalPendapatanEdit] = useState('');
    const [TanggalPendapatanMasukEdit, setTanggalPendapatanMasukEdit] = useState('Tanggal Pendapatan Masuk');
    const [OpenDatePicker, setOpenDatePicker] = useState(false);
    const [OpenDatePickerEdit, setOpenDatePickerEdit] = useState(false);
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
              setArrayListPendapatan(response.data.result)
            })
            .catch(e => {
              if (e.response.status === 404) {
                console.log(e.response.data)
                setArrayListPendapatan([]);
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
          GetDataPendapatan(StartDate, EndDate);
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

    const EditPendapatanModal = (id_pendapatan, judul, catatan, total, tanggal) => {
      setIDPendapatanEdit(id_pendapatan);
      setJudulPendapatanEdit(judul);
      setCatatanEdit(catatan);
      setTotalPendapatanEdit(total);
      setTanggalPendapatanMasukEdit(tanggal);
      setModalEditPendapatan(!ModalEditPendapatan);
    }

    const SimpanEditPendapatan = async () => {
      const ParameterUrl = { 
        id_pendapatan: IDPendapatanEdit,
        judul: JudulPendapatanEdit,
        catatan: CatatanEdit,
        total: TotalPendapatanEdit,
        tanggal: TanggalPendapatanMasukEdit,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/pendapatan/edit', ParameterUrl)
      .then(response => {
        console.log(response.data)
        if(response.data.status == true){
          GetDataPendapatan(StartDate, EndDate);
          Alert.alert('Berhasil', 'Pendapatan telah diubah',[
            {
              text: "Batal",
              onPress: () => console.log("Batal"),
              style: "cancel"
            },
            { text: "Ok", onPress: () => setModalEditPendapatan(!ModalEditPendapatan) }
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

    const HapusPendapatan = () =>{
      Alert.alert('Apakah Anda Yakin?', 'Hapus Data Pendapatan',[
        {
          text: "Batal",
          onPress: () => console.log("Batal"),
          style: "cancel"
        },
        { text: "Iya", onPress: async () => {
          await axios.get('https://alicestech.com/kelasbertani/api/pendapatan/hapus', {
              params: {
                id_pendapatan: IDPendapatanEdit,
              }
            })
            .then(response => {
              console.log(response.data.result)
              GetDataPendapatan(StartDate, EndDate);
              setModalEditPendapatan(!ModalEditPendapatan);
            })
            .catch(e => {
              if (e.response.status === 404) {
                console.log(e.response.data)
              }
          });
        } }
      ]);
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        console.log('Start Date: ' + moment(StartDate).format('YYYY-MM-DD'))
        var newDate = moment(StartDate, "YYYY-MM-DD").subtract(3, 'months');
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

      const Item = ({ id_pendapatan, id_user, judul, catatan, total, total_format, tanggal}) =>
      (
        <TouchableOpacity onPress={()=>EditPendapatanModal(id_pendapatan, judul, catatan, total, tanggal)} style={{backgroundColor:'white', borderRadius:10, marginHorizontal:20, paddingHorizontal:15, paddingVertical:10, width:windowWidth-40, marginBottom:10}}>
          <Text style={styles.TextPoppinsBold}>Pendapatan</Text>
          <Text style={styles.TextPoppins}>{moment(tanggal).format('D MMM YYYY')}</Text>
          <View style={{borderTopWidth:0.5, borderTopColor:'grey', marginBottom:10}}></View>
          <Text style={styles.TextPoppinsBoldMedium}>{judul}</Text>
          <Text style={styles.TextPoppins}>{catatan}</Text>
          <Text style={styles.TextPoppinsBold}>Total Pendapatan</Text>
          <Text style={styles.TextPoppinsBoldGreen}>{total_format}</Text>
        </TouchableOpacity>
      );

    const renderItem = ({ item }) => <Item id_pendapatan={item.id_pendapatan} id_user={item.id_user} judul={item.judul} catatan={item.catatan} total={item.total} total_format={item.total_format} tanggal={item.tanggal} />;

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
            GetDataPendapatan(moment(TanggalPendapatan).format('YYYY-MM-DD'), EndDate)
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
            GetDataPendapatan(StartDate, moment(TanggalPendapatan).format('YYYY-MM-DD'))
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
         <DatePicker
          modal
          open={OpenDatePickerEdit}
          date={new Date(StartDate)}
          onConfirm={(date) => {
            const TanggalPendapatanEdit = new Date(date);
            setTanggalPendapatanMasukEdit(moment(TanggalPendapatanEdit).format('YYYY-MM-DD'));
            setOpenDatePickerEdit(!OpenDatePickerEdit);
          }}
          onCancel={() => {
            setOpenDatePickerEdit(!OpenDatePickerEdit);
          }}
          title="Pilih Tanggal"
          mode='date'
          locale='id'
          confirmText='Ok'
          cancelText='Batal'
        />
        {/* Modal Tambah Pendapatan */}
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
        {/* Modal Edit Pendapatan */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={ModalEditPendapatan}
            onRequestClose={() => {
              setModalEditPendapatan(!ModalEditPendapatan);
            }}
          >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10}}>
              <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10}}>
                <TouchableOpacity onPress={()=> setModalEditPendapatan(!ModalEditPendapatan) } style={{position:'absolute', top:10, right:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginHorizontal:10, width:windowWidth-100}}>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Nama Pendapatan'
                      style={styles.TextInput}
                      onChangeText={JudulPendapatanEdit => setJudulPendapatanEdit(JudulPendapatanEdit)}
                      defaultValue={JudulPendapatanEdit}
                      />
                  </View>
                  
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Catatan Pendapatan'
                      style={styles.TextInput}
                      onChangeText={CatatanEdit => setCatatanEdit(CatatanEdit)}
                      defaultValue={CatatanEdit}
                      />
                  </View>
                  
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Total Pendapatan'
                      style={styles.TextInput}
                      onChangeText={TotalPendapatanEdit => setTotalPendapatanEdit(TotalPendapatanEdit)}
                      defaultValue={TotalPendapatanEdit}
                      keyboardType='number-pad'
                      />
                  </View>

                  <TouchableOpacity onPress={()=> setOpenDatePickerEdit(!OpenDatePickerEdit) }  style={styles.BoxInput}>
                    <View style={{marginTop:10}}>
                      <Text style={styles.TextPoppinsGrey}>{TanggalPendapatanMasukEdit}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=> SimpanEditPendapatan()} style={styles.BtnSuccess}>
                      <Text style={styles.TextBtnWhite}>Ubah Pendapatan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> HapusPendapatan()} style={styles.BtnDanger}>
                      <Text style={styles.TextBtnWhite}>Hapus Pendapatan</Text>
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
                    <TouchableOpacity onPress={()=> setOpenEndDate(!OpenEndDate)} style={{flex:0.5, justifyContent:'center', alignItems:'center', marginLeft:6, borderWidth:0.5, paddingTop:3, borderRadius:10}}>
                        <Text style={styles.TextPoppinsKecil}>{moment(EndDate).format('D MMM YYYY')}</Text>
                        <View style={{borderTopWidth:1}}></View>
                    </TouchableOpacity>
                    <View style={{width:30, justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.TextPoppins}>-</Text>
                    </View>
                    <TouchableOpacity onPress={()=> setOpenStartDate(!OpenStartDate)} style={{flex:0.5, justifyContent:'center', alignItems:'center', borderWidth:0.5, paddingTop:3, borderRadius:10}}>
                        <Text style={styles.TextPoppinsKecil}>{moment(StartDate).format('D MMM YYYY')}</Text>
                        <View style={{borderTopWidth:1}}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <View style={{flex:1}}>
          <FlatList data={ArrayListPendapatan} renderItem={renderItem} keyExtractor={item => item.id_pendapatan} scrollEnabled={true} />
        </View>

        <TouchableOpacity onPress={()=> setModalTambahPendapatan(!ModalTambahPendapatan)} style={styles.TambahPendapatanBtn}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
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
            marginTop:10
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
        bottom:30,
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
  BtnDanger:{
    backgroundColor:'#d34539',
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius:10,
    alignItems:'center',
    marginTop:10
  },
  TextBtnWhite:{
    fontFamily:'Poppins-Bold',
    fontSize:12,
    color:'white',
  },
})