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

const RoomDiskusiPakar = ({navigation, route}) => {
    const [messages, setMessages] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [NamaUser, setNamaUser] = useState([]);
    const [FotoUser, setFotoUser] = useState('');
    const [IDUserTarget, setIDUserTarget] = useState('');
    const [IDChat, setIDChat] = useState('');
    const [ModalHapusPesan, setModalHapusPesan] = useState(false);
    const [Role, setRole] = useState(false);

    const isFocused = useIsFocused();

    const fetchDataChat = async (id_user, role) => {
        // console.log('Ambil Data Chat ID USER : ' + id_user);
        await axios.get('https://alicestech.com/kelasbertani/api/chat_pakar/chat', {
            params: {
              id_user: id_user,
              role: role,
            }
          })
          .then(response => {
            // console.log(response.data.result)
            setMessages(response.data.result)
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }
    
    const PostDataChat = async (pengirim, id_penanya, avatar_pengirim, nama_pengirim, pesan, createdAt, role) => {
        const ParameterUrl = { 
            id_penanya: id_penanya,
            pengirim: pengirim,
            nama_pengirim: nama_pengirim,
            avatar_pengirim: avatar_pengirim,
            pesan: pesan,
            createdAt: createdAt
        }
        console.log(ParameterUrl)
        await axios.post('https://alicestech.com/kelasbertani/api/chat_pakar/chat', ParameterUrl)
          .then(response => {
            console.log(response.data)
            fetchDataChat(id_penanya, role);
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    useEffect(() => {
        LihatDataUser();
        const interval = setInterval(() => {
            fetchDataChat(IDUserTarget, Role)
        }, 1000);
        return () => clearInterval(interval);
    }, [isFocused, IDUserTarget, IDUser])

    const DataRouteNavigation = (role) => {
        if(route.params != undefined){
            var id_user_sekarang = route.params.id_user;
            console.log('ID User : ' + id_user_sekarang);
            setIDUserTarget(id_user_sekarang);
            fetchDataChat(id_user_sekarang, role);
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
            setRole(ParsingDataUser[0].role);
            setFotoUser('https://alicestech.com/kelasbertani/upload/profile/'+ParsingDataUser[0].photo);
            DataRouteNavigation(ParsingDataUser[0].role);
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
        PostDataChat(user._id, user.id_penanya, user.avatar, user.name, text, createdAt, user.role)
  }, [])

  const CekChatDitekan = (context, message) => {
    console.log(message.user.id_chat)
    setIDChat(message.user.id_chat)
    setModalHapusPesan(true);
  }

  const HapusPesan = async () => {
    await axios.get('https://alicestech.com/kelasbertani/api/chat_pakar/hapus_chat', {
        params: {
            id_chat: IDChat,
        }
        })
        .then(response => {
            console.log(response.data.result)
            setModalHapusPesan(!ModalHapusPesan)
            setTimeout(() => {
                fetchDataChat(IDUserTarget, Role);
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
                <Text style={styles.TitleHeader}>Ruang Tanya Pakar</Text>
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
            renderUsernameOnMessage={true}
            user={{
                _id: IDUser,
                name: NamaUser,
                avatar: FotoUser,
                id_penanya: IDUserTarget,
                role: Role,
            }}
            placeholder="Ketik Pesan ..."
            onLongPress={(context, message)=> CekChatDitekan(context, message)}
        />
    </View>
  )
}

export default RoomDiskusiPakar

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