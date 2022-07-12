import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, Modal, ToastAndroid } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { ProgressChart, LineChart } from 'react-native-chart-kit'
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import CatatanKeuanganPic from '../assets/images/CatatanKeuangan.jpg'
import PetaniActivityPic from '../assets/images/petaniactivity.png'
import CatatanUsahaTaniPic from '../assets/images/catatan_usaha_tani.jpg'

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))
const screenWidth = Dimensions.get('window').width;

const CatatanUsahaTani = ({navigation, route}) => {

    const [currentDate, setCurrentDate] = useState('');
    const [ModalCatatan, setModalCatatan] = useState(false);
    const [IDUser, setIDUser] = useState('');
    const [StatusGrafik, setStatusGrafik] = useState('previous');
    const [ArrBulan, setArrBulan] = useState(["Jul", "Agu", "Sep", "Okt", "Nov", "Des"]);
    const [ArrTotalPendapatan, setArrTotalPendapatan] = useState([0,0,0,0,0,0]);
    const [ArrTotalPengeluaran, setArrTotalPengeluaran] = useState([0,0,0,0,0,0]);


    const dataLineChart = {
        labels: ArrBulan,
        datasets: [
          {
            data: ArrTotalPendapatan,
            color: (opacity = 1) => `rgba(0, 185, 35, ${opacity})`,
          },
          {
            data: ArrTotalPengeluaran,
            color: (opacity = 1) => `rgba(207, 40, 40, ${opacity})`,
          }
        ],
        legend: ["Pendapatan", "Pengeluaran"], // optional
    };

    const UpdateCurrentTime = () => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
          date + '/' + month + '/' + year 
          + ' ' + hours + ':' + min + ':' + sec
        );
    }

    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        // console.log(jsonValue)
        setIDUser(ParsingDataUser[0].id_user);
        } catch(e) {
        // error reading value
        }
    }

    const GetGrafikPendapatan = async (status_grafik) => {
        if(IDUser != ''){
          await axios.get('https://alicestech.com/kelasbertani/api/pendapatan/grafik', {
                params: {
                  id_user: IDUser,
                  status: status_grafik,
                }
              })
              .then(response => {
                console.log('data pendapatan : ');
                console.log(response.data.bulan)
                console.log(response.data.total)
                setArrBulan(response.data.bulan)
                setArrTotalPendapatan(response.data.total)
              })
              .catch(e => {
                if (e.response.status === 404) {
                  console.log(e.response.data)
                }
            });
        }
    }
    
    const GetGrafikPengeluaran = (status_grafik) => {
        if(IDUser != ''){
            axios.get('https://alicestech.com/kelasbertani/api/pengeluaran/grafik', {
                params: {
                  id_user: IDUser,
                  status: status_grafik,
                }
              })
              .then(response => {
                console.log('data pengeluaran : ');
                console.log(response.data.bulan)
                console.log(response.data.total)
                setArrBulan(response.data.bulan)
                setArrTotalPengeluaran(response.data.total)
              })
              .catch(e => {
                if (e.response.status === 404) {
                  console.log(e.response.data)
                }
            });
        }
    }

      const isFocused = useIsFocused();
      useEffect(() => {
        LihatDataUser();
        GetGrafikPendapatan(StatusGrafik);
        GetGrafikPengeluaran(StatusGrafik);
      }, [isFocused, IDUser])

      const GantiData = (statusData) =>{
          if(statusData == 1){
                setStatusGrafik('previous');
                GetGrafikPendapatan('previous');
                GetGrafikPengeluaran('previous');
          }else{
                setStatusGrafik('next');
                GetGrafikPendapatan('next');
                GetGrafikPengeluaran('next');
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
         {/* Modal Tambah Catatan */}
         <Modal
            animationType="slide"
            transparent={true}
            visible={ModalCatatan}
            onRequestClose={() => {
              setModalCatatan(!ModalCatatan);
            }}
          >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'flex-end', padding: 10}}>
              <View style={{paddingHorizontal:20, paddingVertical:20, marginHorizontal:20, backgroundColor:'#f7f6f2', borderRadius:10}}>
                <TouchableOpacity onPress={()=> setModalCatatan(!ModalCatatan) } style={{position:'absolute', top:10, right:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginHorizontal:10, width:windowWidth-100}}>
                  <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsCenter}>Apakah Anda ingin membuat catatan pendapatan?</Text>
                  </View>

                  <TouchableOpacity onPress={()=> {
                      navigation.navigate('CatatanPendapatan')
                      setModalCatatan(!ModalCatatan);
                  }} style={styles.BtnSuccess}>
                      <Text style={styles.TextBtnWhite}>Catatan Pendapatan</Text>
                  </TouchableOpacity>
                  
                  <View style={{marginTop:10}}>
                    <Text style={styles.TextPoppinsCenter}>Apakah Anda ingin membuat catatan pengeluaran?</Text>
                  </View>

                  <TouchableOpacity onPress={()=> navigation.navigate('CatatanPengeluaran')} style={styles.BtnDanger}>
                      <Text style={styles.TextBtnWhite}>Catatan Pengeluaran</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </Modal>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%', marginBottom:10}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Pencatatan Usaha Tani</Text>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex:0.5, alignItems:'flex-end'}}>
                        <EvilIcons name="arrow-left" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal:20}}>
                <View style={{marginTop:10}}>
                    <TouchableOpacity>
                        <LineChart
                            data={dataLineChart}
                            yAxisSuffix={" Jt"}
                            width={Dimensions.get('window').width - 50}
                            bezier
                            onDataPointClick={({value}) => {
                                console.log('value:',value)
                                ToastAndroid.showWithGravity(
                                    value + ' Jt',
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER,
                                    ToastAndroid.TOP,
                                );
                            }
                            }
                            height={220}
                            chartConfig={{
                                backgroundColor: 'rgba(0, 185, 35, 0.3)',
                                backgroundGradientFrom: 'rgba(0, 185, 35, 0.3)',
                                backgroundGradientTo: 'white',
                                color: (opacity = 1) => `rgba(41, 41, 41, ${opacity})`,
                                decimalPlaces:0
                            }}
                            style={{borderRadius:15,}}
                        />
                    </TouchableOpacity>

                    {/* Action Button */}
                    <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=> GantiData(1)} style={{borderWidth:0.5, borderRadius:10, paddingHorizontal:10, paddingVertical:5, flex:1, alignItems:'center', marginHorizontal:20}}>
                        <Text style={styles.TextPoppinsKecil}>Januari - Juni</Text>
                    </TouchableOpacity>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.TextPoppinsBold}>-</Text>
                    </View>
                    <TouchableOpacity onPress={()=> GantiData(2)} style={{borderWidth:0.5, borderRadius:10, paddingHorizontal:10, paddingVertical:5, flex:1, alignItems:'center', marginHorizontal:20}}>
                        <Text style={styles.TextPoppinsKecil}>Juli - Desember</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{borderTopWidth:0.2, borderTopColor:'grey', marginHorizontal:20, marginTop:20}}></View>
            <View style={{marginHorizontal:20, marginTop:10}}>
                <Text style={styles.TextPoppinsBold}>Pencatatan Kegiatan Usaha Tani</Text>
                <Text style={styles.TextPoppins}>Masukkan data jenis tanaman, varietas, luas lahan dan kegiatan-kegiatan bertani disertai foto. Anda akan memiliki dokumentasi yang lengkap, hal ini akan membantu Anda untuk menganalisa hasil usaha tani.</Text>
                <View style={{ alignItems:'center'}}>
                    <Image source={CatatanUsahaTaniPic} style={{width:400, height:200}} resizeMode="contain" />

                </View>
                <TouchableOpacity onPress={()=> navigation.navigate('DaftarCatatanKegiatan')} style={styles.BtnSuccess}>
                    <Text style={styles.TextBtnWhite}>Buat Pencatatan Kegiatan!</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal:20, marginTop:10}}>
                <Text style={styles.TextPoppinsBold}>Buat Rencana Kegiatan Usaha Tani</Text>
                <Text style={styles.TextPoppins}>Rencana kegiatan akan membuat usaha Anda dapat berjalan dengan baik, Anda juga bisa mendapatkan notifikasi pada setiap kegiatan yang akan Anda lakukan</Text>
                <View style={{ alignItems:'center'}}>
                    <Image source={PetaniActivityPic} style={{width:400, height:200}} resizeMode="contain" />

                </View>
                <TouchableOpacity onPress={()=> navigation.navigate('AgendaKegiatanTani')} style={styles.BtnSuccess}>
                    <Text style={styles.TextBtnWhite}>Buat Agenda Kegiatan!</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal:20, marginTop:20, marginBottom:10}}>
                <Text style={styles.TextPoppinsBold}>Catat Pengeluaran & Pendapatan Usaha Tani Anda</Text>
                <Text style={styles.TextPoppins}>Kegiatan ini dapat membantu mengidentifikasi masalah keuangan usaha Anda, dan melihat apakah usaha Anda telah mencapai target yang Anda impikan selama ini</Text>
                <View style={{ alignItems:'center'}}>
                    <Image source={CatatanKeuanganPic} style={{width:400, height:200}} resizeMode="contain" />

                </View>
                <TouchableOpacity onPress={()=> setModalCatatan(!ModalCatatan)} style={styles.BtnSuccess}>
                    <Text style={styles.TextBtnWhite}>Tambah Catatan Sekarang!</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CatatanUsahaTani

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
            },
            android:{
            }
        }),
        width:windowWidth, 
        backgroundColor:'white',
        height:windowHeight
    },
    TopBarBox:{
    ...Platform.select({
        ios:{
        marginTop:14,
        },
        android:{
        marginTop:14
        }
    }),
    width:'100%', 
    alignItems:'flex-start', 
    flexDirection:'row',
    alignItems:'center',
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
    marginLeft:10 
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
        fontSize:12,
        color:'black'
    },
    TextPoppinsCenter:{
        fontFamily:'Poppins-Regular',
        fontSize:12,
        color:'black',
        textAlign:'center'
    },
    TextPoppinsKecil:{
        fontFamily:'Poppins-Regular',
        fontSize:10,
        color:'black',
        marginTop:3
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
        marginTop:5,
        marginHorizontal:10,
        marginBottom:10,
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
        width:'90%',
        alignItems:'center'
    },
    BtnDanger:{
        backgroundColor:'#d34539',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
        marginTop:10
    },
    BtnSuccess:{
        backgroundColor:'#30B700',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
        marginTop:10
    },
    TextBtnWhite:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
})