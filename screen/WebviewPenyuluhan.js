import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const WebviewPenyuluhan = () => {
  return (
      <WebView 
      style={styles.container}
      source={{ uri: 'https://alicestech.com/petani/' }}
    />
  )
}

export default WebviewPenyuluhan

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})