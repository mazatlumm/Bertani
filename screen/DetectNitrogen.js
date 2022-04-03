import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const DetectNitrogen = () => {

    useEffect(() => {
        CekTSFlow();
      }, []);

    async function CekTSFlow() {
        await tf.ready();
    }

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>DetectNitrogen</Text>
    </View>
  )
}

export default DetectNitrogen

const styles = StyleSheet.create({})