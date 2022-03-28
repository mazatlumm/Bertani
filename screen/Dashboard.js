import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Dashboard = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={()=>navigation.navigate('DetailSensor')}>
            <Text>Detail Screen</Text>
        </TouchableOpacity>
  </View>
  )
}

export default Dashboard