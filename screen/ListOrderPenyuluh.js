import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const ListOrderPenyuluh = ({navigation, route}) => {

    const [ArrOrderStatus, setArrOrderStatus] = useState([]);
    const [IDUser, setIDUser] = useState('');

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

    const isFocused = useIsFocused();
    useEffect(() => {
        LihatDataUser();
        GetStatusOrder('Permintaan');
    }, [isFocused, IDUser]);

    const Item = ({ id_order, id_user_pemesan, id_user_penyuluh, alamat_tujuan, nama_penyuluh, photo_penyuluh, nama_pemesan, created }) => (
        <TouchableOpacity onPress={()=>navigation.navigate('MapPenyuluh', {id_order:id_order})} style={styles.CardListOrder}>
            <Text style={styles.TextPoppins}>Order Penyuluh Dari:</Text>
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
        }
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center'}}>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Order</Text>
                </View>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
            <FlatList style={{marginHorizontal:10}} data={ArrOrderStatus} renderItem={renderItem} keyExtractor={item => item.id_order} scrollEnabled={true} />
        </View>
    </SafeAreaView>
  )
}

export default ListOrderPenyuluh

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