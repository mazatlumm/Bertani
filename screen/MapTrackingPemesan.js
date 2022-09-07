import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const MapTrackingPemesan = ({navigation, route}) => {

  const [NamaUser, setNamaUser] = useState('');
  const [Email, setEmail] = useState('');
  const [Role, setRole] = useState('');
  const [IDOrder, setIDOrder] = useState('');
  const [ModalKirimPesan, setModalKirimPesan] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    LihatDataUser()
    AmbilDataRoute();
  }, [isFocused, IDOrder])

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            setIDOrder(route.params.id_order);
            console.log('id_order : ' + route.params.id_order)
        }
    }

  const LihatDataUser =  async() => {
    try {
    const jsonValue = await AsyncStorage.getItem('@DataUser')
    const ParsingDataUser = JSON.parse(jsonValue);
    console.log(jsonValue)
    console.log(ParsingDataUser[0].id_user)
    if(ParsingDataUser[0].id_user){
        setNamaUser(ParsingDataUser[0].nama);
        setEmail(ParsingDataUser[0].email);
        setRole(ParsingDataUser[0].role);
    }
    } catch(e) {
    // error reading value
    }
  }

  const OlahPesanWeb = (event) => {
    console.log(event.nativeEvent.data);
    const DataPemesan = JSON.parse(event.nativeEvent.data);
    console.log('Jenis Data: ' + DataPemesan.data)
    if(DataPemesan.data == 'kirim_pesan'){
      console.log('id_user_pemesan : ' + DataPemesan.id_user_pemesan);
      console.log('id_user_penyuluh : ' + DataPemesan.id_user_penyuluh);
      console.log('id_order : ' + DataPemesan.id_order);
      setModalKirimPesan(!ModalKirimPesan);
    }
  }

  const SudahSampai = async () => {
    const ParameterUrl = { 
        id_order:IDOrder,
        pesan:'Kedatangan Penyuluh Terverifikasi'
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/order_penyuluh/pesan', ParameterUrl)
      .then(response => {
        console.log('Order Status :')
        console.log(response.data)
        if(response.data.status == true){
          setModalKirimPesan(!ModalKirimPesan);
          navigation.navigate('LaporanPenyuluh', {id_order:IDOrder});
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
      });
  }

  const Tampilan = () => {
    if(Email != ''){
      return (
          <View style={{flex:1}}>
            {/* Modal Permintaan Penyuluh */}
            <Modal
            animationType="fade"
            transparent={true}
            visible={ModalKirimPesan}
            onRequestClose={() => {
                setModalKirimPesan(!ModalKirimPesan);
            }}
            >
                <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                    <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, width:windowWidth, alignItems:'center', justifyContent:'center'}}>
                        <View>
                        <Text style={styles.TextPoppins}>Verifikasi bahwa Penyuluh sudah benar-benar berada di lokasi tujuan</Text>
                        </View>
                        <View style={{marginVertical:5}}></View>
                        <TouchableOpacity onPress={()=>SudahSampai()} style={styles.BtnPrimary}>
                        <Text style={styles.TextPoppinsBtn}>Verifikasi</Text>
                        </TouchableOpacity>
                        <View style={{marginVertical:5}}></View>
                        <Text style={styles.TextPoppins}>Batalkan jika Anda belum sampai tujuan </Text>
                        <TouchableOpacity onPress={()=>setModalKirimPesan(!ModalKirimPesan)} style={styles.BtnWarning}>
                        <Text style={styles.TextPoppinsBtn}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
              <WebView 
                style={styles.container}
                source={{ uri: 'https://alicestech.com/geptan/go_penyuluh/tracking_penyuluh/'+IDOrder}}
                onMessage={(event)=> OlahPesanWeb(event)}
              />
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

export default MapTrackingPemesan

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