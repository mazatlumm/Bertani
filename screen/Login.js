import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import TopImage from '../assets/images/LoginImage.png'
import IconUsername from '../assets/images/IconUsername.png'
import IconPassword from '../assets/images/IconPassword.png'

const Login = ({navigation}) => {
  return (
    <View style={{ flex: 1}}>
        <View style={{alignItems: 'center', marginBottom:30}}>
            <Image source={TopImage} style={{width:'100%', resizeMode:'cover',height:400}} />
        </View>

        <View style={styles.FormLogin}>
            <View style={styles.BoxInput}>
                <TextInput 
                placeholder='Username'
                style={styles.TextInput}
                />
                <Image source={IconUsername} style={{resizeMode:'contain',height:'50%', flex:1, marginTop:10, justifyContent:'flex-end'}} />
            </View>
            <View style={styles.BoxInput}>
                <TextInput 
                placeholder='Password'
                style={styles.TextInput}
                secureTextEntry={true}
                />
                 <Image source={IconPassword} style={{resizeMode:'contain',height:'50%', flex:1, marginTop:10, justifyContent:'flex-end'}} />
            </View>

            <TouchableOpacity style={styles.LoginButton} onPress={()=>navigation.navigate('Dashboard')}>
                <Text style={styles.TextLoginButton}>Masuk</Text>
            </TouchableOpacity>

            <View style={styles.FooterLogin}>
                <Text style={styles.TextFooter}>Kelas Bertani</Text>
                <Text style={styles.TextFooter}>Copyrigth {'\u00A9'}2022, All Rights Reserved</Text>
            </View>
           
        </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    FormLogin:{
        marginHorizontal:40,
        alignItems:'center'
    },
    BoxInput:{
        borderBottomWidth:1,
        marginBottom:20,
        flexDirection:'row'
    },
    TextInput:{
        fontSize:16,
        marginVertical:10,
        flex:5,
        color:'black'
    },
    LoginButton:{
        height:40,
        backgroundColor:'#0D986A',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        width:200,
        marginTop:20
    },
    TextLoginButton:{
        color:'white',
        fontSize:14,
        fontWeight:'bold'
    },
    FooterLogin:{
        marginTop:20,
        alignItems:'center'
    },
    TextFooter:{
        fontSize:14,
        color:'grey'
    }
})