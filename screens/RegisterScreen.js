import { StyleSheet,Alert, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'


const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    const handleRegister = () => {
      const user = {
        name: name,
        email: email,
        password: password
      }
      axios.post("http://192.168.15.93:3000/register", user).then((res) => {
        Alert.alert("Registrado com Sucesso")
        setName('')
        setEmail('')
        setPassword('')
        navigation.navigate("Login")
      }).catch((err) => {
        Alert.alert("Falha ao realizar o registro", "Por favor tente novamente")
        console.log("Erro ao realizar o registro: ",err)
        
      })
    }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
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
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 25 }}>Registre sua Conta</Text>
        </View>
        <View style={{ marginTop:40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center',borderColor: '#D0D0D0', borderWidth: 1, borderRadius: 5, padding: 5,gap:10, }}>
            <Ionicons style={{ marginLeft: 10 }} name="person" size={24} color="gray" />
            <TextInput onChangeText={(text) => setName(text)} value={name} placeholderTextColor={'gray'} style={{ color: 'gray', marginVertical:10,width: 250,fontSize: name?16:16 }} placeholder='Informe seu Nome...' />
          </View>
        </View>
        <View style={{ marginTop:30 }}>
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

    
        </View>

        <View style={{ marginTop: 45 }}/>

        <Pressable onPress={handleRegister} style={{ backgroundColor: 'black', width: 200, height: 50,padding: 15, marginTop: 40, marginLeft: "auto", marginRight: "auto",  borderRadius: 6}}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Registrar</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Login')} style={{ marginTop: 18, padding:8 }} >
            <Text style={{ textAlign: 'center', fontSize: 16, color: 'black'}} >Já possui uma conta? Faça o login</Text>
        </Pressable>
    
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})