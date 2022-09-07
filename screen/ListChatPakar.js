import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Moment from 'moment';
import 'moment/locale/id'

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

    const [ArrayListChat, setArrayListChat] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [IDTopik, setIDTopik] = useState('');
    const [JudulTopik, setJudulTopik] = useState('');
    const [DeskripsiTopik, setDeskripsiTopik] = useState('');
    const [ModalTambahTopik, setModalTambahTopik] = useState(false);
    const [ModalMenuTopik, setModalMenuTopik] = useState(false);
    const [ModalUbahStatusTopik, setModalUbahStatusTopik] = useState(false);
    const [ModalHapusChatPop, setModalHapusChatPop] = useState(false);
    const [PengirimPesan, setPengirimPesan] = useState('');

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

    const GetListChat = async () => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/chat_pakar'
            );
            let json = await response.json();
            if(json.status == true){
              console.log(json);
              setArrayListChat(json.result);
            }
        } catch (error) {
            // console.error(error);
        }
    }

    const OpenRoomChat = (value) => {
        navigation.navigate('RoomDiskusiPakar', {id_user:value});
    }

    const ModalHapusChat = (pengirim) => {
        setModalHapusChatPop(!ModalHapusChatPop)
        setPengirimPesan(pengirim);
    }

    const HapusChat = async () => {
        try {
            let response = await fetch(
            'https://alicestech.com/kelasbertani/api/chat_pakar/hapus_room?pengirim='+PengirimPesan
            );
            let json = await response.json();
            if(json.status == true){
                GetListChat();
                setModalHapusChatPop(!ModalHapusChatPop);
            }
        } catch (error) {
            // console.error(error);
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser()
        GetListChat()
    }, [isFocused, IDUser]);

    const Item = ({ nama, photo, pekerjaan, createdAt, pesan, id_user}) => (
        <TouchableOpacity onLongPress={()=>ModalHapusChat(id_user)} onPress={()=>OpenRoomChat(id_user)} style={styles.CardChatPakar}>
            <Text style={styles.TextPoppinsBold}>{nama}</Text>
            <View style={{position:'absolute', top:10, right:10}}>
                <Image source={{uri:'https://alicestech.com/kelasbertani/upload/profile/' + photo}} style={{width:40, height:40, borderRadius:20}} />
            </View>
            <Text style={styles.TextPoppins}>Pekerjaan : {pekerjaan}</Text>
            <Text style={styles.TextPoppinsPesan}>{pesan}</Text>
            <Text style={styles.TextPoppins}>{Moment(createdAt).format('LLLL')}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => <Item nama={item.nama} photo={item.photo} pekerjaan={item.pekerjaan} id_user={item.id_user} createdAt={item.createdAt} pesan={item.pesan}/>;


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
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalHapusChatPop}
          onRequestClose={() => {
            setModalHapusChatPop(!ModalHapusChatPop);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>

            <View style={{paddingHorizontal:10, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10,  width:windowWidth, justifyContent:'center'}}>
                <TouchableOpacity onPress={()=> setModalHapusChatPop(!ModalHapusChatPop)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                    <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Apakah Anda yakin Ingin Menghapus Chat ini?</Text>
                <View style={{marginTop:10}}></View>
                <TouchableOpacity onPress={()=>HapusChat()} style={styles.BtnDanger}>
                    <Text style={styles.TitleBtnWhite}>Hapus</Text>
                </TouchableOpacity>
              </View>
        </View>
        </Modal>
        <View style={styles.ColorTopBar}></View>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Ruang Chat Pakar</Text>
                </View>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList style={{marginHorizontal:10}} data={ArrayListChat} renderItem={renderItem} keyExtractor={item => item.id_user} scrollEnabled={true} />
        </View>
    </SafeAreaView>
  )
}

export default ListChatPakar

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
    TextPoppinsPesan:{
        fontFamily:'Poppins-Bold',
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
    CardChatPakar: {
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
        marginHorizontal:5}
})