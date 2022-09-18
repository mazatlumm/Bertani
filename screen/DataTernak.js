import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, TextInput, Alert, ToastAndroid, PermissionsAndroid } from 'react-native'
import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import ImageResizer from 'react-native-image-resizer';
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import CameraRoll from "@react-native-community/cameraroll";

// Icon
import { EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))

const DataTernak = ({navigation, route}) => {

    const [ArrTernak, setArrTernak] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [IDTernak, setIDTernak] = useState('');
    const [IDKandang, setIDKandang] = useState('');
    const [ModalFormTernak, setModalFormTernak] = useState(false);
    const [NamaTernak, setNamaTernak] = useState('');
    const [JenisKelaminTernak, setJenisKelaminTernak] = useState('');
    const [TanggalKepemilikan, setTanggalKepemilikan] = useState('Pilih Tanggal');
    const [TanggalKawin, setTanggalKawin] = useState('Pilih Tanggal');
    const [TanggalMelahirkan, setTanggalMelahirkan] = useState('Pilih Tanggal');
    const [JumlahAnak, setJumlahAnak] = useState('0');
    const [UmurKandungan, setUmurKandungan] = useState('0');
    const [UmurTernak, setUmurTernak] = useState('0');
    const [Pertumbuhan, setPertumbuhan] = useState('');
    const [Reproduksi, setReproduksi] = useState('');
    const [Kesehatan, setKesehatan] = useState('');
    const [ProduksiSusu, setProduksiSusu] = useState('0');
    const [FotoTernak, setFotoTernak] = useState('');
    const [WarnaKelaminLaki, setWarnaKelaminLaki] = useState('grey');
    const [WarnaKelaminPer, setWarnaKelaminPer] = useState('grey');
    const [JenisTanggal, setJenisTanggal] = useState('');
    const [OpenDatePicker, setOpenDatePicker] = useState(false);
    const [StartDate, setStartDate] = useState(new Date());
    const [EditDataTernakStat, setEditDataTernakStat] = useState(false);
    const [ModalCekQRCode, setModalCekQRCode] = useState(false);
    const [QRCodeValue, setQRCodeValue] = useState('');
    const [DataQRCode, setDataQRCode] = useState('');

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

    const AmbilDataRoute = () => {
        console.log(route.params);
        if(route.params != undefined){
            setIDKandang(route.params.id_kandang);
            console.log('id_kandang : ' + route.params.id_kandang)
            GetDetailTernak(route.params.id_kandang);
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        AmbilDataRoute();
        LihatDataUser();
    }, [isFocused, IDUser]);

    const pickImage = async (id_ternak) => {
        console.log('id_ternak : ' + id_ternak);
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
                UploadFoto(resizedImage, id_ternak);
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

    const UploadFoto = async (resizedImage, id_ternak) => {
        if(resizedImage != ''){
            var myHeaders = new Headers();
                
            let localUri = resizedImage.uri;
            let filename = localUri.split('/').pop();
          
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            console.log('type image: ' + type);
    
            var formdata = new FormData();
            formdata.append("id_ternak", id_ternak);
            formdata.append("image", { uri: localUri, name: filename, type: type});
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow'
            };
        
            await fetch("https://alicestech.com/kelasbertani/api/ternak/foto", requestOptions)
              .then(response => response.json())
              .then(result => {
                  console.log(result);
                  if(result.status == true){
                      GetDetailTernak()
                  }
              })
              .catch(error => {
                console.log('error')
                GetDetailTernak()
              });
        }
    }

    const UpdateDataTernak = (id_ternak, id_kandang, nama_ternak, kelamin, tanggal_kepemilikan, tanggal_kawin, umur_kandungan, umur_ternak, tanggal_melahirkan, jumlah_anak, foto, pertumbuhan, reproduksi, kesehatan, produksi_susu) => {
        setEditDataTernakStat(true);
        setIDTernak(id_ternak);
        setIDKandang(id_kandang);
        setNamaTernak(nama_ternak);
        setJenisKelaminTernak(kelamin);
        setTanggalKepemilikan(tanggal_kepemilikan);
        setTanggalKawin(tanggal_kawin);
        setUmurKandungan(umur_kandungan);
        setUmurTernak(umur_ternak);
        setTanggalMelahirkan(tanggal_melahirkan);
        setJumlahAnak(jumlah_anak);
        setPertumbuhan(pertumbuhan);
        setReproduksi(reproduksi);
        setKesehatan(kesehatan);
        setProduksiSusu(produksi_susu);
        if(kelamin == 'Jantan'){
            setWarnaKelaminLaki('blue');
            setWarnaKelaminPer('grey');
        }
        if(kelamin == 'Betina'){
            setWarnaKelaminPer('blue');
            setWarnaKelaminLaki('grey');
        }

        setModalFormTernak(!ModalFormTernak);
    }

    const Item = ({nomor_urut, id_ternak, id_kandang, qrcode, nama_ternak, kelamin, tanggal_kepemilikan, tanggal_kawin, umur_kandungan, umur_ternak, tanggal_melahirkan, jumlah_anak, foto, pertumbuhan, reproduksi, kesehatan, produksi_susu}) => (
        <TouchableOpacity onPress={()=>UpdateDataTernak(id_ternak, id_kandang, nama_ternak, kelamin, tanggal_kepemilikan, tanggal_kawin, umur_kandungan, umur_ternak, tanggal_melahirkan, jumlah_anak, foto, pertumbuhan, reproduksi, kesehatan, produksi_susu)} style={styles.CardListKandang}>
          <View style={{flexDirection:'row'}}>
            <View style={{justifyContent:'center', marginRight:10}}>
              <Text style={styles.TextPoppinsBold}>{nomor_urut}</Text>
            </View>
            <View style={{height:'100%', borderLeftWidth:0.5}}></View>
            <View style={{marginLeft:10, flex:1}}>
              <Text style={styles.TextPoppinsBold}>{nama_ternak}</Text>
              <Text style={styles.TextPoppins}>Jenis Kelamin : {kelamin}</Text>
              <Text style={styles.TextPoppins}>Umur : {umur_ternak} Tahun</Text>
              <Text style={styles.TextPoppins}>Jumlah Anak : {jumlah_anak}</Text>
              <TouchableOpacity onPress={()=>CekQRCode(qrcode)} style={{marginRight:50}}>
                <View style={styles.BtnPrimary}>
                    <Text style={styles.TextPoppinsBtn}>QR-Code</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Foto */}
            <View>
                {foto != null ?
                    <TouchableOpacity onPress={()=>pickImage(id_ternak)}>
                        <Image source={{uri:'https://alicestech.com/kelasbertani/upload/ternak/'+foto}} style={{width:100, height:100, borderRadius:20}} resizeMode="contain" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=>pickImage(id_ternak)} style={{backgroundColor:'grey', borderRadius:10, width:100, height:100, alignItems:'center', justifyContent:'center'}}>
                        <SimpleLineIcons name="plus" size={30} color="white" />
                        <View style={{marginTop:5}}></View>
                        <Text style={styles.TextPoppinsBtn}>Foto</Text>
                    </TouchableOpacity>
                }
            </View>
          </View>
        </TouchableOpacity>
      );
    
    const renderItem = ({ item }) => <Item nomor_urut={item.nomor_urut} id_ternak={item.id_ternak} id_kandang={item.id_kandang} qrcode={item.qrcode} nama_ternak={item.nama_ternak} kelamin={item.kelamin} tanggal_kepemilikan={item.tanggal_kepemilikan} tanggal_kawin={item.tanggal_kawin} umur_kandungan={item.umur_kandungan} umur_ternak={item.umur_ternak} tanggal_melahirkan={item.tanggal_melahirkan} jumlah_anak={item.jumlah_anak} foto={item.foto} pertumbuhan={item.pertumbuhan} reproduksi={item.reproduksi} kesehatan={item.kesehatan} produksi_susu={item.produksi_susu}/>;

    const CekQRCode = (qrcode) => {
        console.log(qrcode);
        setQRCodeValue(qrcode)
        setModalCekQRCode(!ModalCekQRCode);
    }

    const hasAndroidPermission = async() => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = 
    await PermissionsAndroid.check(permission);
        if (hasPermission) {
        return true;
        }
        const status = 
        await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const SimpanQRCode = async () => {
        if (Platform.OS === "android" &&
        !(await hasAndroidPermission())) {
            return;
        }
        DataQRCode.toDataURL((data) => {
            // console.log(data)
            let filePath =  RNFS.CachesDirectoryPath+`/tes.png`;
            RNFS.writeFile(filePath, data, 'base64')
            .then((success) => {
                return CameraRoll.save(filePath, 'photo')
            })
            .then(() => {
            ToastAndroid.show('QR-Code Berhasil Disimpan', ToastAndroid.LONG);
            });
        });  
        setModalCekQRCode(!ModalCekQRCode)
    }

    const GetDetailTernak = async () => {
      await axios.get('https://alicestech.com/kelasbertani/api/ternak', {
          params:{
            id_kandang:IDKandang,
          }
      })
      .then(response => {
          console.log('Daftar Ternak :')
          console.log(response.data)
          if(response.data.status == true){
            setArrTernak(response.data.result);
          }
      })
      .catch(e => {
          if (e.response.status === 404) {
          console.log(e.response.data)
          }
      });
    }

    const TambahTernak = () => {
      console.log('Tambah Ternak')
      setModalFormTernak(!ModalFormTernak)
    }
    
    const SimpanTambahTernak = async () => {
      console.log('Simpan Ternak')
      const ParameterUrl = { 
        id_kandang:IDKandang,
        nama_ternak:NamaTernak,
        kelamin:JenisKelaminTernak,
        tanggal_kepemilikan:TanggalKepemilikan,
        tanggal_kawin:TanggalKawin,
        umur_kandungan:UmurKandungan,
        umur_ternak:UmurTernak,
        tanggal_melahirkan:TanggalMelahirkan,
        jumlah_anak:JumlahAnak,
        pertumbuhan:Pertumbuhan,
        reproduksi:Reproduksi,
        kesehatan:Kesehatan,
        produksi_susu:ProduksiSusu,

      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/ternak', ParameterUrl)
      .then(response => {
        console.log('Order Status :')
        console.log(response.data)
        if(response.data.status == true){
          setModalFormTernak(!ModalFormTernak)
          GetDetailTernak();
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
      });
    }
    
    const SimpanPerubahanTernak = async () => {
      console.log('Update Ternak')
      const ParameterUrl = { 
        id_ternak:IDTernak,
        id_kandang:IDKandang,
        nama_ternak:NamaTernak,
        kelamin:JenisKelaminTernak,
        tanggal_kepemilikan:TanggalKepemilikan,
        tanggal_kawin:TanggalKawin,
        umur_kandungan:UmurKandungan,
        umur_ternak:UmurTernak,
        tanggal_melahirkan:TanggalMelahirkan,
        jumlah_anak:JumlahAnak,
        pertumbuhan:Pertumbuhan,
        reproduksi:Reproduksi,
        kesehatan:Kesehatan,
        produksi_susu:ProduksiSusu,
      }
      console.log(ParameterUrl)
      await axios.post('https://alicestech.com/kelasbertani/api/ternak/update', ParameterUrl)
      .then(response => {
        console.log('Order Status :')
        console.log(response.data)
        if(response.data.status == true){
          setModalFormTernak(!ModalFormTernak)
          GetDetailTernak();
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          console.log(e.response.data)
        }
      });
    }

    const PilihKelamin = (jenis_kelamin) => {
        setJenisKelaminTernak(jenis_kelamin);
        if(jenis_kelamin == 'Jantan'){
            setWarnaKelaminLaki('blue');
            setWarnaKelaminPer('grey');
        }
        if(jenis_kelamin == 'Betina'){
            setWarnaKelaminPer('blue');
            setWarnaKelaminLaki('grey');
        }
    }

    const PilihTanggalTernak = (jenis) => {
        setJenisTanggal(jenis);
        setOpenDatePicker(!OpenDatePicker);
    }

    const TutupModalFormTernak = () =>{
        setModalFormTernak(!ModalFormTernak);
        setEditDataTernakStat(!EditDataTernakStat);

        setIDTernak('');
        setNamaTernak('');
        setJenisKelaminTernak('');
        setTanggalKepemilikan('Pilih Tanggal');
        setTanggalKawin('Pilih Tanggal');
        setUmurKandungan('0');
        setUmurTernak('0');
        setTanggalMelahirkan('Pilih Tanggal');
        setJumlahAnak('0');
        setPertumbuhan('');
        setReproduksi('');
        setKesehatan('');
        setProduksiSusu('0');

        setWarnaKelaminLaki('grey');
        setWarnaKelaminPer('grey');
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
        <DatePicker
            modal
            open={OpenDatePicker}
            date={new Date(StartDate)}
            onConfirm={(date) => {
            const Tanggal = new Date(date);
            console.log(moment(Tanggal).format('YYYY-MM-DD H:mm:ss'));
            setOpenDatePicker(!OpenDatePicker);
            if(JenisTanggal == 'kepemilikan'){
                setTanggalKepemilikan(moment(Tanggal).format('YYYY-MM-DD H:mm:ss'))
            }
            if(JenisTanggal == 'kawin'){
                setTanggalKawin(moment(Tanggal).format('YYYY-MM-DD H:mm:ss'))
            }
            if(JenisTanggal == 'melahirkan'){
                setTanggalMelahirkan(moment(Tanggal).format('YYYY-MM-DD H:mm:ss'))
            }
            // console.log(Tanggal);
            }}
            onCancel={() => {
            setOpenDatePicker(!OpenDatePicker)
            }}
            title="Pilih Tanggal"
            mode='datetime'
            locale='id'
            confirmText='Ok'
            cancelText='Batal'
        />
        {/* Modal Ternak */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={ModalFormTernak}
        onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalFormTernak(!ModalFormTernak);
        }}
        >
        <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <ScrollView style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20}}>
              <TouchableOpacity onPress={()=> TutupModalFormTernak()} style={{position:'absolute', top:0, right:0, zIndex:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
              </TouchableOpacity>
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Nama Ternak</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={NamaTernak => setNamaTernak(NamaTernak)}
                        defaultValue={NamaTernak}
                        placeholder='Nama Ternak'
                        />
                    </View>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Pilih Jenis Kelamin</Text>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>PilihKelamin('Jantan')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', backgroundColor:WarnaKelaminLaki}}>
                    <Text style={styles.TextPoppinsBtn}>Jantan</Text>
                    </TouchableOpacity>
                    <View style={{marginHorizontal:5}}></View>
                    <TouchableOpacity onPress={()=>PilihKelamin('Betina')} style={{borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignItems:'center', backgroundColor:WarnaKelaminPer}}>
                    <Text style={styles.TextPoppinsBtn}>Betina</Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Tanggal Kepemilikan</Text>
                <View style={styles.FormInput}>
                    <TouchableOpacity onPress={()=>PilihTanggalTernak('kepemilikan')} style={styles.FormInputBox}>
                        <View style={{marginVertical:5}}>
                            <Text style={styles.TextInputForm}>{TanggalKepemilikan}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Tanggal Kawin</Text>
                <View style={styles.FormInput}>
                    <TouchableOpacity onPress={()=>PilihTanggalTernak('kawin')} style={styles.FormInputBox}>
                        <View style={{marginVertical:5}}>
                            <Text style={styles.TextInputForm}>{TanggalKawin}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Umur Kandungan (bulan)</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={UmurKandungan => setUmurKandungan(UmurKandungan)}
                        defaultValue={UmurKandungan}
                        placeholder='Umur Kandungan'
                        keyboardType='numeric'
                        />
                    </View>
                </View>
                
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Umur Ternak (Tahun)</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={UmurTernak => setUmurTernak(UmurTernak)}
                        defaultValue={UmurTernak}
                        placeholder='Umur Ternak'
                        keyboardType='numeric'
                        />
                    </View>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Tanggal Melahirkan</Text>
                <View style={styles.FormInput}>
                    <TouchableOpacity onPress={()=>PilihTanggalTernak('melahirkan')} style={styles.FormInputBox}>
                        <View style={{marginVertical:5}}>
                            <Text style={styles.TextInputForm}>{TanggalMelahirkan}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Jumlah Anak</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={JumlahAnak => setJumlahAnak(JumlahAnak)}
                        defaultValue={JumlahAnak}
                        placeholder='Jumlah Anak'
                        keyboardType='numeric'
                        />
                    </View>
                </View>

                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Pertumbuhan</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={Pertumbuhan => setPertumbuhan(Pertumbuhan)}
                        defaultValue={Pertumbuhan}
                        placeholder='Pertumbuhan'
                        />
                    </View>
                </View>
                
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Reproduksi</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={Reproduksi => setReproduksi(Reproduksi)}
                        defaultValue={Reproduksi}
                        placeholder='Reproduksi'
                        />
                    </View>
                </View>
                
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Kesehatan</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={Kesehatan => setKesehatan(Kesehatan)}
                        defaultValue={Kesehatan}
                        placeholder='Kesehatan'
                        />
                    </View>
                </View>
                
                <View style={{marginBottom:10}}></View>
                <Text style={styles.TextPoppinsBold}>Produksi Susu (Liter)</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput 
                        style={styles.TextInputForm} 
                        onChangeText={ProduksiSusu => setProduksiSusu(ProduksiSusu)}
                        defaultValue={ProduksiSusu}
                        placeholder='Produksi Susu'
                        />
                    </View>
                </View>

                {EditDataTernakStat != true ? 
                <View>
                    <View style={{marginBottom:10}}></View>
                    <TouchableOpacity onPress={()=>SimpanTambahTernak()} style={styles.BtnPrimary}>
                        <Text style={styles.TextPoppinsBtn}>Simpan Ternak</Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <View style={{marginBottom:10}}></View>
                    <TouchableOpacity onPress={()=>SimpanPerubahanTernak()} style={styles.BtnPrimary}>
                        <Text style={styles.TextPoppinsBtn}>Ubah Data Ternak</Text>
                    </TouchableOpacity>
                </View>
                }
                <View style={{marginBottom:50}}></View>
            </ScrollView>
        </View>
        </Modal>

        {/* Modal QrCode */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={ModalCekQRCode}
        onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalCekQRCode(!ModalCekQRCode);
        }}
        >
        <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={()=> setModalCekQRCode(!ModalCekQRCode)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                    <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.TextPoppinsBold}>QR-Code Ternak</Text>
                <QRCode
                    value={QRCodeValue}
                    size={250}
                    getRef={(c) => setDataQRCode(c)}
                />
                <View style={{marginTop:10}}></View>
                <TouchableOpacity onPress={()=>SimpanQRCode()} style={styles.BtnPrimary}>
                    <Text style={styles.TextPoppinsBtn}>Simpan QR-Code</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Modal>
        {/* Top Bar */}
        <View style={{width:'100%'}}>
            <View style={styles.TopBarBox}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Text style={styles.TopBarText}>Daftar Ternak</Text>
                </View>
            </View>
        </View>
        <View style={styles.ScrollViewBox}>
          {ArrTernak != ''? 
            <FlatList style={{marginHorizontal:10}} data={ArrTernak} renderItem={renderItem} keyExtractor={item => item.id_ternak} scrollEnabled={true} />:
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={styles.TextPoppins}>Data Ternak Kosong!</Text>
            </View>
          }
        </View>
        <TouchableOpacity style={styles.TambahTernakBtn} onPress={()=>TambahTernak()}>
            <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default DataTernak

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
    CardListKandang:{
        width:windowWidth-40,
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
    TambahTernakBtn:{
      width:50,
      height:50,
      borderRadius:50/2,
      backgroundColor:'#0D986A',
      justifyContent:'center',
      alignItems:'center',
      position:'absolute',
      bottom:30,
      right:20
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
    backgroundColor:'green'
  },
  BtnSuccess: {
    paddingVertical:8,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
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
  TextPoppinsBtn:{
    fontFamily:'Poppins-Bold',
    fontSize:12,
    color:'white',
  },
})