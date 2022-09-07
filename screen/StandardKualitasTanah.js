import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput, ToastAndroid, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import iconLove from '../assets/images/iconLove.png'
import iconHome from '../assets/images/iconHome.png'
import iconBag from '../assets/images/iconBag.png'
import iconUser from '../assets/images/iconUser.png'

// Icon
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0));
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0));
let CountRender = 0;

const StandardKualitasTanah = ({navigation, route}) => {

    const [URL, setURL] = useState('https://alicestech.com/kelasbertani/');
    const [IDUser, setIDUser] = useState('');
    const [Nitrogen, setNitrogen] = useState('');
    const [Phosporus, setPhosporus] = useState('');
    const [Kalium, setKalium] = useState('');
    const [Suhu, setSuhu] = useState('');
    const [Kelembaban, setKelembaban] = useState('');
    const [PH, setPH] = useState('');
    const [Konduktifitas, setKonduktifitas] = useState('');
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
    const [Rekesa, setRekesa] = useState('');
    const [NamaModal, setNamaModal] = useState('');
    const [StatusStandard, setStatusStandard] = useState('');
    const [ModalRekesa, setModalRekesa] = useState(false);
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
    
    // Get Standard Tanah dari Server
    const GetStandardTanah = async () => {
        await axios.get(URL + 'api/standard_kualitas_tanah')
          .then(response => {
            if(response.data.status == true){
                const DataResult = response.data.result[0];
                setNitrogen(DataResult.nitrogen);
                setNitrogenMax(DataResult.nitrogen_max);
                setNitrogenKurang(DataResult.nitrogen_kurang);
                setNitrogenSesuai(DataResult.nitrogen_sesuai);
                setNitrogenBerlebih(DataResult.nitrogen_berlebih);
                setPhosporus(DataResult.phosporus);
                setPhosporusMax(DataResult.phosporus_max);
                setPhosporusKurang(DataResult.phosporus_kurang);
                setPhosporusSesuai(DataResult.phosporus_sesuai);
                setPhosporusBerlebih(DataResult.phosporus_berlebih);
                setKalium(DataResult.kalium);
                setKaliumMax(DataResult.kalium_max);
                setKaliumKurang(DataResult.kalium_kurang);
                setKaliumSesuai(DataResult.kalium_sesuai);
                setKaliumBerlebih(DataResult.kalium_berlebih);
                setSuhu(DataResult.suhu);
                setSuhuMax(DataResult.suhu_max);
                setSuhuKurang(DataResult.suhu_kurang);
                setSuhuSesuai(DataResult.suhu_sesuai);
                setSuhuBerlebih(DataResult.suhu_berlebih);
                setKelembaban(DataResult.kelembaban);
                setKelembabanMax(DataResult.kelembaban_max);
                setKelembabanKurang(DataResult.kelembaban_kurang);
                setKelembabanSesuai(DataResult.kelembaban_sesuai);
                setKelembabanBerlebih(DataResult.kelembaban_berlebih);
                setPH(DataResult.ph);
                setPHMax(DataResult.ph_max);
                setPHKurang(DataResult.ph_kurang);
                setPHSesuai(DataResult.ph_sesuai);
                setPHBerlebih(DataResult.ph_berlebih);
                setKonduktifitas(DataResult.konduktifitas);
                setKonduktifitasMax(DataResult.konduktifitas_max);
                setKonduktifitasKurang(DataResult.konduktifitas_kurang);
                setKonduktifitasSesuai(DataResult.konduktifitas_sesuai);
                setKonduktifitasBerlebih(DataResult.konduktifitas_berlebih);
                setSalinitas(DataResult.salinitas);
                setSalinitasMax(DataResult.salinitas_max);
                setSalinitasKurang(DataResult.salinitas_kurang);
                setSalinitasSesuai(DataResult.salinitas_sesuai);
                setSalinitasBerlebih(DataResult.salinitas_berlebih);
                setTDS(DataResult.tds);
                setTDSMax(DataResult.tds_max);
                setTDSKurang(DataResult.tds_kurang);
                setTDSSesuai(DataResult.tds_sesuai);
                setTDSBerlebih(DataResult.tds_berlebih);
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

    const isFocused = useIsFocused();
    useEffect(() => {
        console.log('Standard Kualitas Tanah Mulai')
        GetStandardTanah();
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

    //menyimpan standard ke server
    const SimpanStandard = async () => {
        const ParameterUrl = { 
            nitrogen : Nitrogen,
            nitrogen_max : NitrogenMax,
            nitrogen_kurang : NitrogenKurang,
            nitrogen_sesuai : NitrogenSesuai,
            nitrogen_berlebih : NitrogenBerlebih,
            phosporus : Phosporus,
            phosporus_max : PhosporusMax,
            phosporus_kurang : PhosporusKurang,
            phosporus_sesuai : PhosporusSesuai,
            phosporus_berlebih : PhosporusBerlebih,
            kalium : Kalium,
            kalium_max : KaliumMax,
            kalium_kurang : KaliumKurang,
            kalium_sesuai : KaliumSesuai,
            kalium_berlebih : KaliumBerlebih,
            suhu : Suhu,
            suhu_max : SuhuMax,
            suhu_kurang : SuhuKurang,
            suhu_sesuai : SuhuSesuai,
            suhu_berlebih : SuhuBerlebih,
            kelembaban : Kelembaban,
            kelembaban_max : KelembabanMax,
            kelembaban_kurang : KelembabanKurang,
            kelembaban_sesuai : KelembabanSesuai,
            kelembaban_berlebih : KelembabanBerlebih,
            ph : PH,
            ph_max : PHMax,
            ph_kurang : PHKurang,
            ph_sesuai : PHSesuai,
            ph_berlebih : PHBerlebih,
            konduktifitas : Konduktifitas,
            konduktifitas_max : KonduktifitasMax,
            konduktifitas_kurang : KonduktifitasKurang,
            konduktifitas_sesuai : KonduktifitasSesuai,
            konduktifitas_berlebih : KonduktifitasBerlebih,
            salinitas : Salinitas,
            salinitas_max : SalinitasMax,
            salinitas_kurang : SalinitasKurang,
            salinitas_sesuai : SalinitasSesuai,
            salinitas_berlebih : SalinitasBerlebih,
            tds : TDS,
            tds_max : TDSMax,
            tds_kurang : TDSKurang,
            tds_sesuai : TDSSesuai,
            tds_berlebih : TDSBerlebih,
        }
        console.log(ParameterUrl)
        await axios.post(URL + 'api/standard_kualitas_tanah', ParameterUrl)
          .then(response => {
            console.log(response.data)
            GetStandardTanah();
          })
          .catch(e => {
            if (e.response.status === 404) {
              console.log(e.response.data)
            }
        });
    }

    // Standard Pesan
    const StandardPesan = (x) => {
        // Nitrogen
        if(x == 'NK'){
            setNamaModal('Nitrogen');
            setStatusStandard('Kurang')
            setRekesa(NitrogenKurang)
        }
        if(x == 'NS'){
            setNamaModal('Nitrogen');
            setStatusStandard('Sesuai')
            setRekesa(NitrogenSesuai)
        }
        if(x == 'NB'){
            setNamaModal('Nitrogen');
            setStatusStandard('Berlebih')
            setRekesa(NitrogenBerlebih)
        }

        // Phosporus
        if(x == 'PK'){
            setNamaModal('Phosporus');
            setStatusStandard('Kurang')
            setRekesa(PhosporusKurang)
        }
        if(x == 'PS'){
            setNamaModal('Phosporus');
            setStatusStandard('Sesuai')
            setRekesa(PhosporusSesuai)
        }
        if(x == 'PB'){
            setNamaModal('Phosporus');
            setStatusStandard('Berlebih')
            setRekesa(PhosporusBerlebih)
        }
        
        // Kalium
        if(x == 'KK'){
            setNamaModal('Kalium');
            setStatusStandard('Kurang')
            setRekesa(KaliumKurang)
        }
        if(x == 'KS'){
            setNamaModal('Kalium');
            setStatusStandard('Sesuai')
            setRekesa(KaliumSesuai)
        }
        if(x == 'KB'){
            setNamaModal('Kalium');
            setStatusStandard('Berlebih')
            setRekesa(KaliumBerlebih)
        }
        
        // Suhu
        if(x == 'SK'){
            setNamaModal('Suhu');
            setStatusStandard('Kurang')
            setRekesa(SuhuKurang)
        }
        if(x == 'SS'){
            setNamaModal('Suhu');
            setStatusStandard('Sesuai')
            setRekesa(SuhuSesuai)
        }
        if(x == 'SB'){
            setNamaModal('Suhu');
            setStatusStandard('Berlebih')
            setRekesa(SuhuBerlebih)
        }

        // Kelembaban
        if(x == 'KBK'){
            setNamaModal('Kelembaban');
            setStatusStandard('Kurang')
            setRekesa(KelembabanKurang)
        }
        if(x == 'KBS'){
            setNamaModal('Kelembaban');
            setStatusStandard('Sesuai')
            setRekesa(KelembabanSesuai)
        }
        if(x == 'KBB'){
            setNamaModal('Kelembaban');
            setStatusStandard('Berlebih')
            setRekesa(KelembabanBerlebih)
        }
        
        // PH
        if(x == 'PHK'){
            setNamaModal('PH');
            setStatusStandard('Kurang')
            setRekesa(PHKurang)
        }
        if(x == 'PHS'){
            setNamaModal('PH');
            setStatusStandard('Sesuai')
            setRekesa(PHSesuai)
        }
        if(x == 'PHB'){
            setNamaModal('PH');
            setStatusStandard('Berlebih')
            setRekesa(PHBerlebih)
        }
        
        // Konduktifitas
        if(x == 'KNDK'){
            setNamaModal('Konduktifitas');
            setStatusStandard('Kurang')
            setRekesa(KonduktifitasKurang)
        }
        if(x == 'KNDS'){
            setNamaModal('Konduktifitas');
            setStatusStandard('Sesuai')
            setRekesa(KonduktifitasSesuai)
        }
        if(x == 'KNDB'){
            setNamaModal('Konduktifitas');
            setStatusStandard('Berlebih')
            setRekesa(KonduktifitasBerlebih)
        }
        
        // Salinitas
        if(x == 'SLNK'){
            setNamaModal('Salinitas');
            setStatusStandard('Kurang')
            setRekesa(SalinitasKurang)
        }
        if(x == 'SLNS'){
            setNamaModal('Salinitas');
            setStatusStandard('Sesuai')
            setRekesa(SalinitasSesuai)
        }
        if(x == 'SLNB'){
            setNamaModal('Salinitas');
            setStatusStandard('Berlebih')
            setRekesa(SalinitasBerlebih)
        }
        
        // TDS
        if(x == 'TDSK'){
            setNamaModal('TDS');
            setStatusStandard('Kurang')
            setRekesa(TDSKurang)
        }
        if(x == 'TDSS'){
            setNamaModal('TDS');
            setStatusStandard('Sesuai')
            setRekesa(TDSSesuai)
        }
        if(x == 'TDSB'){
            setNamaModal('TDS');
            setStatusStandard('Berlebih')
            setRekesa(TDSBerlebih)
        }

        setModalRekesa(!ModalRekesa);
    }

    // Simpan Sementara Rekomendasi/Kesimpulan/Saran
    const SimpanReksa = () => {
        // Nitrogen
        if(NamaModal == 'Nitrogen' && StatusStandard == 'Kurang'){
            setNitrogenKurang(Rekesa);
        }
        if(NamaModal == 'Nitrogen' && StatusStandard == 'Sesuai'){
            setNitrogenSesuai(Rekesa);
        }
        if(NamaModal == 'Nitrogen' && StatusStandard == 'Berlebih'){
            setNitrogenBerlebih(Rekesa);
        }

        // Phosporus
        if(NamaModal == 'Phosporus' && StatusStandard == 'Kurang'){
            setPhosporusKurang(Rekesa);
        }
        if(NamaModal == 'Phosporus' && StatusStandard == 'Sesuai'){
            setPhosporusSesuai(Rekesa);
        }
        if(NamaModal == 'Phosporus' && StatusStandard == 'Berlebih'){
            setPhosporusBerlebih(Rekesa);
        }
        
        // Kalium
        if(NamaModal == 'Kalium' && StatusStandard == 'Kurang'){
            setKaliumKurang(Rekesa);
        }
        if(NamaModal == 'Kalium' && StatusStandard == 'Sesuai'){
            setKaliumSesuai(Rekesa);
        }
        if(NamaModal == 'Kalium' && StatusStandard == 'Berlebih'){
            setKaliumBerlebih(Rekesa);
        }
        
        // Suhu
        if(NamaModal == 'Suhu' && StatusStandard == 'Kurang'){
            setSuhuKurang(Rekesa);
        }
        if(NamaModal == 'Suhu' && StatusStandard == 'Sesuai'){
            setSuhuSesuai(Rekesa);
        }
        if(NamaModal == 'Suhu' && StatusStandard == 'Berlebih'){
            setSuhuBerlebih(Rekesa);
        }
        
        // Kelembaban
        if(NamaModal == 'Kelembaban' && StatusStandard == 'Kurang'){
            setKelembabanKurang(Rekesa);
        }
        if(NamaModal == 'Kelembaban' && StatusStandard == 'Sesuai'){
            setKelembabanSesuai(Rekesa);
        }
        if(NamaModal == 'Kelembaban' && StatusStandard == 'Berlebih'){
            setKelembabanBerlebih(Rekesa);
        }
        
        // PH
        if(NamaModal == 'PH' && StatusStandard == 'Kurang'){
            setPHKurang(Rekesa);
        }
        if(NamaModal == 'PH' && StatusStandard == 'Sesuai'){
            setPHSesuai(Rekesa);
        }
        if(NamaModal == 'PH' && StatusStandard == 'Berlebih'){
            setPHBerlebih(Rekesa);
        }
        
        // Konduktifitas
        if(NamaModal == 'Konduktifitas' && StatusStandard == 'Kurang'){
            setKonduktifitasKurang(Rekesa);
        }
        if(NamaModal == 'Konduktifitas' && StatusStandard == 'Sesuai'){
            setKonduktifitasSesuai(Rekesa);
        }
        if(NamaModal == 'Konduktifitas' && StatusStandard == 'Berlebih'){
            setKonduktifitasBerlebih(Rekesa);
        }
        
        // Salinitas
        if(NamaModal == 'Salinitas' && StatusStandard == 'Kurang'){
            setSalinitasKurang(Rekesa);
        }
        if(NamaModal == 'Salinitas' && StatusStandard == 'Sesuai'){
            setSalinitasSesuai(Rekesa);
        }
        if(NamaModal == 'Salinitas' && StatusStandard == 'Berlebih'){
            setSalinitasBerlebih(Rekesa);
        }
        
        // TDS
        if(NamaModal == 'TDS' && StatusStandard == 'Kurang'){
            setTDSKurang(Rekesa);
        }
        if(NamaModal == 'TDS' && StatusStandard == 'Sesuai'){
            setTDSSesuai(Rekesa);
        }
        if(NamaModal == 'TDS' && StatusStandard == 'Berlebih'){
            setTDSBerlebih(Rekesa);
        }

        setModalRekesa(!ModalRekesa)
    }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={ModalRekesa}
          onRequestClose={() => {
            setModalRekesa(!ModalRekesa);
          }}
        >
          <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 10, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>

            <View style={{paddingHorizontal:10, paddingVertical:20, marginHorizontal:20, backgroundColor:'white', borderRadius:10,  width:windowWidth, justifyContent:'center'}}>
                <TouchableOpacity onPress={()=> setModalRekesa(!ModalRekesa)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                    <SimpleLineIcons name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={{marginTop:10}}></View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran {NamaModal} {StatusStandard}</Text>
                <View style={styles.FormInput}>
                    <View style={styles.FormInputBox}>
                        <TextInput style={styles.TextInputForm} 
                        onChangeText={Rekesa => setRekesa(Rekesa)}
                        defaultValue={Rekesa}
                        numberOfLines={4}
                        multiline={true}
                        />
                    </View>
                </View>
                <View style={{marginTop:10}}></View>
                <TouchableOpacity onPress={()=>SimpanReksa()} style={styles.BtnSimpanReksa}>
                    <Text style={styles.BtnTitle}>Simpan</Text>
                </TouchableOpacity>
              </View>
        </View>
        </Modal>
        <ScrollView style={styles.ScrollViewBox}>
            <View style={styles.ColorTopBar}></View>
            {/* Top Bar */}
            <View style={{paddingHorizontal:20, width:'100%'}}>
                <View style={styles.TopBarBox}>
                    <View style={{flex:3, justifyContent:'flex-start'}}>
                        <Text style={styles.TopBarText}>Standard Kualitas Tanah</Text>
                    </View>
                    <TouchableOpacity style={{flex:0.5, alignItems:'flex-end'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={{marginHorizontal:20, marginTop:10, marginBottom:10}}>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Nitrogen (mg/L)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Nitrogen => setNitrogen(Nitrogen)}
                            defaultValue={Nitrogen}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={NitrogenMax => setNitrogenMax(NitrogenMax)}
                            defaultValue={NitrogenMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('NK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('NS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('NB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Phosporus (mg/L)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Phosporus => setPhosporus(Phosporus)}
                            defaultValue={Phosporus}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={PhosporusMax => setPhosporusMax(PhosporusMax)}
                            defaultValue={PhosporusMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('PK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('PS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('PB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kalium (mg/L)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Kalium => setKalium(Kalium)}
                            defaultValue={Kalium}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={KaliumMax => setKaliumMax(KaliumMax)}
                            defaultValue={KaliumMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('KK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Suhu (&deg;C)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Suhu => setSuhu(Suhu)}
                            defaultValue={Suhu}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={SuhuMax => setSuhuMax(SuhuMax)}
                            defaultValue={SuhuMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('SK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('SS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('SB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Kelembaban (%)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Kelembaban => setKelembaban(Kelembaban)}
                            defaultValue={Kelembaban}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={KelembabanMax => setKelembabanMax(KelembabanMax)}
                            defaultValue={KelembabanMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('KBK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KBS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KBB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>PH</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={PH => setPH(PH)}
                            defaultValue={PH}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={PHMax => setPHMax(PHMax)}
                            defaultValue={PHMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('PHK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('PHS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('PHB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Konduktifitas (us/cm)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Konduktifitas => setKonduktifitas(Konduktifitas)}
                            defaultValue={Konduktifitas}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={KonduktifitasMax => setKonduktifitasMax(KonduktifitasMax)}
                            defaultValue={KonduktifitasMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('KNDK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KNDS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('KNDB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>Salinitas (%)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={Salinitas => setSalinitas(Salinitas)}
                            defaultValue={Salinitas}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={SalinitasMax => setSalinitasMax(SalinitasMax)}
                            defaultValue={SalinitasMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('SLNK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('SLNS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('SLNB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.FormInput}>
                    <Text style={styles.TextPoppins}>TDS (%)</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Min</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={TDS => setTDS(TDS)}
                            defaultValue={TDS}
                            keyboardType={'number-pad'}
                            placeholder={'Min'}
                            />
                        </View>
                        <View style={{marginHorizontal:10, borderTopWidth:1, width:10}}></View>
                        <View style={styles.FormInputBoxInputLabel}>
                            <Text style={{fontFamily:'Poppins-Regular', fontSize:12, color:'white'}}>Max</Text>
                        </View>
                        <View style={styles.FormInputBoxInput}>
                            <TextInput style={styles.TextInputForm} 
                            onChangeText={TDSMax => setTDSMax(TDSMax)}
                            defaultValue={TDSMax}
                            keyboardType={'number-pad'}
                            placeholder={'Max'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.TextPoppins}>Rekomendasi/Kesimpulan/Saran</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>StandardPesan('TDSK')} style={styles.BtnKurangSesuai}>
                        <Text style={styles.BtnTitle}>Kurang Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('TDSS')} style={styles.BtnSesuai}>
                        <Text style={styles.BtnTitle}>Sesuai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>StandardPesan('TDSB')} style={styles.BtnBerlebih}>
                        <Text style={styles.BtnTitle}>Berlebih</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.BtnBox} onPress={()=> SimpanStandard()}>
                    <Text style={styles.BtnTitle}>Simpan Standard</Text>
                    <MaterialIcons name="save-alt" style={{marginLeft:10}} size={18} color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
        
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

export default StandardKualitasTanah

const styles = StyleSheet.create({
    ScrollViewBox:{
        ...Platform.select({
            ios:{
                marginBottom:0
            },
            android:{
                marginBottom:50
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
        // backgroundColor:'white', 
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
    FormInput:{
        marginTop:10,
        width:'100%'
    },
    FormInputBox:{
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        width:'100%'
    },
    FormInputBoxInput:{
        borderWidth:1,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        flex:1
    },
    FormInputBoxInputLabel:{
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        paddingHorizontal:10,
        paddingVertical:10,
        backgroundColor:'grey'
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
    BtnBox:{
        borderRadius:10,
        backgroundColor:'green',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        flexDirection:'row'
    },
    BtnTitle:{
        fontFamily:'Poppins-Bold',
        fontSize:12,
        color:'white',
    },
    BtnSimpanReksa:{
        borderRadius:10,
        backgroundColor:'green',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    BtnKurangSesuai:{
        borderRadius:10,
        backgroundColor:'orange',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        flex:1
    },
    BtnSesuai:{
        borderRadius:10,
        backgroundColor:'green',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        flex:1,
        marginLeft:5
    },
    BtnBerlebih:{
        borderRadius:10,
        backgroundColor:'red',
        paddingHorizontal:10,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        flex:1,
        marginLeft:5
    },
})