import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const DetailSensor = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')}>
            <Text>Dashboard Screen</Text>
        </TouchableOpacity>
    </View>
  )
}

export default DetailSensor