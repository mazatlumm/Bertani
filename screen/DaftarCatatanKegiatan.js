import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const DaftarCatatanKegiatan = ({navigation, route}) => {

    const [ArrayListKegiatan, setArrayListKegiatan] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [IDLaporan, setIDLaporan] = useState('');
    const [JenisTanaman, setJenisTanaman] = useState('');
    const [Varietas, setVarietas] = useState('');
    const [LuasLahan, setLuasLahan] = useState('');
    const [ModalTambahCatatanKegiatan, setModalTambahCatatanKegiatan] = useState(false);
    const [ModalUbahCatatanKegiatan, setModalUbahCatatanKegiatan] = useState(false);

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

    const BuatLaporanKegiatan = async () => {
        const ParameterUrl = { 
            id_user:IDUser,
            jenis_tanaman:JenisTanaman,
            varietas:Varietas,
            luas_lahan:LuasLahan,
        }
        if(JenisTanaman != ''){
            console.log(ParameterUrl)
            await axios.post('https://alicestech.com/kelasbertani/api/laporan_kegiatan', ParameterUrl)
            .then(response => {
            console.log(response.data)
            if(response.data.status == true){
                GetLaporanKegiatan();
                setModalTambahCatatanKegiatan(!ModalTambahCatatanKegiatan);
            }
            })
            .catch(e => {
            if (e.response.status === 404) {
                console.log(e.response.data)
                }
            });
        }else{
            Alert.alert('Mohon Maaf', "Anda harus mengisi Jenis Tanaman!");
        }
    }
    
    const SimpanPerubahanLaporan = async () => {
        const ParameterUrl = { 
            id:IDLaporan,
            jenis_tanaman:JenisTanaman,
            varietas:Varietas,
            luas_lahan:LuasLahan,
        }
        if(JenisTanaman != ''){
            console.log(ParameterUrl)
            await axios.post('https://alicestech.com/kelasbertani/api/laporan_kegiatan/edit', ParameterUrl)
            .then(response => {
            console.log(response.data)
            if(response.data.status == true){
                GetLaporanKegiatan();
                setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan)
            }
            })
            .catch(e => {
            if (e.response.status === 404) {
                console.log(e.response.data)
                }
            });
        }else{
            Alert.alert('Mohon Maaf', "Anda harus mengisi Jenis Tanaman!");
        }
    }

    const GetLaporanKegiatan = async () => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/laporan_kegiatan?id_user=' + IDUser
            );
            let json = await response.json();
            if(json.status == true){
              console.log(json);
              setArrayListKegiatan(json.result);
            }else{
                setArrayListKegiatan([]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const HapusLaporanKegiatan = async () => {
        Alert.alert("Hapus Laporan", "Apakah Anda yakin menghapus kegiatan ini?", [
            {
                text: "Batal",
                onPress: () => console.log("Batal"),
                style: "cancel"
            },
            { text: "Iya", onPress: () => {
                 axios.get('https://alicestech.com/kelasbertani/api/laporan_kegiatan/hapus', {
                    params: {
                      id: IDLaporan,
                    }
                  })
                  .then(response => {
                    console.log(response.data)
                    setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan)
                    GetLaporanKegiatan()
                  })
                  .catch(e => {
                    if (e.response.status === 404) {
                      console.log(e.response.data)
                      setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan)
                    }
                });
            }}
        ]);
    }

    const UbahLaporanKegiatan = (id_laporan, jenis_tanaman, varietas, luas_lahan) => {
        setIDLaporan(id_laporan)
        setJenisTanaman(jenis_tanaman)
        setVarietas(varietas)
        setLuasLahan(luas_lahan)
        setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan)
    }



    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser()
        GetLaporanKegiatan()
    }, [isFocused, IDUser]);

    const Item = ({ id, id_user, jenis_tanaman, varietas, luas_lahan ,created, updated}) => (
        <TouchableOpacity onLongPress={()=>UbahLaporanKegiatan(id, jenis_tanaman, varietas, luas_lahan)} onPress={()=>navigation.navigate('CatatanKegiatan', {id_laporan:id, jenis_tanaman:jenis_tanaman, varietas:varietas, luas_lahan:luas_lahan})} style={{marginBottom:10, paddingHorizontal:10, paddingVertical:10, borderRadius:10, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5, backgroundColor:'white', marginTop:5, marginHorizontal:5}}>
            <Text style={styles.TextPoppinsBold}>{jenis_tanaman}</Text>
            <Text style={styles.TextPoppins}>Varietas : {varietas}</Text>
            <Text style={styles.TextPoppins}>Luas Lahan : {luas_lahan}</Text>
            <Text style={styles.TextPoppins}>Tanggal Pembuatan : {moment(created).format('LLLL')}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item id={item.id} id_user={item.id_user} jenis_tanaman={item.jenis_tanaman} varietas={item.varietas} luas_lahan={item.luas_lahan} created={item.created} updated={item.updated} />;


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
        {/* Modal Tambah Laporan Kegiatan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalTambahCatatanKegiatan}
          onRequestClose={() => {
            setModalTambahCatatanKegiatan(!ModalTambahCatatanKegiatan);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.TitleModalCatatanKegiatan}>Tambah Kegiatan</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setModalTambahCatatanKegiatan(!ModalTambahCatatanKegiatan)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={JenisTanaman => setJenisTanaman(JenisTanaman)}
                            defaultValue={JenisTanaman}
                            placeholder='Jenis Tanaman'
                            />
                        </View>
                    </View>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={Varietas => setVarietas(Varietas)}
                            defaultValue={Varietas}
                            placeholder='Varietas'
                            />
                        </View>
                    </View>
                    <View style={styles.FormInput}>
                        <View style={styles.FormInputBox}>
                            <TextInput 
                            style={styles.TextInputForm} 
                            onChangeText={LuasLahan => setLuasLahan(LuasLahan)}
                            defaultValue={LuasLahan}
                            placeholder='Luas Lahan | Satuan Hektar'
                            keyboardType='number-pad'
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>BuatLaporanKegiatan()} style={styles.SimpanCatatanKegiatanButton}>
                        <Text style={styles.TextSimpanCatatanKegiatanButton}>Buat Kegiatan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* Modal Ubah Catatan Kegiatan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalUbahCatatanKegiatan}
          onRequestClose={() => {
            setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.TitleModalCatatanKegiatan}>Ubah Kegiatan</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setModalUbahCatatanKegiatan(!ModalUbahCatatanKegiatan)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                        <View style={styles.FormInput}>
                            <View style={styles.FormInputBox}>
                                <TextInput 
                                style={styles.TextInputForm} 
                                onChangeText={JenisTanaman => setJenisTanaman(JenisTanaman)}
                                defaultValue={JenisTanaman}
                                placeholder='Jenis Tanaman'
                                />
                            </View>
                        </View>
                        <View style={styles.FormInput}>
                            <View style={styles.FormInputBox}>
                                <TextInput 
                                style={styles.TextInputForm} 
                                onChangeText={Varietas => setVarietas(Varietas)}
                                defaultValue={Varietas}
                                placeholder='Varietas'
                                />
                            </View>
                        </View>
                        <View style={styles.FormInput}>
                            <View style={styles.FormInputBox}>
                                <TextInput 
                                style={styles.TextInputForm} 
                                onChangeText={LuasLahan => setLuasLahan(LuasLahan)}
                                defaultValue={LuasLahan}
                                placeholder='Luas Lahan | Satuan Hektar'
                                keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity onPress={()=>HapusLaporanKegiatan()} style={styles.BtnDanger}>
                                <Text style={styles.TitleBtnWhite}>Hapus Laporan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>SimpanPerubahanLaporan()} style={styles.BtnSuccess}>
                                <Text style={styles.TitleBtnWhite}>Simpan Perubahan</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
        </Modal>

        <TouchableOpacity style={styles.TambahCatatanKegiatan} onPress={()=>setModalTambahCatatanKegiatan(!ModalTambahCatatanKegiatan)}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Kegiatan Bertani</Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex:0.5, alignItems:'flex-end', marginRight:10}}>
                    <EvilIcons name="arrow-left" size={26} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList style={{marginHorizontal:10}} data={ArrayListKegiatan} renderItem={renderItem} keyExtractor={item => item.id} scrollEnabled={true} />
        </View>
    </SafeAreaView>
  )
}

export default DaftarCatatanKegiatan

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
    SimpanCatatanKegiatanButton:{
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
    TextSimpanCatatanKegiatanButton:{
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
    BtnSuccess:{
        backgroundColor:'#30B700',
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
})