import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import tanaman from '../assets/images/tanaman.png'

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const ListChatPakar = ({navigation, route}) => {

    const [ArrayListTopik, setArrayListTopik] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [IDTopik, setIDTopik] = useState('');
    const [IDPembuatTopik, setIDPembuatTopik] = useState('');
    const [JudulTopik, setJudulTopik] = useState('');
    const [DeskripsiTopik, setDeskripsiTopik] = useState('');
    const [ModalTambahTopik, setModalTambahTopik] = useState(false);
    const [ModalMenuTopik, setModalMenuTopik] = useState(false);
    const [ModalUbahStatusTopik, setModalUbahStatusTopik] = useState(false);

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

    const BuatTopik = async () => {
        const ParameterUrl = { 
            id_user:IDUser,
            judul_topik:JudulTopik,
            deskripsi:DeskripsiTopik,
        }
        if(JudulTopik != '' & DeskripsiTopik != ''){
            console.log(ParameterUrl)
            await axios.post('https://alicestech.com/kelasbertani/api/topik_diskusi', ParameterUrl)
            .then(response => {
            console.log(response.data)
            if(response.data.status == true){
                GetTopikDiskusi();
                Alert.alert('Berhasil', 'Topik Telah Dibuat',[
                {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Ok", onPress: () => setModalTambahTopik(false) }
                ]);
            }
            })
            .catch(e => {
            if (e.response.status === 404) {
                console.log(e.response.data)
                Alert.alert('Mohon Maaf', e.response.data.message);
                }
            });
        }else{
            Alert.alert('Mohon Maaf', "Judul Topik & Deskripsi Wajib Diisi!");
        }
    }

    const GetTopikDiskusi = async () => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/topik_diskusi'
            );
            let json = await response.json();
            if(json.status == true){
              console.log(json);
              setArrayListTopik(json.result);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const SimpanTopikFavorit = async () => {
        console.log('ID Topik : '+ IDTopik)
        console.log('ID User : '+ IDUser)
        await axios.get('https://alicestech.com/kelasbertani/api/topik_diskusi/favorit', {
            params: {
              id_topik: IDTopik,
              id_user: IDUser,
            }
          })
          .then(response => {
            console.log(response.data.result)
            GetTopikDiskusi()
            setModalUbahStatusTopik(!ModalUbahStatusTopik);
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    const UbahStatusTopik = (id_topik, id_pembuat) => {
        console.log('UbahStatusTopik' + id_topik);
        setIDTopik(id_topik);
        setIDPembuatTopik(id_pembuat)
        setModalUbahStatusTopik(true);
    }

    const HapusTopik = async () => {
        await axios.get('https://alicestech.com/kelasbertani/api/topik_diskusi/hapus', {
            params: {
              id_topik: IDTopik,
            }
          })
          .then(response => {
            console.log(response.data.result)
            GetTopikDiskusi()
            setModalUbahStatusTopik(!ModalUbahStatusTopik);
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }



    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser()
        GetTopikDiskusi()
    }, [isFocused, IDUser]);

    const Item = ({ judul_topik, deskripsi, created_by, status, created, updated, id_topik, id_pembuat}) => (
        <TouchableOpacity onLongPress={()=>UbahStatusTopik(id_topik, id_pembuat)} onPress={()=> navigation.navigate('RoomDiskusi', {id_topik:id_topik})} style={{marginBottom:10, paddingHorizontal:10, paddingVertical:10, borderRadius:10, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5, backgroundColor:'white', marginTop:5, marginHorizontal:5}}>
            <Text style={styles.TextPoppinsBold}>{judul_topik}</Text>
            <Text style={styles.TextPoppins}>{deskripsi}</Text>
            <Text style={styles.TextPoppins}>Dibuat Oleh : {created_by}</Text>
            <Text style={styles.TextPoppins}>Tanggal : {created}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item judul_topik={item.judul_topik} deskripsi={item.deskripsi} status={item.status} updated={item.updated} created={item.created} created_by={item.created_by} id_topik={item.id_topik} id_pembuat={item.id_user} />;


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
        {/* Modal Tambah Topik */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalTambahTopik}
          onRequestClose={() => {
            setModalTambahTopik(!ModalTambahTopik);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.TitleModalTopik}>Tambah Topik</Text>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={JudulTopik => setJudulTopik(JudulTopik)}
                            defaultValue={JudulTopik}
                            placeholder='Judul Topik'
                            />
                        </View>
                    </View>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={DeskripsiTopik => setDeskripsiTopik(DeskripsiTopik)}
                            defaultValue={DeskripsiTopik}
                            placeholder='Deskripsi atau Permasalahan'
                            multiline={true}
                            numberOfLines={10}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>BuatTopik()} style={styles.SimpanTopikButton}>
                        <Text style={styles.TextSimpanTopikButton}>Buat Topik</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* Modal Ubah Status Topik */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalUbahStatusTopik}
          onRequestClose={() => {
            setModalUbahStatusTopik(!ModalUbahStatusTopik);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.TitleModalTopik}>Ubah Status Topik</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>SimpanTopikFavorit()} style={styles.BtnSuccess}>
                            <Text style={styles.TitleBtnWhite}>Topik Favorit</Text>
                        </TouchableOpacity>
                        {IDUser == IDPembuatTopik ?
                            <TouchableOpacity onPress={()=>HapusTopik()} style={styles.BtnDanger}>
                                <Text style={styles.TitleBtnWhite}>Hapus Topik</Text>
                            </TouchableOpacity>
                            : <View></View>
                        }
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>setModalUbahStatusTopik(!ModalUbahStatusTopik)} style={styles.BtnOutline}>
                            <Text style={styles.TitleBtnBlack}>Batal Ubah Status</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <TouchableOpacity style={styles.TambahTopik} onPress={()=>setModalTambahTopik(!ModalTambahTopik)}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Topik Diskusi</Text>
                </View>
                <TouchableOpacity style={{marginRight:10}} onPress={()=> navigation.navigate('ListTopikFavorit')}>
                    <EvilIcons name="star" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList style={{marginHorizontal:10}} data={ArrayListTopik} renderItem={renderItem} keyExtractor={item => item.id_topik} scrollEnabled={true} />
        </View>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Dashboard')}>
                <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('FavouriteLocalData')}>
                <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('DaftarController', {IDUser:IDUser})}>
                <SimpleLineIcons name="game-controller" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
                <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default ListChatPakar

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:50,
                height:windowHeight-140,
            },
            android:{
                marginBottom:50,
                height:windowHeight-130,
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
    SimpanTopikButton:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        borderRadius:10,
        width:100,
        alignItems:'center',
        width:'100%', 
        marginTop:10
    },
    TitleModalTopik:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'black',
    },
    TextSimpanTopikButton:{
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
    TambahTopik:{
        width:50,
        height:50,
        borderRadius:50/2,
        backgroundColor:'#0D986A',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:80,
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
        flex:1,
        marginTop:10
    },
    BtnSuccess:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        borderRadius:10,
        marginHorizontal:5,
        alignItems:'center',
        width:'100%', 
        flex:1,
        marginTop:10
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
})