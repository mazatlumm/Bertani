import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QRScanner({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate('SettingController', {IDCntrlPass:data});
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