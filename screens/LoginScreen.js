import { StyleSheet, Text, Alert,View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useState,useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken")
          if (token) {
            setTimeout(() => {
              navigation.replace("Main")
            }, 400)
          }
        } catch (error) {
          console.log("Error checking login status: ", error)
        }
      }
      checkLoginStatus()
    },[])
    const handleLogin = () => {
      
      const user = {
        email: email,
        password: password
      }
      axios.post("http://192.168.15.93:3000/login", user).then((res) => {
        const token = res.data.token
        AsyncStorage.setItem("authToken", token)
        navigation.replace("Main")
      }).catch((err) => {
        Alert.alert("Falha ao realizar o login", "Por favor tente novamente")
        console.log("Erro ao realizar o login: ",err)
        
      })
    }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 25 }}>Realize o Login em sua Conta</Text>
        </View>
        <View style={{ marginTop:40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center',borderColor: '#D0D0D0', borderWidth: 1, borderRadius: 5, padding: 5,gap:10, }}>
            <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="gray" />
            <TextInput onChangeText={(text) => setEmail(text)} value={email} placeholderTextColor={'gray'} style={{ color: 'gray', marginVertical:10,width: 250, fontSize: email?16:16 }}  placeholder='Informe seu Email...' />
          </View>
          <View style={{ marginTop:30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center',borderColor: '#D0D0D0', borderWidth: 1, borderRadius: 5, padding: 5,gap:10, }}>
            <AntDesign style={{ marginLeft: 10 }} name="lock" size={24} color="gray" />
            <TextInput secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password} placeholderTextColor={'gray'} style={{ color: 'gray', marginVertical:10,width: 250,fontSize: password?16:16 }} placeholder='Informe sua Senha...' />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
            <Text>Continuar Logado...</Text>
            <Text style={{ color: '#007FFF',fontWeight: '500' }}>Esqueci minha senha</Text>
        </View>
        </View>

        <View style={{ marginTop: 45 }}/>

        <Pressable onPress={handleLogin} style={{ backgroundColor: 'black', width: 200, height: 50,padding: 15, marginTop: 40, marginLeft: "auto", marginRight: "auto",  borderRadius: 6}}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 18, padding:8 }} >
            <Text style={{ textAlign: "center", fontSize: 16, color: 'black'}} >Nâo tem conta? Cadastre-se</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})