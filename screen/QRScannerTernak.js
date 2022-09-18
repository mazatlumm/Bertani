import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SimpleLineIcons } from '@expo/vector-icons';
import axios from 'axios';


export default function QRScannerTernak({navigation, route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ModalHasilScanTernak, setModalHasilScanTernak] = useState(false);
  const [NamaTernak, setNamaTernak] = useState('');
  const [Kelamin, setKelamin] = useState('');
  const [TanggalKepemilikan, setTanggalKepemilikan] = useState('');
  const [TanggalKawin, setTanggalKawin] = useState('');
  const [UmurKandungan, setUmurKandungan] = useState('');
  const [UmurTernak, setUmurTernak] = useState('');
  const [TanggalMelahirkan, setTanggalMelahirkan] = useState('');
  const [JumlahAnak, setJumlahAnak] = useState('');
  const [Pertumbuhan, setPertumbuhan] = useState('');
  const [Reproduksi, setReproduksi] = useState('');
  const [Kesehatan, setKesehatan] = useState('');
  const [ProduksiSusu, setProduksiSusu] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    GetDataTernak(data);
    console.log(data);
  };

  const GetDataTernak = async(QRCode)=> {
    await axios.get('https://alicestech.com/kelasbertani/api/ternak/detail', {
          params:{
          qrcode:QRCode,
          }
      })
      .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            var DataResult = response.data.result;
            setNamaTernak(DataResult[0].nama_ternak)
            setKelamin(DataResult[0].kelamin)
            setTanggalKepemilikan(DataResult[0].tanggal_kepemilikan)
            setTanggalKawin(DataResult[0].tanggal_kawin)
            setUmurKandungan(DataResult[0].umur_kandungan)
            setUmurTernak(DataResult[0].umur_ternak)
            setTanggalMelahirkan(DataResult[0].tanggal_melahirkan)
            setJumlahAnak(DataResult[0].jumlah_anak)
            setPertumbuhan(DataResult[0].pertumbuhan)
            setReproduksi(DataResult[0].reproduksi)
            setKesehatan(DataResult[0].kesehatan)
            setProduksiSusu(DataResult[0].produksi_susu)

            setModalHasilScanTernak(!ModalHasilScanTernak)
          }
      })
      .catch(e => {
          if (e.response.status === 404) {
          console.log(e.response.data)
          }
      });
  }

  if (hasPermission === null) {
    return (
    <View style={styles.container}>
        <Text style={{fontSize:12, color:'black'}}>Sedang Meminta Izin Akses Kamera...</Text>
    </View>
    );
  }
  if (hasPermission === false) {
    return (
        <View style={styles.container}>
            <Text style={{fontSize:12, color:'black'}}>Akses Kamera Tidak Diizinkan</Text>
        </View>
        );
  }

  return (
    <View style={styles.container}>
      {/* Modal Tambah Kandang */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ModalHasilScanTernak}
        onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalHasilScanTernak(!ModalHasilScanTernak);
        }}
        >
        <View style={{backgroundColor:'rgba(0, 0, 0, 0.3)', flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:20}}>
            <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:20, borderRadius:10, width:'100%', paddingHorizontal:20}}>
              <TouchableOpacity onPress={()=> setModalHasilScanTernak(!ModalHasilScanTernak)} style={{position:'absolute', top:10, right:10, zIndex:10}}>
                  <SimpleLineIcons name="close" size={20} color="black" />
              </TouchableOpacity>
              <View>
                <Text style={styles.TextNormal}>Nama Ternak : {NamaTernak}</Text>
                <Text style={styles.TextNormal}>Kelamin : {Kelamin}</Text>
                <Text style={styles.TextNormal}>Tanggal Kepemilikan : {TanggalKepemilikan}</Text>
                <Text style={styles.TextNormal}>Tanggal Kawin : {TanggalKawin}</Text>
                <Text style={styles.TextNormal}>Umur Kandungan : {UmurKandungan} Tahun</Text>
                <Text style={styles.TextNormal}>Umur Ternak : {UmurTernak} Tahun</Text>
                <Text style={styles.TextNormal}>Tanggal Melahirkan : {TanggalMelahirkan}</Text>
                <Text style={styles.TextNormal}>Jumlah Anak : {JumlahAnak} Ekor</Text>
                <Text style={styles.TextNormal}>Pertumbuhan : {Pertumbuhan}</Text>
                <Text style={styles.TextNormal}>Reproduksi : {Reproduksi}</Text>
                <Text style={styles.TextNormal}>Kesehatan : {Kesehatan}</Text>
                <Text style={styles.TextNormal}>Produksi Susu : {ProduksiSusu} Liter</Text>
              </View>
            </View>
        </View>
      </Modal>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <TouchableOpacity onPress={() => setScanned(false)} style={{backgroundColor:'green', alignItems:'center', justifyContent:'center', width:350, borderRadius:10, paddingHorizontal:10, paddingVertical:5}}><Text style={{color:'white', fontSize:14, fontWeight:'bold'}}>Tekan untuk scan ulang</Text></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center'
  },
  TextNormal:{
    fontFamily:'Inter-Bold', 
    fontSize:12, 
    color:'black'
  }
});