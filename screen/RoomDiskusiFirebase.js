import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AvatarIcon from '../assets/images/tanyapakar.png'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyDWbTDPIFtZpKrCpW-SRfYuZEHF2DwQOM8",
    authDomain: "kelasbertanichat.firebaseapp.com",
    projectId: "kelasbertanichat",
    storageBucket: "kelasbertanichat.appspot.com",
    messagingSenderId: "261338527558",
    appId: "1:261338527558:web:bbd81126f6d06f02d59747"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let CountingRender = 0;

const RoomDiskusi = ({navigation, route}) => {
    const [messages, setMessages] = useState([]);
    const [IDUser, setIDUser] = useState([]);
    const [NamaUser, setNamaUser] = useState([]);
    const [FotoUser, setFotoUser] = useState('');
    const [Topik, setTopik] = useState('');

    if(route.params != undefined){
        setTimeout(() => {
            if(CountingRender == 0){
                console.log('Topik Diskusi : ' + route.params.topik.replace(/\s/g, ''));
                var TopikDiskusiSekarang = route.params.topik.replace(/\s/g, '');
                setTopik(TopikDiskusiSekarang);
                CountingRender = 1;
            }
        }, 1000);
    }

    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        console.log(Topik)
        if(Topik != ''){
            fetchDataChat(Topik)
        }
    }, [messages])

    const fetchDataChat = async (topik) => {
        const ChatsCol = collection(db, topik);
        const QueryChats = query(ChatsCol, orderBy("createdAt", 'desc'))
        const ChatsSnapshot = await getDocs(QueryChats);
        // const ChatsList = ChatsSnapshot.docs.map(doc => doc.data());
        const unsubscribe = setMessages(
            ChatsSnapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        )
    }

    useEffect(() => {
        LihatDataUser();
        CountingRender = 0;
    }, [isFocused])

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
      console.log(Topik);
      if(Topik != ''){
          setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
          const {
              _id,
              createdAt,
              text,
              user
          } = messages[0]
          addDoc(collection(db, Topik), {
              _id,
              createdAt,
              text,
              user
            });
      }
  }, [])

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
                <Text style={styles.TitleHeader}>Tanya Pakar</Text>
            </View>
            <View style={styles.UserFotoHeader}>
                {FotoUser != '' ?
                    <Image source={{uri:FotoUser}} style={styles.FotoUser} />
                    : <View></View>
                }
            </View>
        </View>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            showAvatarForEveryMessage={true}
            user={{
                _id: IDUser,
                name: NamaUser,
                avatar: FotoUser,
            }}
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
    }
})