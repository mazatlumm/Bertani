import { StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AvatarIcon from '../assets/images/tanyapakar.png'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import axios from 'axios'
import Moment from 'moment';
import 'moment/locale/id'

const RoomDiskusi = ({navigation, route}) => {
    const [messages, setMessages] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [NamaUser, setNamaUser] = useState([]);
    const [FotoUser, setFotoUser] = useState('');
    const [IDTopik, setIDTopik] = useState('');
    const [IDChat, setIDChat] = useState('');
    const [ModalHapusPesan, setModalHapusPesan] = useState(false);

    const isFocused = useIsFocused();

    const fetchDataChat = async (id_topik) => {
        console.log('Ambil Data Chat ID Topik : ' + id_topik);
        await axios.get('https://alicestech.com/kelasbertani/api/topik_diskusi/cek_chat', {
            params: {
              id_topik: id_topik,
            }
          })
          .then(response => {
            console.log(response.data.result)
            setMessages(response.data.result)
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }
    
    const PostDataChat = async (pengirim, id_topik, avatar_pengirim, nama_pengirim, pesan, createdAt) => {
        const ParameterUrl = { 
            id_topik: id_topik,
            pengirim: pengirim,
            nama_pengirim: nama_pengirim,
            avatar_pengirim: avatar_pengirim,
            pesan: pesan,
            createdAt: createdAt
        }
        console.log(ParameterUrl)
        await axios.post('https://alicestech.com/kelasbertani/api/topik_diskusi/chat', ParameterUrl)
          .then(response => {
            console.log(response.data)
            fetchDataChat(id_topik);
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    useEffect(() => {
        LihatDataUser();
        DataRouteNavigation();
    }, [isFocused, IDTopik, IDUser])

    const DataRouteNavigation = () => {
        if(route.params != undefined){
            var id_topik_sekarang = route.params.id_topik;
            console.log('ID Topik : ' + id_topik_sekarang);
            setIDTopik(id_topik_sekarang);
            fetchDataChat(id_topik_sekarang);
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
            setIDUser(ParsingDataUser[0].id_user);
            setFotoUser('https://alicestech.com/kelasbertani/upload/profile/'+ParsingDataUser[0].photo);
        }
        } catch(e) {
        // error reading value
        }
      }

  const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        } = messages[0]
        PostDataChat(user._id, user.id_topik, user.avatar, user.name, text, createdAt)
  }, [])

  const CekChatDitekan = (context, message) => {
    console.log(message.user.id_chat)
    setIDChat(message.user.id_chat)
    setModalHapusPesan(true);
  }

  const HapusPesan = async () => {
    await axios.get('https://alicestech.com/kelasbertani/api/topik_diskusi/hapus_chat', {
        params: {
            id_chat: IDChat,
        }
        })
        .then(response => {
            console.log(response.data.result)
            setModalHapusPesan(!ModalHapusPesan)
            setTimeout(() => {
                fetchDataChat(IDTopik);
            }, 1000);
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
    <View style={styles.ContentWrapper}>
        <View style={styles.BoxHeader}>
            <View style={styles.BoxTitleHeader}>
                <Text style={styles.TitleHeader}>Ruang Diskusi</Text>
            </View>
            <View style={styles.UserFotoHeader}>
                {FotoUser != '' ?
                    <Image source={{uri:FotoUser}} style={styles.FotoUser} />
                    : <View></View>
                }
            </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalHapusPesan}
          onRequestClose={() => {
            setModalHapusPesan(!ModalHapusPesan);
          }}
        >
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
                <View style={{paddingHorizontal:20, width:'100%', backgroundColor:'white', borderRadius:10, paddingVertical:20,}}>
                    <Text style={styles.DeleteWarningMessage}>Apakah Anda yakin ingin menghapus pesan ini?</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>setModalHapusPesan(!ModalHapusPesan)} style={styles.BatalHapusPesanBtn}>
                            <Text style={styles.TitleBtnWhite}>Batalkan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>HapusPesan()} style={styles.HapusPesanBtn}>
                            <Text style={styles.TitleBtnWhite}>Hapus Pesan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            showAvatarForEveryMessage={true}
            user={{
                _id: IDUser,
                name: NamaUser,
                avatar: FotoUser,
                id_topik: IDTopik,
            }}
            placeholder="Ketik Pesan ..."
            onLongPress={(context, message)=> CekChatDitekan(context, message)}
        />
    </View>
  )
}

export default RoomDiskusi

const styles = StyleSheet.create({
    ContentWrapper:{
        flex:1,
        backgroundColor:'white',
        paddingTop:50
    },  
    BoxHeader:{
        flexDirection:'row',
        position:'absolute', 
        height:50, 
        width:'100%', 
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },  
    BoxTitleHeader:{
        flex:2
    },  
    TitleHeader:{
        fontFamily:'Poppins-Bold',
        fontSize:14,
        color:'black',
        textAlign:'center'
    },
    UserFotoHeader:{
        position:'absolute',
        top:5,
        left:10
    },
    FotoUser:{
        height:40,
        width:40,
        borderRadius:20
    },
    DeleteWarningMessage:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'black',
        textAlign:'center'
    },
    HapusPesanBtn:{
        backgroundColor:'#d34539',
        paddingVertical:5,
        borderRadius:10,
        flex:1,
        marginHorizontal:5,
        alignItems:'center',
        width:'100%', 
        marginTop:10
    },
    TitleBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    BatalHapusPesanBtn:{
        backgroundColor:'#30B700',
        paddingVertical:5,
        borderRadius:10,
        flex:1,
        marginHorizontal:5,
        alignItems:'center',
        width:'100%', 
        marginTop:10
    },
    TitleBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
})