import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal, TextInput, Alert} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Card, Avatar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import PushNotification, {Importance} from "react-native-push-notification";

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import axios from 'axios';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ],
  monthNamesShort: ['Jan', 'Feb.', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sept', 'Okt', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: "Hari ini"
};
LocaleConfig.defaultLocale = 'id';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const AgendaKegiatanTani = ({navigation}) => {
  const [items, setItems] = useState({});
  const [ItemAgenda, setItemAgenda] = useState({});
  const [PhotoAvatar, setPhotoAvatar] = useState('');
  const [IDUser, setIDUser] = useState('');
  const [IDAgenda, setIDAgenda] = useState('');
  const [TanggalAgenda, setTanggalAgenda] = useState('');
  const [ModalAgenda, setModalAgenda] = useState(false);
  const [ModalEditAgenda, setModalEditAgenda] = useState(false);
  const [JudulRencanaKegiatan, setJudulRencanaKegiatan] = useState('');
  const [UraianRencanaKegiatan, setUraianRencanaKegiatan] = useState('');
  const [date, setDate] = useState(new Date());
  const [JamAgenda, setJamAgenda] = useState('');
  const [OpenTimePicker, setOpenTimePicker] = useState(false);
  const [DataAgenda, setDataAgenda] = useState(false);

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    // console.log(jsonValue)
    if(ParsingDataUser[0].id_user){
      setIDUser(ParsingDataUser[0].id_user);
      setPhotoAvatar(ParsingDataUser[0].photo);
      // console.log(ParsingDataUser[0].photo);
      GetDataAgenda(ParsingDataUser[0].id_user);
    } 
    } catch(e) {
    // error reading value
    }
  }

  //Jadwal Notifikasi
  const BuatJadwalNotifikasi = (tanggal, judul, jam) => {
    console.log('Buat Jadwal Lokal Notifikasi');
    // console.log('tanggal notifikasi : ' + tanggal);
    PushNotification.localNotificationSchedule({
      message: "Hai, Anda memiliki agenda " + judul + ' pukul ' + jam + ", jangan sampai lupa dikerjakan ya, tetap semangat!", 
      date: tanggal,
      allowWhileIdle: true, 
      repeatTime: 1,
    });
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    LihatDataUser();
  }, [isFocused, PhotoAvatar])
  

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              // height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const CekTanggal = (item) => {
    // console.log(item);
    setJudulRencanaKegiatan(item.judul);
    setUraianRencanaKegiatan(item.uraian);
    setTanggalAgenda(item.tanggal);
    setJamAgenda(item.jam);
    setIDAgenda(item.id_agenda);
    setModalEditAgenda(!ModalEditAgenda);
  }

  const renderItem = (item) => {
      return (
        <TouchableOpacity onLongPress={()=>CekTanggal(item)} style={{marginRight: 10, marginTop: 17}}>
          <Card>
            <Card.Content>
              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:3}}>
                      <Text style={styles.TextPoppins}>{item.judul} - {item.jam.replace(':00', '')}</Text>
                      <Text style={styles.TextPoppins}>{item.uraian}</Text>
                    </View>
                      {PhotoAvatar != '' ? 
                        <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                            <Avatar.Image size={30} source={{uri:'https://alicestech.com/kelasbertani/upload/profile/'+PhotoAvatar}} />
                        </View>
                        : <View></View>
                      }
                  </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
  };

  const SimpanAgenda = async () => {
    const ParameterUrl = { 
      id_user: IDUser,
      judul: JudulRencanaKegiatan,
      uraian: UraianRencanaKegiatan,
      tanggal: TanggalAgenda,
      jam: JamAgenda
    }
    console.log(ParameterUrl)
    await axios.post('https://alicestech.com/kelasbertani/api/agenda', ParameterUrl)
    .then(response => {
      console.log(response.data)
      if(response.data.status == true){
        var tanggalJamNotifikasi = TanggalAgenda + ' ' + JamAgenda;
        var TanggalJamMoment = moment(tanggalJamNotifikasi, 'YYYY/MM/DD HH:mm').format();
        BuatJadwalNotifikasi(new Date(TanggalJamMoment), JudulRencanaKegiatan, JamAgenda);
        GetDataAgenda(IDUser);
        Alert.alert('Berhasil', 'Agenda Anda Berhasil Dibuat',[
          {
            text: "Batal",
            onPress: () => console.log("Batal"),
            style: "cancel"
          },
          { text: "Ok", onPress: () => setModalAgenda(!ModalAgenda) }
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

  const SimpanEditAgenda = async () => {
    const ParameterUrl = { 
      id_agenda: IDAgenda,
      judul: JudulRencanaKegiatan,
      uraian: UraianRencanaKegiatan,
      tanggal: TanggalAgenda,
      jam: JamAgenda
    }
    console.log(ParameterUrl)
    await axios.post('https://alicestech.com/kelasbertani/api/agenda/edit', ParameterUrl)
    .then(response => {
      console.log(response.data)
      if(response.data.status == true){
        var tanggalJamNotifikasi = TanggalAgenda + ' ' + JamAgenda;
        var TanggalJamMoment = moment(tanggalJamNotifikasi, 'YYYY/MM/DD HH:mm').format();
        BuatJadwalNotifikasi(new Date(TanggalJamMoment), JudulRencanaKegiatan, JamAgenda);
        GetDataAgenda(IDUser);
        Alert.alert('Berhasil', 'Agenda Anda Berhasil Diubah',[
          {
            text: "Batal",
            onPress: () => console.log("Batal"),
            style: "cancel"
          },
          { text: "Ok", onPress: () => setModalEditAgenda(!ModalEditAgenda) }
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

  const GetDataAgenda = async (id_user) => {
    console.log('ID User : '+ id_user)
    await axios.get('https://alicestech.com/kelasbertani/api/agenda', {
        params: {
          id_user: id_user,
        }
      })
      .then(response => {
        console.log(response.data.result)
        setItemAgenda(response.data.result)
        setDataAgenda(true);
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
    });
  }
  
  const HapusAgenda = async () => {
    console.log('Hapus Agenda : '+ IDAgenda)
    await axios.get('https://alicestech.com/kelasbertani/api/agenda/hapus', {
        params: {
          id_agenda: IDAgenda,
        }
      })
      .then(response => {
        console.log(response.data)
        if(response.data.status == true){
          GetDataAgenda(IDUser);
          setModalEditAgenda(!ModalEditAgenda);
        }else{
          Alert.alert("Gagal", "Agenda Tidak Terhapus");
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
    });
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
    <View style={{flex: 1}}>
      <View style={{flex:1, marginBottom:65}}>
        <DatePicker
          modal
          open={OpenTimePicker}
          date={date}
          onConfirm={(date) => {
            setOpenTimePicker(!OpenTimePicker)
            setJamAgenda(moment(date).format('h:mm'))
            console.log(moment(date).format('h:mm'))
          }}
          onCancel={() => {
            setOpenTimePicker(!OpenTimePicker)
          }}
          title="Tentukan Waktu"
          mode='time'
          locale='id'
          confirmText='Ok'
          cancelText='Batal'
        />
        {/* Modal Tambah Agenda */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={ModalAgenda}
            onRequestClose={() => {
              setModalAgenda(!ModalAgenda);
            }}
          >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
              <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10}}>
                <TouchableOpacity onPress={()=> setModalAgenda(!ModalAgenda) } style={{position:'absolute', top:10, right:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginHorizontal:10, width:windowWidth-100}}>
                  <View style={{marginTop:10, marginBottom:10}}>
                    <Text style={styles.TextPoppins}>Apa yang akan anda kerjakan di tanggal {moment(TanggalAgenda).format('LL')}?</Text>
                  </View>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Judul Kegiatan'
                      style={styles.TextInput}
                      onChangeText={JudulRencanaKegiatan => setJudulRencanaKegiatan(JudulRencanaKegiatan)}
                      defaultValue={JudulRencanaKegiatan}
                      />
                  </View>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Uraian Kegiatan'
                      style={styles.TextInput}
                      onChangeText={UraianRencanaKegiatan => setUraianRencanaKegiatan(UraianRencanaKegiatan)}
                      defaultValue={UraianRencanaKegiatan}
                      multiline = {true}
                      numberOfLines = {4}
                      />
                  </View>
                  <View style={{marginTop:15}}>
                    <TouchableOpacity onPress={()=>setOpenTimePicker(!OpenTimePicker)} style={styles.BoxInput}>
                        <Text style={styles.TextPoppinsGrey}>Waktu Dimulai Kegiatan {JamAgenda}</Text>
                    </TouchableOpacity>

                  </View>

                  <TouchableOpacity onPress={()=> SimpanAgenda()} style={styles.BtnSuccess}>
                      <Text style={styles.TextBtnWhite}>Simpan Kegiatan</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </Modal>
        {/* Modal Edit Agenda */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={ModalEditAgenda}
            onRequestClose={() => {
              setModalEditAgenda(!ModalEditAgenda);
            }}
          >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
              <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10}}>
                <TouchableOpacity onPress={()=> setModalEditAgenda(!ModalEditAgenda) } style={{position:'absolute', top:10, right:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginHorizontal:10, width:windowWidth-100}}>
                  <View style={{marginTop:10, marginBottom:10}}>
                    <Text style={styles.TextPoppins}>Buat perubahan agenda di tanggal {moment(TanggalAgenda).format('LL')}?</Text>
                  </View>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Judul Kegiatan'
                      style={styles.TextInput}
                      onChangeText={JudulRencanaKegiatan => setJudulRencanaKegiatan(JudulRencanaKegiatan)}
                      defaultValue={JudulRencanaKegiatan}
                      />
                  </View>
                  <View style={styles.BoxInput}>
                      <TextInput 
                      placeholder='Uraian Kegiatan'
                      style={styles.TextInput}
                      onChangeText={UraianRencanaKegiatan => setUraianRencanaKegiatan(UraianRencanaKegiatan)}
                      defaultValue={UraianRencanaKegiatan}
                      multiline = {true}
                      numberOfLines = {4}
                      />
                  </View>
                  <View style={{marginTop:15}}>
                    <TouchableOpacity onPress={()=>setOpenTimePicker(!OpenTimePicker)} style={styles.BoxInput}>
                        <Text style={styles.TextPoppinsGrey}>Waktu Dimulai Kegiatan {JamAgenda}</Text>
                    </TouchableOpacity>

                  </View>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1, marginHorizontal:5}}>
                      <TouchableOpacity onPress={()=> HapusAgenda()} style={styles.BtnDanger}>
                          <Text style={styles.TextBtnWhite}>Hapus</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex:1, marginHorizontal:5}}>
                      <TouchableOpacity onPress={()=> SimpanEditAgenda()} style={styles.BtnSuccess}>
                          <Text style={styles.TextBtnWhite}>Simpan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
          </View>
        </Modal>
        {DataAgenda == true ? 
        <Agenda
          items={ItemAgenda}
          loadItemsForMonth={loadItems}
          selected={moment(new Date()).format('YYYY-MM-DD')}
          renderItem={renderItem}
          onDayLongPress={day => {
            // console.log(day.dateString);
            setTanggalAgenda(day.dateString);
            setJudulRencanaKegiatan('');
            setUraianRencanaKegiatan('');
            setJamAgenda('');
            setModalAgenda(!ModalAgenda);
          }}
        />
        :<View></View>
        }
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
    </View>
  );
};

export default AgendaKegiatanTani;

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
  TextPoppinsGrey:{
      fontFamily:'Poppins-Regular',
      fontSize:12,
      color:'grey',
      marginBottom:10
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
})