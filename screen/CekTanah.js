//Belum Selesai Ganti Parsing Data Dari alat / server

import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Platform, Alert, Modal, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import TopBar from './TopBar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';

import plantGrow from '../assets/images/plantGrow.png'
import IconSmile from '../assets/images/IconSmile.png'
import iconLove from '../assets/images/iconLove.png'
import Angin from '../assets/images/Angin.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Icon
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

let KalibrasiNitrogen = 0;
let KalibrasiKalium = 0;
let KalibrasiPhosporus = 0;
let KalibrasiSuhu = 0;
let KalibrasiKelembaban = 0;
let KalibrasiPH = 0;
let KalibrasiKonduktifitas = 0;
let KalibrasiSalinitas = 0;
let KalibrasiTDS = 0;

const CekTanah = ({navigation, route}) => {
    const [URL, setURL] = useState('https://alicestech.com/kelasbertani/');
    const [currentDate, setCurrentDate] = useState('');
    const [TimeClock, setTimeClock] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('ID DEVICE');
    const [StatusDevice, setStatusDevice] = useState('Tidak Terhubung');
    const [Nitrogen, setNitrogen] = useState('');
    const [Phospor, setPhospor] = useState('');
    const [Kalium, setKalium] = useState('');
    const [Suhu, setSuhu] = useState('');
    const [Kelembaban, setKelembaban] = useState('');
    const [PH, setPH] = useState('');
    const [Mikroorganisme, setMikroorganisme] = useState('');
    const [Salinitas, setSalinitas] = useState('');
    const [TDS, setTDS] = useState('');
    const [NitrogenMax, setNitrogenMax] = useState('');
    const [PhosporusMax, setPhosporusMax] = useState('');
    const [KaliumMax, setKaliumMax] = useState('');
    const [SuhuMax, setSuhuMax] = useState('');
    const [KelembabanMax, setKelembabanMax] = useState('');
    const [PHMax, setPHMax] = useState('');
    const [KonduktifitasMax, setKonduktifitasMax] = useState('');
    const [SalinitasMax, setSalinitasMax] = useState('');
    const [TDSMax, setTDSMax] = useState('');
    const [NitrogenMin, setNitrogenMin] = useState('');
    const [PhosporusMin, setPhosporusMin] = useState('');
    const [KaliumMin, setKaliumMin] = useState('');
    const [SuhuMin, setSuhuMin] = useState('');
    const [KelembabanMin, setKelembabanMin] = useState('');
    const [PHMin, setPHMin] = useState('');
    const [KonduktifitasMin, setKonduktifitasMin] = useState('');
    const [SalinitasMin, setSalinitasMin] = useState('');
    const [TDSMin, setTDSMin] = useState('');
    const [NitrogenPesan, setNitrogenPesan] = useState('');
    const [PhosporusPesan, setPhosporusPesan] = useState('');
    const [KaliumPesan, setKaliumPesan] = useState('');
    const [SuhuPesan, setSuhuPesan] = useState('');
    const [KelembabanPesan, setKelembabanPesan] = useState('');
    const [PHPesan, setPHPesan] = useState('');
    const [KonduktifitasPesan, setKonduktifitasPesan] = useState('');
    const [SalinitasPesan, setSalinitasPesan] = useState('');
    const [TDSPesan, setTDSPesan] = useState('');
    const [NitrogenKurang, setNitrogenKurang] = useState('');
    const [NitrogenSesuai, setNitrogenSesuai] = useState('');
    const [NitrogenBerlebih, setNitrogenBerlebih] = useState('');
    const [PhosporusKurang, setPhosporusKurang] = useState('');
    const [PhosporusSesuai, setPhosporusSesuai] = useState('');
    const [PhosporusBerlebih, setPhosporusBerlebih] = useState('');
    const [KaliumKurang, setKaliumKurang] = useState('');
    const [KaliumSesuai, setKaliumSesuai] = useState('');
    const [KaliumBerlebih, setKaliumBerlebih] = useState('');
    const [SuhuKurang, setSuhuKurang] = useState('');
    const [SuhuSesuai, setSuhuSesuai] = useState('');
    const [SuhuBerlebih, setSuhuBerlebih] = useState('');
    const [KelembabanKurang, setKelembabanKurang] = useState('');
    const [KelembabanSesuai, setKelembabanSesuai] = useState('');
    const [KelembabanBerlebih, setKelembabanBerlebih] = useState('');
    const [PHKurang, setPHKurang] = useState('');
    const [PHSesuai, setPHSesuai] = useState('');
    const [PHBerlebih, setPHBerlebih] = useState('');
    const [KonduktifitasKurang, setKonduktifitasKurang] = useState('');
    const [KonduktifitasSesuai, setKonduktifitasSesuai] = useState('');
    const [KonduktifitasBerlebih, setKonduktifitasBerlebih] = useState('');
    const [SalinitasKurang, setSalinitasKurang] = useState('');
    const [SalinitasSesuai, setSalinitasSesuai] = useState('');
    const [SalinitasBerlebih, setSalinitasBerlebih] = useState('');
    const [TDSKurang, setTDSKurang] = useState('');
    const [TDSSesuai, setTDSSesuai] = useState('');
    const [TDSBerlebih, setTDSBerlebih] = useState('');
    const [ColorConnected, setColorConnected] = useState('red');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [Latitude, setLatitude] = useState(null);
    const [Longitude, setLongitude] = useState(null);
    const [LoveColor, setLoveColor] = useState('grey');
    const [ArrayFavourite, setArrayFavourite] = useState([]);
    const [modalVisibleFavourite, setmodalVisibleFavourite] = useState(false);
    const [NamaKomoditas, setNamaKomoditas] = useState('');
    const [KeteranganLainnya, setKeteranganLainnya] = useState('');

    // Get Standard Tanah dari Server
    const GetStandardTanah = async () => {
        await axios.get(URL + 'api/standard_kualitas_tanah')
          .then(response => {
            if(response.data.status == true){
                const DataResult = response.data.result[0];
                SimpanStandardTanahLocal(DataResult);
            }
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    // Menyimpan Standard Tanah ke Async Storage
    const SimpanStandardTanahLocal = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@StandardTanah', jsonValue)
          console.log('Simpan Standard Tanah Ke Local Storage')
        } catch (e) {
          // saving error
        }
    }

    // Cek Standard Tanah di Local Storage
    const CekStandardTanahLocal = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@StandardTanah')
            const ParsingDataTanah = JSON.parse(jsonValue);
            console.log('Standard Tanah Local Data : ')
            console.log(ParsingDataTanah);
            setNitrogenMin(ParsingDataTanah.nitrogen);
            setNitrogenMax(ParsingDataTanah.nitrogen_max);
            setNitrogenKurang(ParsingDataTanah.nitrogen_kurang);
            setNitrogenSesuai(ParsingDataTanah.nitrogen_sesuai);
            setNitrogenBerlebih(ParsingDataTanah.nitrogen_berlebih);

            setPhosporusMin(ParsingDataTanah.phosporus);
            setPhosporusMax(ParsingDataTanah.phosporus_max);
            setPhosporusKurang(ParsingDataTanah.phosporus_kurang);
            setPhosporusSesuai(ParsingDataTanah.phosporus_sesuai);
            setPhosporusBerlebih(ParsingDataTanah.phosporus_berlebih);

            setKaliumMin(ParsingDataTanah.kalium);
            setKaliumMax(ParsingDataTanah.kalium_max);
            setKaliumKurang(ParsingDataTanah.kalium_kurang);
            setKaliumSesuai(ParsingDataTanah.kalium_sesuai);
            setKaliumBerlebih(ParsingDataTanah.kalium_berlebih);

            setSuhuMin(ParsingDataTanah.suhu);
            setSuhuMax(ParsingDataTanah.suhu_max);
            setSuhuKurang(ParsingDataTanah.suhu_kurang);
            setSuhuSesuai(ParsingDataTanah.suhu_sesuai);
            setSuhuBerlebih(ParsingDataTanah.suhu_berlebih);
           
            setKelembabanMin(ParsingDataTanah.kelembaban);
            setKelembabanMax(ParsingDataTanah.kelembaban_max);
            setKelembabanKurang(ParsingDataTanah.kelembaban_kurang);
            setKelembabanSesuai(ParsingDataTanah.kelembaban_sesuai);
            setKelembabanBerlebih(ParsingDataTanah.kelembaban_berlebih);
            
            setPHMin(ParsingDataTanah.ph);
            setPHMax(ParsingDataTanah.ph_max);
            setPHKurang(ParsingDataTanah.ph_kurang);
            setPHSesuai(ParsingDataTanah.ph_sesuai);
            setPHBerlebih(ParsingDataTanah.ph_berlebih);
            
            setKonduktifitasMin(ParsingDataTanah.konduktifitas);
            setKonduktifitasMax(ParsingDataTanah.konduktifitas_max);
            setKonduktifitasKurang(ParsingDataTanah.konduktifitas_kurang);
            setKonduktifitasSesuai(ParsingDataTanah.konduktifitas_sesuai);
            setKonduktifitasBerlebih(ParsingDataTanah.konduktifitas_berlebih);
            
            setSalinitasMin(ParsingDataTanah.salinitas);
            setSalinitasMax(ParsingDataTanah.salinitas_max);
            setSalinitasKurang(ParsingDataTanah.salinitas_kurang);
            setSalinitasSesuai(ParsingDataTanah.salinitas_sesuai);
            setSalinitasBerlebih(ParsingDataTanah.salinitas_berlebih);
            
            setTDSMin(ParsingDataTanah.tds);
            setTDSMax(ParsingDataTanah.tds_max);
            setTDSKurang(ParsingDataTanah.tds_kurang);
            setTDSSesuai(ParsingDataTanah.tds_sesuai);
            setTDSBerlebih(ParsingDataTanah.tds_berlebih);
        } catch(e) {
            // error reading value
        }
    }

    const CekLocation = () => {
        (async () => {
            if (Platform.OS === 'android' && !Constants.isDevice) {
              setErrorMsg(
                'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
              );
              return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          })();
    }

    const CekAsynFavourite =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@TanahFavourite')
        const ParsingDataTanah = JSON.parse(jsonValue);
        // console.log(jsonValue)
        // console.log(ParsingDataTanah)
        if(ParsingDataTanah == null){
            setArrayFavourite([]);
        }else{
            setArrayFavourite(ParsingDataTanah);
        }
        } catch(e) {
        // error reading value
        }
    }

    const ReadyPushFavourite = [{
        id_user : IDUser,
        id_device : IDDevice,
        komoditas : NamaKomoditas,
        keterangan : KeteranganLainnya,
        nitrogen : Nitrogen,
        phospor : Phospor,
        kalium : Kalium,
        suhu : Suhu,
        kelembaban : Kelembaban,
        ph : PH,
        mikroorganisme : Mikroorganisme,
        salinitas : Salinitas,
        tds : TDS,
        get_time : currentDate,
        latitude : Latitude,
        longitude : Longitude,
    }];

    const PrepareSaveFavourite = () => {
        setmodalVisibleFavourite(true);
    }

    const CekDataFavourite = () => {
        if(StatusDevice == 'Terhubung'){
            CekTime();
            SaveFavourite();
            console.log(ArrayFavourite);
            SimpanDataTanah(ArrayFavourite);
            setmodalVisibleFavourite(false);
            Alert.alert('Berhasil', 'Data pengukuran kualitas tanah berhasil disimpan, Anda dapat menguploadnya ketika sudah online')
            setLoveColor('grey');
        }else{
            Alert.alert('Gagal', 'Anda belum menghubungkan perangkat IoT ke aplikasi!');
        }
    }

    const SimpanDataTanah = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@TanahFavourite', jsonValue)
            console.log('Simpan Data Tanah Berhasil')
        } catch (e) {
            // saving error
        }
    }

    const SaveFavourite = () => {
        ArrayFavourite.push(ReadyPushFavourite);
        setLoveColor('red');
    }


    const LihatDataUser =  async() => {
        try {
        const jsonValue = await AsyncStorage.getItem('@DataUser')
        const ParsingDataUser = JSON.parse(jsonValue);
        setIDUser(ParsingDataUser[0].id_user); 
        } catch(e) {
        // error reading value
        }
    }

    const AmbilDataRoute = () => {
        if(route.params != undefined){
            let id_device = route.params.IDDevice;
            setIDDevice(id_device);
            AmbilDataDevice(id_device);
        }
    }

    const AmbilDataDevice = (id_device) => {
        // Mencari Lokasi
        CekLocation();
        let text = 'Waiting..';
        if (errorMsg) {
            text = errorMsg;
        } else if (location) {
            text = JSON.stringify(location);
            const ParseDataLocation = JSON.parse(text);
            setLatitude(ParseDataLocation.coords.latitude);
            setLongitude(ParseDataLocation.coords.longitude);
            // console.log(ParseDataLocation.coords.latitude)
            // console.log(ParseDataLocation.coords.longitude)
        }

        setLoveColor('grey')
        
        // console.log('Ambil Data Dari Device')
        var myHeaders = new Headers();

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://alicestech.com/kelasbertani/api/cek_tanah/tes_alat?id_device="+IDDevice, requestOptions)
        // fetch("http://192.168.2.1/getData", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
            if(result.status == true){
                setStatusDevice('Terhubung');
                setColorConnected('#0D986A');
                // for online Data
                setIDDevice(result.result[0].id_device);
                let NilaiNitrogen = parseInt(result.result[0].nitrogen) + parseInt(KalibrasiNitrogen);
                let NilaiPhospor = parseInt(result.result[0].phospor) + parseInt(KalibrasiPhosporus);
                let NilaiKalium = parseInt(result.result[0].kalium) + parseInt(KalibrasiKalium);
                let NilaiSuhu = parseInt(result.result[0].suhu) + parseInt(KalibrasiSuhu);
                let NilaiKelembaban = parseInt(result.result[0].kelembaban) + parseInt(KalibrasiKelembaban);
                let NilaiPH = parseInt(result.result[0].ph) + parseInt(KalibrasiPH);
                let NilaiKonduktifitas = parseInt(result.result[0].mikroorganisme) + parseInt(KalibrasiKonduktifitas);
                let NilaiSalinitas = parseInt(result.result[0].salinitas) + parseInt(KalibrasiSalinitas);
                let NilaiTDS = parseInt(result.result[0].tds) + parseInt(KalibrasiTDS);

                // for local data device
                // setIDDevice(result.result.id_device);
                // let NilaiNitrogen = parseInt(result.result.nitrogen) + parseInt(KalibrasiNitrogen);
                // let NilaiPhospor = parseInt(result.result.phospor) + parseInt(KalibrasiPhosporus);
                // let NilaiKalium = parseInt(result.result.kalium) + parseInt(KalibrasiKalium);
                // let NilaiSuhu = parseInt(result.result.suhu) + parseInt(KalibrasiSuhu);
                // let NilaiKelembaban = parseInt(result.result.kelembaban) + parseInt(KalibrasiKelembaban);
                // let NilaiPH = parseInt(result.result.ph) + parseInt(KalibrasiPH);
                // let NilaiKonduktifitas = parseInt(result.result.mikroorganisme) + parseInt(KalibrasiKonduktifitas);
                // let NilaiSalinitas = parseInt(result.result.salinitas) + parseInt(KalibrasiSalinitas);
                // let NilaiTDS = parseInt(result.result.tds) + parseInt(KalibrasiTDS);

                if(NilaiNitrogen < 0){
                    setNitrogen(0);
                    NilaiNitrogen = 0;
                }else{
                    setNitrogen(NilaiNitrogen);
                }

                if(NilaiPhospor < 0){
                    setPhospor(0);
                    NilaiPhospor = 0
                }else{
                    setPhospor(NilaiPhospor);
                }

                if(NilaiKalium < 0){
                    setKalium(0);
                    NilaiKalium = 0;
                }else{
                    setKalium(NilaiKalium);
                }

                if(NilaiSuhu < 0){
                    setSuhu(0);
                    NilaiSuhu = 0;
                }else{
                    setSuhu(NilaiSuhu);
                }

                if(NilaiKelembaban < 0){
                    setKelembaban(0);
                    NilaiKelembaban = 0;
                }else{
                    setKelembaban(NilaiKelembaban);
                }

                if(NilaiPH < 0){
                    setPH(0);
                    NilaiPH = 0;
                }else{
                    setPH(NilaiPH);
                }

                if(NilaiKonduktifitas < 0){
                    setMikroorganisme(0);
                    NilaiKonduktifitas = 0;
                }else{
                    setMikroorganisme(NilaiKonduktifitas);
                }

                if(NilaiSalinitas < 0){
                    setSalinitas(0);
                    NilaiSalinitas = 0;
                }else{
                    setSalinitas(NilaiSalinitas);
                }

                if(NilaiTDS < 0){
                    setTDS(0);
                    NilaiTDS = 0;
                }else{
                    setTDS(NilaiTDS);
                }
                CekTime();
                console.log('success');
                AnalisaKualitasTanah(NilaiNitrogen, NilaiPhospor, NilaiKalium, NilaiSuhu, NilaiKelembaban, NilaiPH, NilaiKonduktifitas, NilaiSalinitas, NilaiTDS);
            }
            if(result.status == false){
                setStatusDevice('Tidak Terhubung');
                setColorConnected('red');
                console.log('failed');
                // Alert.alert('Tidak Terhubung', 'Silahkan Scan Kembali Perangkat Anda')
            }
        })
        .catch(error => console.log('error', error));
    }

    const AnalisaKualitasTanah = (NilaiNitrogen, NilaiPhospor, NilaiKalium, NilaiSuhu, NilaiKelembaban, NilaiPH, NilaiKonduktifitas, NilaiSalinitas, NilaiTDS) => {
        // Nitrogen
        if(NilaiNitrogen >= NitrogenMin && NilaiNitrogen <= NitrogenMax){
            setNitrogenPesan(NitrogenSesuai);
            console.log(NitrogenSesuai)
        }
        if(NilaiNitrogen < NitrogenMin){
            setNitrogenPesan(NitrogenKurang);
            console.log(NitrogenKurang)
        }
        if(NilaiNitrogen > NitrogenMax){
            setNitrogenPesan(NitrogenBerlebih);
            console.log(NitrogenBerlebih)
        }
        
        // Phosporus
        if(NilaiPhospor >= PhosporusMin && NilaiPhospor <= PhosporusMax){
            setPhosporusPesan(PhosporusSesuai);
            console.log(PhosporusSesuai)
        }
        if(NilaiPhospor < PhosporusMin){
            setPhosporusPesan(PhosporusKurang);
            console.log(PhosporusKurang)
        }
        if(NilaiPhospor > PhosporusMax){
            setPhosporusPesan(PhosporusBerlebih);
            console.log(PhosporusBerlebih)
        }
        
        // Kalium
        if(NilaiKalium >= KaliumMin && NilaiKalium <= KaliumMax){
            setKaliumPesan(KaliumSesuai);
            console.log(KaliumSesuai)
        }
        if(NilaiKalium < KaliumMin){
            setKaliumPesan(KaliumKurang);
            console.log(KaliumKurang)
        }
        if(NilaiKalium > KaliumMax){
            setKaliumPesan(KaliumBerlebih);
            console.log(KaliumBerlebih)
        }
        
        // Suhu
        if(NilaiSuhu >= SuhuMin && NilaiSuhu <= SuhuMax){
            setSuhuPesan(SuhuSesuai);
            console.log(SuhuSesuai)
        }
        if(NilaiSuhu < SuhuMin){
            setSuhuPesan(SuhuKurang);
            console.log(SuhuKurang)
        }
        if(NilaiSuhu > SuhuMax){
            setSuhuPesan(SuhuBerlebih);
            console.log(SuhuBerlebih)
        }
        
        // Kelembaban
        if(NilaiKelembaban >= KelembabanMin && NilaiKelembaban <= KelembabanMax){
            setKelembabanPesan(KelembabanSesuai);
            console.log(KelembabanSesuai)
        }
        if(NilaiKelembaban < KelembabanMin){
            setKelembabanPesan(KelembabanKurang);
            console.log(KelembabanKurang)
        }
        if(NilaiKelembaban > KelembabanMax){
            setKelembabanPesan(KelembabanBerlebih);
            console.log(KelembabanBerlebih)
        }

        // PH
        if(NilaiPH >= PHMin && NilaiPH <= PHMax){
            setPHPesan(PHSesuai);
            console.log(PHSesuai)
        }
        if(NilaiPH < PHMin){
            setPHPesan(PHKurang);
            console.log(PHKurang)
        }
        if(NilaiPH > PHMax){
            setPHPesan(PHBerlebih);
            console.log(PHBerlebih)
        }
        
        // Konduktifitas
        if(NilaiKonduktifitas >= KonduktifitasMin && NilaiKonduktifitas <= KonduktifitasMax){
            setKonduktifitasPesan(KonduktifitasSesuai);
            console.log(KonduktifitasSesuai)
        }
        if(NilaiKonduktifitas < KonduktifitasMin){
            setKonduktifitasPesan(KonduktifitasKurang);
            console.log(KonduktifitasKurang)
        }
        if(NilaiKonduktifitas > KonduktifitasMax){
            setKonduktifitasPesan(KonduktifitasBerlebih);
            console.log(KonduktifitasBerlebih)
        }
        
        // Salinitas
        if(NilaiSalinitas >= SalinitasMin && NilaiSalinitas <= SalinitasMax){
            setSalinitasPesan(SalinitasSesuai);
            console.log(SalinitasSesuai)
        }
        if(NilaiSalinitas < SalinitasMin){
            setSalinitasPesan(SalinitasKurang);
            console.log(SalinitasKurang)
        }
        if(NilaiSalinitas > SalinitasMax){
            setSalinitasPesan(SalinitasBerlebih);
            console.log(SalinitasBerlebih)
        }
        
        // TDS
        if(NilaiTDS >= TDSMin && NilaiTDS <= TDSMax){
            setTDSPesan(TDSSesuai);
            console.log(TDSSesuai)
        }
        if(NilaiTDS < TDSMin){
            setTDSPesan(TDSKurang);
            console.log(TDSKurang)
        }
        if(NilaiTDS > TDSMax){
            setTDSPesan(TDSBerlebih);
            console.log(TDSBerlebih)
        }
    }

    const CekTime = () => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
          year + '-' + month + '-' + date 
          + ' ' + hours + ':' + min + ':' + sec
        );
        setTimeClock(hours + ':' + min + ':' + sec);
    }

    const MovePage = (ScreenName) => {
        if(StatusDevice == 'Terhubung'){
            Alert.alert(
                "Apakah Anda Ingin Memutus Perangkat?",
                "Tekan lanjutkan jika Anda ingin meninggalkan halaman ini",
                [
                  {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Lanjutkan", onPress: () => {
                        setIDDevice('ID DEVICE');
                        setStatusDevice('Tidak Terhubung');
                        setColorConnected('red');
                        if(ScreenName == 'DaftarController'){
                            setTimeout(() => {
                                navigation.navigate(ScreenName, {IDUser:IDUser});
                            }, 1000);
                        }else{
                            setTimeout(() => {
                                navigation.navigate(ScreenName);
                            }, 1000);
                        }
                  }}
                ]
            );
        }else{
            if(ScreenName == 'DaftarController'){
                navigation.navigate(ScreenName, {IDUser:IDUser});
            }else{
                navigation.navigate(ScreenName);
            }
        }
    }

    const CekKalibrasiTersimpan =  async() => {
        try {
            const jsonValue = await AsyncStorage.getItem('@Kalibrasi' + IDDevice)
            const KalibrasiSensor = JSON.parse(jsonValue);
            // console.log(jsonValue)
            // console.log(KalibrasiSensor)
            if(KalibrasiSensor == null){
            }else{
                KalibrasiNitrogen = KalibrasiSensor[0].nitrogen
                KalibrasiPhosporus = KalibrasiSensor[0].phosporus
                KalibrasiKalium = KalibrasiSensor[0].kalium
                KalibrasiSuhu = KalibrasiSensor[0].suhu
                KalibrasiKelembaban = KalibrasiSensor[0].kelembaban
                KalibrasiPH = KalibrasiSensor[0].ph
                KalibrasiKonduktifitas = KalibrasiSensor[0].konduktifitas
                KalibrasiSalinitas = KalibrasiSensor[0].salinitas
                KalibrasiTDS = KalibrasiSensor[0].tds
            }
        } catch(e) {
        // error reading value
        }
    }


    const isFocused = useIsFocused();
    useEffect(() => {
        GetStandardTanah();
        CekKalibrasiTersimpan();
        LihatDataUser();
        AmbilDataRoute();
        CekTime();
        CekLocation();
        CekAsynFavourite();
        CekStandardTanahLocal();
      }, [isFocused]);

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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'#0D986A'}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleFavourite}
            onRequestClose={() => {
            setmodalVisibleFavourite(!modalVisibleFavourite);
            }}>
            <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(243, 243, 243, 0.8)'}}>
                <View style={{backgroundColor:'white', borderRadius:10, width:'90%', alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:20, marginBottom:15}}>Buat Keterangan</Text>
                    <TouchableOpacity style={{position:'absolute', top:10, right:5}} onPress={()=> setmodalVisibleFavourite(false)}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={{paddingHorizontal:20, width:'100%', marginBottom:20}}>
                        <View style={styles.BoxInput}>
                            <TextInput 
                            placeholder='Nama Komoditas'
                            style={styles.TextInput}
                            onChangeText={NamaKomoditas => setNamaKomoditas(NamaKomoditas)}
                            defaultValue={NamaKomoditas}
                            />
                        </View>
                        <View style={styles.BoxInput}>
                            <TextInput 
                            placeholder='Keterangan Lainnya ...'
                            multiline={true}
                            numberOfLines={4}
                            style={styles.TextInput}
                            onChangeText={KeteranganLainnya => setKeteranganLainnya(KeteranganLainnya)}
                            defaultValue={KeteranganLainnya}
                            />
                        </View>
                        <TouchableOpacity style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#0D986A', borderRadius:20}} onPress={()=>CekDataFavourite()}>
                            <Text style={{fontFamily:'Poppins-Bold', fontSize:12, color:'white'}}>Simpan Hasil Pengukuran</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
        <ScrollView style={styles.ScrollViewSet}>
            {/* Top Bar */}
            <TopBar />
            <View style={styles.JajarGenjang}></View>
            <Image source={Angin} style={{position:'absolute', width:windowWidth, resizeMode:'contain', top:0, left:0}} />
            <View style={{paddingHorizontal:20, position:'relative', height:300}}>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Nama Perangkat</Text>
                <Text style={{fontFamily:'Philosopher-Bold', fontSize:24, marginTop:5}}>{IDDevice}</Text>
                <TouchableOpacity style={{backgroundColor:'white', paddingVertical:5, paddingHorizontal:10, borderRadius:10, position:'absolute', top:10, right:20 }} onPress={()=> navigation.navigate('KalibrasiKualitasTanah', {id_device:IDDevice})}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#0D986A', fontSize:12}}>Kalibrasi</Text>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:40}}>STATUS</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>{StatusDevice}</Text>
                <Text style={{fontFamily:'Poppins-Regular', fontSize:12, marginTop:10}}>LAST UPDATE</Text>
                <Text style={{fontFamily:'Poppins-Bold', fontSize:14, marginTop:0}}>{TimeClock} WIB</Text>
                <Image source={plantGrow} style={{width:200, height:200, position:'absolute', bottom:40, right:20}} />

                <View style={styles.ActionButtonGL}>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:ColorConnected, justifyContent:'center', alignItems:'center', borderRadius:20}} onPress={()=>AmbilDataDevice(IDDevice)}>
                        <Image source={IconSmile} style={{width:28, height:16, resizeMode:'contain'}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:56, height:56, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:20, marginLeft:10}} onPress={()=>PrepareSaveFavourite()}>
                        <AntDesign name="heart" size={24} color={LoveColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal:20, marginTop:20}}>
                <Text style={styles.DataSensorText}>Data Sensor</Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Nitrogen} mg/L</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Nitrogen</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Phospor} mg/L</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Phosphorus</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Kalium} mg/L</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kalium</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Suhu} &deg;C</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Suhu</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{Kelembaban}%</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>Kelembaban</Text>
                    </View>
                    <View style={{marginTop:10, flex:2, alignItems:'center'}}>
                        <Text style={styles.NilaiSensor}>{PH}</Text>
                        <Text style={{fontFamily:'Poppins-Regular', color:'black', fontSize:12}}>PH</Text>
                    </View>
                </View>

                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Konduktifitas Mikro Organisme</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Kandungan Mikro Organisme)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'#0D986A'}}>{Mikroorganisme} us/cm</Text>
                    </View>
                </View>
                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Tingkat Salinitas Tanah</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Kadar Garam)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'#0D986A'}}>{Salinitas} %</Text>
                    </View>
                </View>
                <View style={styles.BoxHasilBawah}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>TDS</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>(Total Dissolved Solid)</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <Text style={{fontFamily:'Poppins-Bold', fontSize:18, color:'#0D986A'}}>{TDS} %</Text>
                    </View>
                </View>
                
                <View style={{marginTop:10, flexDirection:'row', marginBottom:20}}>
                    <View style={{flex:3.5}}>
                        <Text style={styles.DataSensorText}>Waktu Pengambilan Data</Text>
                        <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{currentDate}</Text>
                    </View>
                </View>

                {StatusDevice == 'Terhubung' ?
                <View style={{marginBottom:20}}>
                     <Text style={{fontFamily:'Poppins-Bold', fontSize:14, color:'black'}}>Hasil Analisa Kualitas Tanah</Text>
                     {/* Nitrogen */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Nitrogen : {NitrogenMin} - {NitrogenMax} mg/L</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{NitrogenPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Phosporus */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Phosporus : {PhosporusMin} - {PhosporusMax} mg/L</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{PhosporusPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Kalium */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Kalium : {KaliumMin} - {KaliumMax} mg/L</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{KaliumPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Suhu */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Suhu : {SuhuMin}&deg;C - {SuhuMax}&deg;C</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{SuhuPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Kelembaban */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Kelembaban : {KelembabanMin}% - {KelembabanMax}%</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{KelembabanPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* PH */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai PH : {PHMin} - {PHMax}</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{PHPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Konduktifitas */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Konduktifitas : {KonduktifitasMin} - {KonduktifitasMax} us/cm</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{KonduktifitasPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* Salinitas */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai Salinitas : {SalinitasMin}% - {SalinitasMax}%</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{SalinitasPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                     {/* TDS */}
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>Standard Nilai TDS : {TDSMin}% - {TDSMax}%</Text>
                     <Text style={{fontFamily:'Poppins-Regular', fontSize:12}}>{TDSPesan}</Text>
                     <View style={{borderTopWidth:0.5, marginBottom:5}}></View>
                </View>
                :
                <View></View>
                }

                <TouchableOpacity onPress={()=>navigation.navigate('StandardKualitasTanah')} style={{paddingVertical:7, paddingHorizontal:10, borderRadius:10, backgroundColor:'#0D986A', marginBottom:20, alignItems:'center'}}>
                    <Text style={{color:"white", fontFamily:'Poppins-Bold', fontSize:12}}>Standard Kualitas Tanah</Text>
                </TouchableOpacity>
        </View>
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={{position:'absolute', bottom:0, left:0, flexDirection:'row', backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20 , paddingTop:15, paddingBottom:10, justifyContent:'center', alignItems:'center', width:'100%'}}>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('Dashboard')}>
            <Image source={iconHome} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('FavouriteLocalData')}>
            <Image source={iconLove} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('DaftarController')}>
            <SimpleLineIcons name="game-controller" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>MovePage('Profile')}>
            <Image source={iconUser} style={{height:24, width:24, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default CekTanah

const styles = StyleSheet.create({
    JajarGenjang:{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 300,
        borderRightWidth: 0,
        borderBottomWidth: 80,
        borderLeftWidth: windowWidth,
        borderTopColor: '#9CE5CB',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#9CE5CB',
        borderBottomRightRadius:50,
        borderBottomLeftRadius:50,
        position:'absolute', 
        zIndex:-1
    },
    ActionButtonGL:{
        flexDirection:'row',
        ...Platform.select({
        ios:{
            marginTop:70
        },
        android:{
            marginTop:20
        }
        }),
    },
    DataSensorText:{
    ...Platform.select({
            ios:{
                fontFamily:'Poppins-Bold', 
                fontSize:16
            },
            android:{
            fontFamily:'Poppins-Bold', 
            fontSize:14
            }
        })
    },
    NilaiSensor:{
        fontFamily:'Poppins-Bold', 
        color:'#0D986A', 
        ...Platform.select({
            ios:{
                fontSize:20, 
            },
            android:{
                fontSize:14, 
            }
        }),
        margin:0, 
        padding:0
    },
    ButtonSimpanPengukuran:{
        paddingVertical:10, 
        paddingHorizontal:10, 
        borderRadius:10, 
        ...Platform.select({
            ios:{
                marginTop:20
            },
            android:{
                marginTop:10
            }
        }),
        backgroundColor:'#0D986A', 
        alignItems:'center',
        marginBottom:10
    },
    BoxHasilBawah:{
        ...Platform.select({
            ios:{
                marginTop:30
            },
            android:{
                marginTop:20
            }
        }),
        flexDirection:'row'
    },
    ScrollViewSet:{
        ...Platform.select({
            ios:{
                marginBottom:20, 
            },
            android:{
                marginBottom:50, 
            }
        }),
        width:windowWidth, 
        backgroundColor:'white'
    },
    BoxInput:{
        borderBottomWidth:1,
        marginBottom:20,
        flexDirection:'row',
        alignItems:'center',
    },
    TextInput:{
        fontSize:12,
        marginVertical:5,
        flex:5,
        color:'black',
        fontFamily:'Poppins-Regular'
    },      
})