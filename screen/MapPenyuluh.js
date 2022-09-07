import { StyleSheet, Text, View, Modal, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import axios from 'axios';

import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons'; 

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const MapPenyuluh = ({navigation, route}) => {
  const [NamaUser, setNamaUser] = useState('');
  const [IDUser, setIDUser] = useState('');
  const [Role, setRole] = useState('');
  const [Email, setEmail] = useState('');
  const [ModalPilihPemesan, setModalPilihPemesan] = useState(false);
  const [ModalDaftarOrder, setModalDaftarOrder] = useState(false);
  const [TitleStatusOrderModal, setTitleStatusOrderModal] = useState('');
  const [IDUserPemesan, setIDUserPemesan] = useState('');
  const [NamaPemesan, setNamaPemesan] = useState('');
  const [AddressFull, setAddressFull] = useState('');
  const [LatitudePenyuluh, setLatitudePenyuluh] = useState('');
  const [LongitudePenyuluh, setLongitudePenyuluh] = useState('');
  const [IDOrder, setIDOrder] = useState('');
  const [ArrOrderStatus, setArrOrderStatus] = useState([]);

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    console.log(jsonValue)
    console.log(ParsingDataUser[0].id_user)
    if(ParsingDataUser[0].id_user){
        setNamaUser(ParsingDataUser[0].nama);
        setEmail(ParsingDataUser[0].email);
        setIDUser(ParsingDataUser[0].id_user);
        setIDUser(ParsingDataUser[0].id_user);
        setRole(ParsingDataUser[0].role);
    }
    } catch(e) {
    // error reading value
    }
  }

  const CekLokasi = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // console.log(location.coords);
      // setAltitude(location.coords.altitude);

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setLatitudePenyuluh(latitude);
      setLongitudePenyuluh(longitude);
      
      let GeoCodingData = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      console.log(GeoCodingData);
  }

  const ActionStatus = (id_order) => {
    if(TitleStatusOrderModal == 'Berjalan'){
      navigation.navigate('MapTrackingPemesan', {id_order:id_order})
    }
    if(TitleStatusOrderModal == 'Selesai'){
      navigation.navigate('LaporanPenyuluh', {id_order:id_order})
    }
  }

  const Item = ({ id_order, id_user_pemesan, id_user_penyuluh, alamat_tujuan, nama_penyuluh, photo_penyuluh, nama_pemesan, created }) => (
    <TouchableOpacity onPress={()=>ActionStatus(id_order)} style={styles.CardListOrder}>
        <Text style={styles.TextPoppins}>Pemesanan Penyuluh Oleh:</Text>
        <Text style={styles.TextPoppinsBold}>{nama_pemesan}</Text>
        <Text style={styles.TextPoppins}>{alamat_tujuan}</Text>
        <Text style={styles.TextPoppins}>ID Order: {id_order}{id_user_pemesan}{id_user_penyuluh}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => <Item id_order={item.id_order} id_user_pemesan={item.id_user_pemesan} id_user_penyuluh={item.id_user_penyuluh} alamat_tujuan={item.alamat_tujuan} nama_penyuluh={item.nama_penyuluh} photo_penyuluh={item.photo_penyuluh} nama_pemesan={item.nama_pemesan} created={item.created} />;

  const GetStatusOrder = async (StatusOrder) => {
    await axios.get('https://alicestech.com/kelasbertani/api/order_penyuluh/list_order', {
      params:{
        id_user_penyuluh:IDUser,
        status:StatusOrder,
      }
    })
    .then(response => {
      console.log('Order Status :')
      console.log(response.data)
      if(response.data.status == true){
        setArrOrderStatus(response.data.result);
        setTitleStatusOrderModal(StatusOrder);
        setModalDaftarOrder(!ModalDaftarOrder);
      }
    })
    .catch(e => {
      if (e.response.status === 404) {
        console.log(e.response.data)
      }
    });
  }

  const OlahPesanWeb = (event) => {
    console.log(event.nativeEvent.data);
    const DataPemesan = JSON.parse(event.nativeEvent.data);
    console.log('Jenis Data: ' + DataPemesan.data)
    if(DataPemesan.data == 'pemesan'){
      console.log('Nama Penyuluh : ' + DataPemesan.nama_pemesan);
      console.log('IDUser Penyuluh : ' + DataPemesan.id_user_pemesan);
      setNamaPemesan(DataPemesan.nama_pemesan);
      setIDUserPemesan(DataPemesan.nama_pemesan);
      setAddressFull(DataPemesan.alamat);
      setIDOrder(DataPemesan.id_order);
      setModalPilihPemesan(!ModalPilihPemesan);
    }
  }

  const TerimaPesanan = async () => {
    const ParameterUrl = { 
      id_order:IDOrder,
      status:'Berjalan',
      lat_penyuluh:LatitudePenyuluh,
      long_penyuluh:LongitudePenyuluh,
    }
    console.log(ParameterUrl)
    await axios.post('https://alicestech.com/kelasbertani/api/order_penyuluh/update', ParameterUrl)
    .then(response => {
      console.log('Order Status :')
      console.log(response.data)
      if(response.data.status == true){
        setModalPilihPemesan(!ModalPilihPemesan);
        navigation.navigate('MapTrackingPenyuluh', {id_order:IDOrder});
        // Status Pesanan sudah berubah menjadi Berjalan, tinggal diarahkan ke halaman map yang menampilkan lokasi pemesan dan penyuluh yg update realtime, dengan tombol ubah pesan menjadi telah sampai dilokasi, dilanjutkan dengan upload foto kegiatan dan pemberian rating kemudian diarahkan ke halaman histori pemesanan
      }
    })
    .catch(e => {
      if (e.response.status === 404) {
        console.log(e.response.data)
      }
    });
  }


  const isFocused = useIsFocused();
  useEffect(() => {
    LihatDataUser();
    CekLokasi();
  }, [isFocused, IDUser])

  let [fontsLoaded] = useFonts({
    'Philosopher': require('../assets/fonts/Philosopher-Regular.ttf'),
    'Philosopher-Bold': require('../assets/fonts/Philosopher-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const Tampilan = () => {
    if(Email != ''){
      return (
        <View style={{flex:1}}>
          {/* Modal Permintaan Penyuluh */}
          <Modal
          animationType="fade"
          transparent={true}
          visible={ModalPilihPemesan}
          onRequestClose={() => {
            setModalPilihPemesan(!ModalPilihPemesan);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, width:windowWidth, alignItems:'center', justifyContent:'center'}}>
                    <View>
                      <Text style={styles.TextPoppins}>Apakah Anda yakin Menerima Pesanan Dari {NamaPemesan}?</Text>
                    </View>
                    <View style={{marginVertical:5}}></View>
                    <TouchableOpacity onPress={()=>TerimaPesanan()} style={styles.BtnPrimary}>
                      <Text style={styles.TextPoppinsBtn}>Terima Pesanan</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.TextPoppins}>Alamat Tujuan : {AddressFull}</Text>
                    </View>
                    <View style={{marginVertical:5}}>
                    </View>
                    <TouchableOpacity onPress={()=>setModalPilihPemesan(!ModalPilihPemesan)} style={styles.BtnWarning}>
                      <Text style={styles.TextPoppinsBtn}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </Modal>

          {/* Modal Daftar Order */}
          <Modal
          animationType="fade"
          transparent={true}
          visible={ModalDaftarOrder}
          onRequestClose={() => {
            setModalDaftarOrder(!ModalDaftarOrder);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                <View style={{paddingHorizontal:10, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, width:windowWidth, alignItems:'center', justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=> setModalDaftarOrder(!ModalDaftarOrder)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                      <SimpleLineIcons name="close" size={20} color="black" />
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.TextPoppins}>Order Status : {TitleStatusOrderModal}</Text>
                    </View>

                    <FlatList data={ArrOrderStatus} renderItem={renderItem} keyExtractor={item => item.id_order} />
                    
                </View>
            </View>
          </Modal>
          <WebView 
            style={styles.container}
            source={{ uri: 'https://alicestech.com/geptan/api/auto_login?email='+Email+'&nama='+NamaUser+'&role='+Role+'&go_penyuluh='+true+'&id_user_penyuluh='+IDUser}}
            onMessage={(event)=> OlahPesanWeb(event)}
          />
          <View style={styles.TabModalStatus}>
              <TouchableOpacity onPress={()=> GetStatusOrder('Berjalan')} style={styles.TabValuesBox}>
                <Text style={styles.TextPoppins}>Berjalan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> GetStatusOrder('Selesai')} style={styles.TabValuesBox}>
                <Text style={styles.TextPoppins}>Selesai</Text>
              </TouchableOpacity>
          </View>
        </View>
      )
    }else{
      return <View></View>
    }
  }

  return (
    Tampilan()
  )
}

export default MapPenyuluh

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    BtnPrimary: {
      paddingVertical:8,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      borderRadius:10,
      backgroundColor:'blue'
    },
    BtnWarning: {
      paddingVertical:8,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      borderRadius:10,
      backgroundColor:'orange'
    },
    TextPoppins:{
      fontFamily:'Poppins-Regular',
      fontSize:12,
      color:'black',
    },
    TextPoppinsBtn:{
      fontFamily:'Poppins-Bold',
      fontSize:12,
      color:'white',
    },
    TextPoppinsBold:{
      fontFamily:'Poppins-Bold',
      fontSize:12,
      color:'black',
    },
    TabModalStatus:{
      position:'absolute',
      bottom:0,
      left:0,
      backgroundColor:'white',
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
      paddingVertical:10,
      flexDirection:'row'
    },
    TabValuesBox:{
      flex:1,
      marginHorizontal:10,
      alignItems:'center',
      justifyContent:'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor:'white',
      borderRadius:10,
      paddingVertical:5
    },
    CardListOrder:{
      width:windowWidth-50,
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
})