import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const CekTernak = ({navigation, route}) => {

    const [ArrKandang, setArrKandang] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [IDKandang, setIDKandang] = useState('');
    const [ModalFormKandang, setModalFormKandang] = useState(false);
    const [NamaKandang, setNamaKandang] = useState('');
    const [EditDataKandangStat, setEditDataKandangStat] = useState('');

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        console.log(ParsingDataUser[0].id_user)
        if(ParsingDataUser[0].id_user){
            setIDUser(ParsingDataUser[0].id_user);
        }
        } catch(e) {
        // error reading value
        }
      }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        GetDaftarKandang();
    }, [isFocused, IDUser]);

    const KandangDetail = (id_kandang, data) =>{
      if(data == 'Ternak'){
        navigation.navigate('DataTernak', {id_kandang:id_kandang});
      }else{
        console.log('IoT Kandang')
      }
    }

    const EditDataKandang = (id_kandang , nama) => {
      setEditDataKandangStat(true);
      setIDKandang(id_kandang);
      setNamaKandang(nama);
      setModalFormKandang(true);
    }

    const Item = ({nomor_urut, id_kandang, id_user, nama, jumlah_ternak, created, updated }) => (
        <TouchableOpacity onPress={()=>EditDataKandang(id_kandang, nama)} style={styles.CardListKandang}>
          <View style={{flexDirection:'row'}}>
            <View style={{justifyContent:'center', marginRight:10}}>
              <Text style={styles.TextPoppinsBold}>{nomor_urut}</Text>
            </View>
            <View style={{height:'100%', borderLeftWidth:0.5}}></View>
            <View style={{marginLeft:10, flex:1}}>
              <Text style={styles.TextPoppinsBold}>{nama}</Text>
              <Text style={styles.TextPoppins}>Jumlah Ternak : {jumlah_ternak} ekor</Text>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>KandangDetail(id_kandang, 'Kendali')} style={styles.BtnSuccess}>
                  <Text style={styles.TextPoppinsBtn}>Kendali</Text>
                </TouchableOpacity>
                <View style={{marginHorizontal:5}}></View>
                <TouchableOpacity onPress={()=>KandangDetail(id_kandang, 'Ternak')} style={styles.BtnSuccess}>
                  <Text style={styles.TextPoppinsBtn}>Ternak</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    
    const renderItem = ({ item }) => <Item nomor_urut={item.nomor_urut} id_kandang={item.id_kandang} id_user={item.id_user} nama={item.nama} jumlah_ternak={item.jumlah_ternak} created={item.created} updated={item.updated} />;

    const GetDaftarKandang = async () => {
      await axios.get('https://alicestech.com/kelasbertani/api/kandang', {
          params:{
          id_user:IDUser,
          }
      })
      .then(response => {
          console.log('Daftar Kandang :')
          console.log(response.data)
          if(response.data.status == true){
            setArrKandang(response.data.result);
          }
      })
      .catch(e => {
          if (e.response.status === 404) {
          console.log(e.response.data)
          }
      });
    }

    const TambahKandang = () => {
      console.log('Tambah Kandang')
      setModalFormKandang(!ModalFormKandang)
    }
    
    const TutupModalFormKandang = () => {
      setModalFormKandang(!ModalFormKandang)
      setEditDataKandangStat(!EditDataKandangStat);
      setNamaKandang('');
    }
    
    const SimpanTambahKandang = async () => {
      console.log('Simpan Kandang')
      const ParameterUrl = { 
        id_user:IDUser,
        nama:NamaKandang,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/kandang', ParameterUrl)
      .then(response => {
        console.log('Order Status :')
        console.log(response.data)
        if(response.data.status == true){
          setModalFormKandang(!ModalFormKandang)
          GetDaftarKandang();
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
      });
    }
    
    const SimpanPerubahanKandang = async () => {
      console.log('Ubah Kandang')
      const ParameterUrl = { 
        id_kandang:IDKandang,
        nama:NamaKandang,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/kandang/update', ParameterUrl)
      .then(response => {
        console.log('Order Status :')
        console.log(response.data)
        if(response.data.status == true){
          setModalFormKandang(!ModalFormKandang)
          GetDaftarKandang();
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center'}}>
      {/* Modal Tambah Kandang */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ModalFormKandang}
        onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalFormKandang(!ModalFormKandang);
        }}
        >
        <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20}}>
              <TouchableOpacity onPress={()=> TutupModalFormKandang()} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
              </TouchableOpacity>
              <View style={{marginBottom:10}}></View>
              <Text style={styles.TextPoppinsBold}>Berikan Nama Kandang Anda</Text>
              <View style={styles.FormInput}>
                  <View style={styles.FormInputBox}>
                      <TextInput 
                      style={styles.TextInputForm} 
                      onChangeText={NamaKandang => setNamaKandang(NamaKandang)}
                      defaultValue={NamaKandang}
                      placeholder='Nama Kandang'
                      />
                  </View>
              </View>
              <View style={{marginBottom:10}}></View>
              {EditDataKandangStat != true ? 
              <View>
                  <View style={{marginBottom:10}}></View>
                  <TouchableOpacity onPress={()=>SimpanTambahKandang()} style={styles.BtnPrimary}>
                      <Text style={styles.TextPoppinsBtn}>Simpan Kandang</Text>
                  </TouchableOpacity>
              </View>
              :
              <View>
                  <View style={{marginBottom:10}}></View>
                  <TouchableOpacity onPress={()=>SimpanPerubahanKandang()} style={styles.BtnPrimary}>
                      <Text style={styles.TextPoppinsBtn}>Ubah Data Kandang</Text>
                  </TouchableOpacity>
              </View>
              }
            </View>
        </View>
      </Modal>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Kandang</Text>
                </View>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
          {ArrKandang != ''? 
            <FlatList style={{marginHorizontal:10}} data={ArrKandang} renderItem={renderItem} keyExtractor={item => item.id_kandang} scrollEnabled={true} />:
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={styles.TextPoppins}>Data Kandang Kosong!</Text>
            </View>
          }
        </View>
        <TouchableOpacity style={styles.ScanTernak} onPress={()=>navigation.navigate('QRScannerTernak')}>
            <AntDesign name="qrcode" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.TambahKandangBtn} onPress={()=>TambahKandang()}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CekTernak

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                flex:1
            },
            android:{
                flex:1
            }
        }),
        width:windowWidth, 
        backgroundColor:'white',
    },
    TopBarBox:{
        width:'100%', 
        alignItems:'flex-start', 
        flexDirection:'row',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        backgroundColor:'white',
        height:50,
        marginBottom:5
    },
    TopBarText:{
        fontFamily: 'Poppins-Bold',
        marginLeft:10,
        paddingHorizontal:20 
    },
    TextPoppins:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'black'
    },
    TextPoppinsBold:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black'
    },
    CardListKandang:{
        width:windowWidth-40,
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
        marginHorizontal:10,
    },
    TambahKandangBtn:{
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
  ScanTernak:{
      width:50,
      height:50,
      borderRadius:50/2,
      backgroundColor:'#296E85',
      justifyContent:'center',
      alignItems:'center',
      position:'absolute',
      bottom:90,
      right:20
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
  TextInputForm:{
    fontFamily:'Poppins-Regular',
    color:'black',
    fontSize:12
  },
  BtnPrimary: {
    paddingVertical:8,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    borderRadius:10,
    backgroundColor:'green'
  },
  BtnSuccess: {
    paddingVertical:8,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    borderRadius:10,
    backgroundColor:'green'
  },
  BtnWarning: {
    paddingVertical:8,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    borderRadius:10,
    backgroundColor:'orange'
  },
  TextPoppinsBtn:{
    fontFamily:'Poppins-Bold',
    fontSize:12,
    color:'white',
  },
})