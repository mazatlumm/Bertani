import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert, Linking } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import * as ImagePicker from 'expo-image-picker';

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const PasarBertani = ({navigation, route}) => {

    const [ArrayProduk, setArrayProduk] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [ModalLihatFotoProduk, setModalLihatFotoProduk] = useState('');
    const [NamaFotoProduk, setNamaFotoProduk] = useState('');

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

    const GetDaftarProduk = async () => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/produk'
            );
            let json = await response.json();
            if(json.status == true){
                console.log(json);
                setArrayProduk(json.result);
            }else{
                console.log('Produk Kosong')
                setArrayProduk([]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const currencyFormat = (angka, prefix) => {
        var number_string = angka.replace(/[^,\d]/g, '').toString()
		var	split   		= number_string.split(',')
		var	sisa     		= split[0].length % 3
		var	rupiah     		= split[0].substr(0, sisa)
		var	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
 
			// tambahkan titik jika yang di input sudah menjadi angka ribuan
			if(ribuan){
				var separator = sisa ? '.' : '';
				rupiah += separator + ribuan.join('.');
			}
 
			rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
			return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
     }

     const WhatsAppLink = (nomorWA, nama_barang) => {
        let msg = "Hai Pak/Bu, Saya ingin membeli produk yang Anda pasarkan di Aplikasi Bertani yakni : " + nama_barang;
        let mobile = nomorWA;
        const regex = new RegExp("^0+(?!$)",'g');
        var strMobileNumber = mobile.toString().replace(regex, "");
        if(mobile){
          if(msg){
          // Kode negara 62 = Indonesia
            let url = 'whatsapp://send?text=' + msg + '&phone=62' + strMobileNumber;
            Linking.openURL(url).then((data) => {
              console.log('WhatsApp Opened');
            }).catch(() => {
              Alert.alert('Maaf', 'Silahkan install aplikasi Whatsapp terlebih dahulu');
            });
          }else{
            Alert.alert('Maaf', 'Pesanan masih kosong');
          }
        }else{
          Alert.alert('Maaf', 'Penjual Tidak Memasukkan Nomor WA/Telephone');
        }
      }

    const LihatFotoProduk = (foto) => {
        setNamaFotoProduk('https://alicestech.com/kelasbertani/upload/produk/' + foto)
        setModalLihatFotoProduk(!ModalLihatFotoProduk)
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser()
        GetDaftarProduk()
    }, [isFocused, IDUser]);

    const Item = ({ id_produk, id_user, nama_produk, stok, harga, wa, foto, nama_penjual, created, updated}) => (
        <TouchableOpacity style={styles.CardProduk}>
            <TouchableOpacity onPress={()=>LihatFotoProduk(foto)} style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                {foto == null ?
                    <FontAwesome name="image" size={70} color="black" />
                    : <Image source={{uri:'https://alicestech.com/kelasbertani/upload/produk/'+foto}} style={{width:100, height:100, borderRadius:20}} resizeMode="contain" />
                }
            </TouchableOpacity>
            <View style={{marginTop:10}}>
                <Text style={styles.TextPoppinsBold}>{nama_produk}</Text>
                <Text style={styles.TextPoppinsBoldGreen}>{currencyFormat(harga, 'Rp. ')}</Text>
                <Text style={styles.TextPoppins}>Stok : {stok}</Text>
                <Text style={styles.TextPoppins}>WA/Telp : {wa}</Text>
                <Text style={styles.TextPoppins}>Penjual : {nama_penjual}</Text>
                <TouchableOpacity onPress={()=> WhatsAppLink(wa, nama_produk) } style={styles.BtnSuccess}>
                    <Text style={styles.TextBtnWhite}>Beli</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item id_produk={item.id_produk} id_user={item.id_user} nama_produk={item.nama_produk} stok={item.stok} harga={item.harga} wa={item.wa} foto={item.foto} nama_penjual={item.nama_penjual} created={item.created} updated={item.updated} />;


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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white',justifyContent:'center'}}>
        {/* Modal Lihat Foto Produk */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalLihatFotoProduk}
          onRequestClose={() => {
            setModalLihatFotoProduk(!ModalLihatFotoProduk);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.TitleModalCatatanKegiatan}>Foto Produk</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5, alignItems:'center', justifyContent:'center'}} onPress={()=> setModalLihatFotoProduk(!ModalLihatFotoProduk)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                    { NamaFotoProduk != '' ? 
                        <Image source={{uri:NamaFotoProduk}} style={{ width:windowWidth-1000, height:300, borderRadius:20, marginTop:10, alignItems:'center', justifyContent:'center'}} resizeMode="contain" />
                        :
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <FontAwesome name="image" size={70} color="black" />
                            <Text style={styles.TextPoppins}>Foto Produk Belum Ditambahkan</Text>
                        </View>
                    }
                </View>
            </View>
        </Modal>
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:7, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Produk</Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex:0.5, alignItems:'flex-end', marginRight:10}}>
                    <EvilIcons name="arrow-left" size={26} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList numColumns={2} data={ArrayProduk} renderItem={renderItem} keyExtractor={item => item.id_produk} />
        </View>
    </SafeAreaView>
  )
}

export default PasarBertani

const styles = StyleSheet.create({
    ScrollViewBox:{
        flex:1,
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
        height:50
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
        marginLeft:10,
        paddingHorizontal:20 
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
        fontSize:10,
        color:'black'
    },
    TextPoppinsBold:{
        fontFamily:'Poppins-Bold',
        fontSize:16,
        color:'black'
    },
    TextPoppinsBoldH3:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
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
    BtnSuccess:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
    },
    TextBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    SimpanProdukButton:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        borderRadius:10,
        width:100,
        alignItems:'center',
        width:'100%', 
        marginTop:10
    },
    TitleModalCatatanKegiatan:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black',
    },
    TextSimpanProdukButton:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
      },
    JajarGenjang:{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 170,
    borderLeftWidth: windowWidth,
    borderTopColor: 'transparent',
    borderRightColor: '#9CE5CB',
    borderBottomColor: '#9CE5CB',
    borderLeftColor: '#9CE5CB',
    borderTopRightRadius:80,
    borderBottomRightRadius:50,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
    },
    TambahCatatanKegiatan:{
        width:50,
        height:50,
        borderRadius:50/2,
        backgroundColor:'#0D986A',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:30,
        right:20,
        zIndex:10
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
    BtnDanger:{
        backgroundColor:'#d34539',
        paddingVertical:5,
        borderRadius:10,
        marginHorizontal:5,
        alignItems:'center',
        width:'100%', 
        marginTop:10,
        flex:1
    },
    BtnOutline:{
        backgroundColor:'white',
        paddingVertical:5,
        borderRadius:10,
        marginHorizontal:5,
        alignItems:'center',
        width:'100%', 
        flex:1,
        marginTop:10,
        borderWidth:1
    },
    TitleBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    TitleBtnBlack:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black',
    },
    CardLaporan:{
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:10,
        borderRadius:20,
        paddingHorizontal:20,
        paddingVertical:10
    },
    CardProduk:{
        marginBottom:10, 
        paddingHorizontal:10, 
        paddingVertical:10, 
        borderRadius:10, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, 
        backgroundColor:'white', 
        marginTop:5, 
        marginHorizontal:5,
        width:windowWidth/2.2
    }
})