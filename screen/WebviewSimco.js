import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const WebviewSimco = () => {
  return (
      <WebView 
      style={styles.container}
      source={{ uri: 'https://alicestech.com/simco/' }}
    />
  )
}

export default WebviewSimco

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})