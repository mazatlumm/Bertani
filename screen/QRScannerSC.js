import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function QRScannerSC({navigation, route}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [IDController, setIDController] = useState('');
    const [IDUser, setIDUser] = useState('');
    const [IDDevice, setIDDevice] = useState('');
    const [NamaPerangkat, setNamaPerangkat] = useState('');
    const [JenisTanaman, setJenisTanaman] = useState('');
    const [HumMin, setHumMin] = useState('');
    const [HumMax, setHumMax] = useState('');
    const [DataKanal1, setDataKanal1] = useState('');
    const [DataKanal2, setDataKanal2] = useState('');
    const [DataKanal3, setDataKanal3] = useState('');
    const [DataKanal4, setDataKanal4] = useState('');
    const [Lokasi, setLokasi] = useState('');

  const AmbilDataRoute = () => {
    console.log(route.params);
    if(route.params != undefined){
        setIDController(route.params.IDController);
        setIDDevice(route.params.IDDevice);
        setIDUser(route.params.IDUser);
        setNamaPerangkat(route.params.NamaPerangkat);
        setJenisTanaman(route.params.JenisTanaman);
        setHumMin(route.params.HumMin);
        setHumMax(route.params.HumMax);
        setDataKanal1(route.params.DataKanal1);
        setDataKanal2(route.params.DataKanal2);
        setDataKanal3(route.params.DataKanal3);
        setDataKanal4(route.params.DataKanal4);
        setLokasi(route.params.Lokasi);
    }
}

  useEffect(() => {
    AmbilDataRoute();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIDDevice(data);
    navigation.navigate('SettingController', {
        IDController:IDController,
        IDDevice:data,
        IDUser:IDUser,
        NamaPerangkat:NamaPerangkat,
        JenisTanaman:JenisTanaman,
        HumMin:HumMin,
        HumMax:HumMax,
        DataKanal1:DataKanal1,
        DataKanal2:DataKanal2,
        DataKanal3:DataKanal3,
        DataKanal4:DataKanal4,
        Lokasi:Lokasi,
        ScreenName:'DetailController',
    });
  };

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
});