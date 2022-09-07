import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import ImageResizer from 'react-native-image-resizer';

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const LaporanPenyuluh = ({navigation, route}) => {

    const [ArrOrderStatus, setArrOrderStatus] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [Role, setRole] = useState('');
    const [IDOrder, setIDOrder] = useState('');
    const [NamaPemesan, setNamaPemesan] = useState('');
    const [NamaPenyuluh, setNamaPenyuluh] = useState('');
    const [AlamatTujuan, setAlamatTujuan] = useState('');
    const [StatusOrder, setStatusOrder] = useState('');
    const [TanggalOrder, setTanggalOrder] = useState('');
    const [Keterangan, setKeterangan] = useState('');
    const [ResizeImage, setResizeImage] = useState('');
    const [LocalUriFoto, setLocalUriFoto] = useState('');
    const [Rating, setRating] = useState('');
    const [StarColor1, setStarColor1] = useState('grey');
    const [StarColor2, setStarColor2] = useState('grey');
    const [StarColor3, setStarColor3] = useState('grey');
    const [StarColor4, setStarColor4] = useState('grey');
    const [StarColor5, setStarColor5] = useState('grey');
    const [ModalSelesaiPenyuluhan, setModalSelesaiPenyuluhan] = useState(false);

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        console.log(jsonValue)
        console.log(ParsingDataUser[0].id_user)
        if(ParsingDataUser[0].id_user){
            setIDUser(ParsingDataUser[0].id_user);
            setRole(ParsingDataUser[0].role);
        }
        } catch(e) {
        // error reading value
        }
      }

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            setIDOrder(route.params.id_order);
            console.log('id_order : ' + route.params.id_order)
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        AmbilDataRoute();
        GetDetailOrder();
    }, [isFocused, IDUser, IDOrder]);

    const GetDetailOrder = async () => {
        await axios.get('https://alicestech.com/kelasbertani/api/order_penyuluh/detail', {
            params:{
                id_order:IDOrder
            }
        })
        .then(response => {
            console.log('Order Detail :')
            console.log(response.data)
            if(response.data.status == true){
                setNamaPemesan(response.data.result[0].nama_pemesan);
                setNamaPenyuluh(response.data.result[0].nama_penyuluh);
                setAlamatTujuan(response.data.result[0].alamat_tujuan);
                setStatusOrder(response.data.result[0].status);
                setTanggalOrder(response.data.result[0].tanggal);
                setKeterangan(response.data.result[0].keterangan);
                setRating(response.data.result[0].rating);
                CekRating(response.data.result[0].rating);
                setLocalUriFoto("https://alicestech.com/kelasbertani/upload/go_penyuluh/"+response.data.result[0].foto);
            }
        })
        .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    const CekRating = (rate) => {
        console.log('Rating Saat ini: ' + rate)
        if(rate == 1) {
            setStarColor1('orange');
            setStarColor2('grey');
            setStarColor3('grey');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 2) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('grey');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 3) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 4) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('orange');
            setStarColor5('grey');
        }
        if(rate == 5) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('orange');
            setStarColor5('orange');
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.5,
        });
    
        console.log(result);
    
        if (!result.cancelled) {

            ImageResizer.createResizedImage(result.uri, 300, 300, 'JPEG', 100, 0, undefined, false, { mode:'contain' })
            .then(resizedImage => {
                console.log({ resizedImage });
                console.log('url foto local: ' + resizedImage.uri);
                setLocalUriFoto(resizedImage.uri)
                setResizeImage(resizedImage);
            })
            .catch(err => {
                console.log(err);
                return Alert.alert(
                'Unable to resize the photo',
                'Check the console for full the error message',
                );
            });          
        }
    };

    const UploadFoto = async (resizedImage) => {
        if(resizedImage != ''){
            var myHeaders = new Headers();
                
            let localUri = resizedImage.uri;
            let filename = localUri.split('/').pop();
          
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            console.log('type image: ' + type);
    
            var formdata = new FormData();
            formdata.append("id_order", IDOrder);
            formdata.append("keterangan", Keterangan);
            formdata.append("status", "Selesai");
            formdata.append("pesan", "Sudah Selesai");
            formdata.append("rating", Rating);
            formdata.append("image", { uri: localUri, name: filename, type: type});
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow'
            };
        
            await fetch("https://alicestech.com/kelasbertani/api/order_penyuluh/foto", requestOptions)
              .then(response => response.json())
              .then(result => {
                  console.log(result);
                  if(result.status == true){
                      GetDetailOrder()
                      setModalSelesaiPenyuluhan(!ModalSelesaiPenyuluhan);
                  }
              })
              .catch(error => {
                GetDetailOrder()
                console.log('error')
              });
        }else{
            // Bagian ini belum selesai
            const ParameterUrl = { 
                id_order:IDOrder,
                pesan:'Sudah Selesai',
                status:'Selesai',
                keterangan:Keterangan,
                rating:Rating,
              }
              console.log(ParameterUrl)
              await axios.post('https://alicestech.com/kelasbertani/api/order_penyuluh/selesai', ParameterUrl)
              .then(response => {
                console.log('Order Status :')
                console.log(response.data)
                if(response.data.status == true){
                    GetDetailOrder()
                    setModalSelesaiPenyuluhan(!ModalSelesaiPenyuluhan);
                }
              })
              .catch(e => {
                if (e.response.status === 404) {
                  console.log(e.response.data)
                }
              });
        }
    }

    const BuatRating = (rate) => {
        setRating(rate);
        console.log(rate);
        if(rate == 1) {
            setStarColor1('orange');
            setStarColor2('grey');
            setStarColor3('grey');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 2) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('grey');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 3) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('grey');
            setStarColor5('grey');
        }
        if(rate == 4) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('orange');
            setStarColor5('grey');
        }
        if(rate == 5) {
            setStarColor1('orange');
            setStarColor2('orange');
            setStarColor3('orange');
            setStarColor4('orange');
            setStarColor5('orange');
        }
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
        {/* Modal Data Berhasil Disimpan */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={ModalSelesaiPenyuluhan}
            onRequestClose={() => {
                setModalSelesaiPenyuluhan(!ModalSelesaiPenyuluhan);
            }}
            >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10, width:windowWidth, alignItems:'center', justifyContent:'center'}}>
                    <View>
                    <Text style={styles.TextPoppins}>Data dan order penyuluh telah selesai disimpan dan dilaksanakan. Anda dapat kembali ke halaman utama dengan menekan tombol di bawah ini.</Text>
                    </View>
                    <View style={{marginVertical:5}}></View>
                    <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')} style={styles.BtnPrimary}>
                    <Text style={styles.TextPoppinsBtn}>Selesai</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Laporan & Detail Order</Text>
                </View>
            </View>
        </View>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.CardListOrder}>
                <Text style={styles.TextPoppins}>Pemesan : {NamaPemesan}</Text>
                <Text style={styles.TextPoppins}>Penyuluh : {NamaPenyuluh}</Text>
                <Text style={styles.TextPoppins}>Alamat : {AlamatTujuan}</Text>
                <Text style={styles.TextPoppins}>Status : {StatusOrder}</Text>
                <Text style={styles.TextPoppins}>Tanggal : {TanggalOrder}</Text>
            </View>
            {
                Role != 'Penyuluh' ? 
                <View style={{marginHorizontal:10, alignItems:'center'}}>
                <Text style={styles.TextPoppins}>Berikan Rating Pelayanan</Text>
                    <View style={{flexDirection:'row', marginHorizontal:10, alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>BuatRating('1')}>
                            <AntDesign name="star" size={40} color={StarColor1} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>BuatRating('2')}>
                            <AntDesign name="star" size={40} color={StarColor2} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>BuatRating('3')}>
                            <AntDesign name="star" size={40} color={StarColor3} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>BuatRating('4')}>
                            <AntDesign name="star" size={40} color={StarColor4} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>BuatRating('5')}>
                            <AntDesign name="star" size={40} color={StarColor5} />
                        </TouchableOpacity>
                    </View>
                </View>:
                <View style={{marginHorizontal:10, alignItems:'center'}}>
                <Text style={styles.TextPoppins}>Rating Pelayanan Anda</Text>
                    <View style={{flexDirection:'row', marginHorizontal:10, alignItems:'center', justifyContent:'center'}}>
                        <View>
                            <AntDesign name="star" size={40} color={StarColor1} />
                        </View>
                        <View>
                            <AntDesign name="star" size={40} color={StarColor2} />
                        </View>
                        <View>
                            <AntDesign name="star" size={40} color={StarColor3} />
                        </View>
                        <View>
                            <AntDesign name="star" size={40} color={StarColor4} />
                        </View>
                        <View>
                            <AntDesign name="star" size={40} color={StarColor5} />
                        </View>
                    </View>
                </View>
            }
            
            <View style={{marginHorizontal:10, marginTop:10}}>
            {Role != 'Penyuluh' ?
            <View>
                <Text style={styles.TextPoppinsBold}>Buat Keterangan</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Keterangan => setKeterangan(Keterangan)}
                        defaultValue={Keterangan}
                        numberOfLines={4}
                        multiline={true}
                        placeholder={'Berikan Keterangan'}
                        />
                    </View>
                </View>
            </View>:
            <View>
                <Text style={styles.TextPoppinsBold}>Keterangan</Text>
                <Text style={styles.TextPoppins}>{Keterangan}</Text>
            </View>
        }
                
                <View style={{marginVertical:5}}></View>
                {LocalUriFoto != '' ?
                    <View style={{alignItems:'center'}}>
                        <Image source={{uri:LocalUriFoto}} style={{width:250, height:250, borderRadius:20}} resizeMode="contain"  /> 
                    </View>
                    :<View></View>
                }
                <View style={{marginVertical:5}}></View>
                <TouchableOpacity onPress={()=> pickImage()} style={styles.BtnSecondary}>
                    <Text style={styles.TextPoppinsBtn}>Unggah Foto</Text>
                </TouchableOpacity>
                <View style={{marginVertical:5}}></View>
                <TouchableOpacity onPress={()=> GetDetailOrder()} style={styles.BtnSecondary}>
                    <Text style={styles.TextPoppinsBtn}>Batalkan/Refresh</Text>
                </TouchableOpacity>
                <View style={{marginVertical:5}}></View>
                <TouchableOpacity onPress={()=> UploadFoto(ResizeImage)} style={styles.BtnSuccess}>
                    <Text style={styles.TextPoppinsBtn}>Simpan & Selesaikan Order</Text>
                </TouchableOpacity>
                <View style={{marginBottom:20}}></View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default LaporanPenyuluh

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
    CardListOrder:{
        width:windowWidth-20,
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
    FormInput:{
        marginTop:10,
        width:'100%'
    },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        width:'100%'
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
        backgroundColor:'blue'
    },
    BtnSuccess: {
        paddingVertical:8,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
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
    BtnSecondary: {
        paddingVertical:8,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        borderRadius:10,
        backgroundColor:'grey',
        // borderWidth:1,
    },
    TextPoppinsBtn:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
})