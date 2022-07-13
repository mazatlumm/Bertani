import React, {useEffect} from 'react';
import { Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screen/Dashboard';
import DetailSensor from './screen/DetailSensor';
import Login from './screen/Login';
import CekTanah from './screen/CekTanah';
import DetailController from './screen/DetailController';
import SettingController from './screen/SettingController';
import QRScanner from './screen/QRScanner';
import TambahController from './screen/TambahController';
import Profile from './screen/Profile';
import TambahPengguna from './screen/TambahPengguna';
import UbahProfile from './screen/UbahProfile';
import AIDetectPlant from './screen/AIDetectPlant';
import SplashScreen from './screen/SplashScreen';
import DaftarController from './screen/DaftarController';
import QRScannerSC from './screen/QRScannerSC';
import UbahUserData from './screen/UbahUserData';
import QRScanCekTanah from './screen/QRScanCekTanah';
import FavouriteLocalData from './screen/FavouriteLocalData';
import FavouriteOnlineData from './screen/FavouriteOnlineData';
import DetailDataTanahOnline from './screen/DetailDataTanahOnline';
import KalibrasiKualitasTanah from './screen/KalibrasiKualitasTanah';
import PenyakitTanaman from './screen/PenyakitTanaman';
import DeteksiNitrogen from './screen/DeteksiNitrogen';
import CaptureDaun from './screen/CaptureDaun';
import WebviewSimco from './screen/WebviewSimco';
import WebviewSawentar from './screen/WebviewSawentar';
import WebviewPenyuluhan from './screen/WebviewPenyuluhan';
import RegisterScreen from './screen/RegisterScreen';
import ResetPassword from './screen/ResetPassword';
import Cuaca from './screen/Cuaca';
import RoomDiskusi from './screen/RoomDiskusi';
import ListTopikDiskusi from './screen/ListTopikDiskusi';
import ListTopikFavorit from './screen/ListTopikFavorit';

import ListChatPakar from './screen/ListChatPakar';
import RoomDiskusiPakar from './screen/RoomDiskusiPakar';
import CatatanUsahaTani from './screen/CatatanUsahaTani';
import AgendaKegiatanTani from './screen/AgendaKegiatanTani';
import CatatanPendapatan from './screen/CatatanPendapatan';
import CatatanPengeluaran from './screen/CatatanPengeluaran';
import DaftarCatatanKegiatan from './screen/DaftarCatatanKegiatan';
import CatatanKegiatan from './screen/CatatanKegiatan';
import KelolaProduk from './screen/KelolaProduk';
import PasarBertani from './screen/PasarBertani';
import CariModal from './screen/CariModal';
import KasihModal from './screen/KasihModal';

//notifikasi
import PushNotification, { Importance } from "react-native-push-notification";

const Stack = createNativeStackNavigator();

function App() {

  const createChannel = () => {
    PushNotification.createChannel({
        channelId: "BertaniChannel", // (required)
        channelName: "BertaniApp", // (required)
        channelDescription: "Channel for local and remote notification", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if tru
    },(created) => console.log(`createChannel returned '${created}'`))
  }

  useEffect(() => {
    createChannel()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name="DetailSensor" component={DetailSensor} />
        <Stack.Screen name="CekTanah" component={CekTanah} options={{headerShown:false}} />
        <Stack.Screen name="DaftarController" component={DaftarController} options={{headerShown:false}} />
        <Stack.Screen name="DetailController" component={DetailController} options={{headerShown:false}} />
        <Stack.Screen name="SettingController" component={SettingController} options={{headerShown:false}} />
        <Stack.Screen name="QRScanner" component={QRScanner} options={{headerShown:false}} />
        <Stack.Screen name="QRScannerSC" component={QRScannerSC} options={{headerShown:false}} />
        <Stack.Screen name="TambahController" component={TambahController} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <Stack.Screen name="TambahPengguna" component={TambahPengguna} options={{headerShown:false}} />
        <Stack.Screen name="UbahProfile" component={UbahProfile} options={{headerShown:false}} />
        <Stack.Screen name="AIDetectPlant" component={AIDetectPlant} options={{headerShown:false}} />
        <Stack.Screen name="UbahUserData" component={UbahUserData} options={{headerShown:false}} />
        <Stack.Screen name="QRScanCekTanah" component={QRScanCekTanah} options={{headerShown:false}} />
        <Stack.Screen name="FavouriteLocalData" component={FavouriteLocalData} options={{headerShown:false}} />
        <Stack.Screen name="FavouriteOnlineData" component={FavouriteOnlineData} options={{headerShown:false}} />
        <Stack.Screen name="DetailDataTanahOnline" component={DetailDataTanahOnline} options={{headerShown:false}} />
        <Stack.Screen name="KalibrasiKualitasTanah" component={KalibrasiKualitasTanah} options={{headerShown:false}} />
        <Stack.Screen name="PenyakitTanaman" component={PenyakitTanaman} options={{headerShown:false}} />
        <Stack.Screen name="DeteksiNitrogen" component={DeteksiNitrogen} options={{headerShown:false}} />
        <Stack.Screen name="CaptureDaun" component={CaptureDaun} options={{headerShown:false}} />
        <Stack.Screen name="WebviewSimco" component={WebviewSimco} options={{headerShown:false}} />
        <Stack.Screen name="WebviewSawentar" component={WebviewSawentar} options={{headerShown:false}} />
        <Stack.Screen name="WebviewPenyuluhan" component={WebviewPenyuluhan} options={{headerShown:false}} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown:false}} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown:false}} />
        <Stack.Screen name="Cuaca" component={Cuaca} options={{headerShown:false}} />
        <Stack.Screen name="RoomDiskusi" component={RoomDiskusi} options={{headerShown:false}}/>
        <Stack.Screen name="ListTopikDiskusi" component={ListTopikDiskusi} options={{headerShown:false}}/>
        <Stack.Screen name="ListTopikFavorit" component={ListTopikFavorit} options={{headerShown:false}}/>
        <Stack.Screen name="ListChatPakar" component={ListChatPakar} options={{headerShown:false}}/>
        <Stack.Screen name="RoomDiskusiPakar" component={RoomDiskusiPakar} options={{headerShown:false}}/>
        <Stack.Screen name="CatatanUsahaTani" component={CatatanUsahaTani} options={{headerShown:false}}/>
        <Stack.Screen name="AgendaKegiatanTani" component={AgendaKegiatanTani} options={{headerShown:false}}/>
        <Stack.Screen name="CatatanPendapatan" component={CatatanPendapatan} options={{headerShown:false}}/>
        <Stack.Screen name="CatatanPengeluaran" component={CatatanPengeluaran} options={{headerShown:false}}/>
        <Stack.Screen name="DaftarCatatanKegiatan" component={DaftarCatatanKegiatan} options={{headerShown:false}}/>
        <Stack.Screen name="CatatanKegiatan" component={CatatanKegiatan} options={{headerShown:false}}/>
        <Stack.Screen name="KelolaProduk" component={KelolaProduk} options={{headerShown:false}}/>
        <Stack.Screen name="PasarBertani" component={PasarBertani} options={{headerShown:false}}/>
        <Stack.Screen name="CariModal" component={CariModal} options={{headerShown:false}}/>
        <Stack.Screen name="KasihModal" component={KasihModal} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;