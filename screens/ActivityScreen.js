import { StyleSheet, Text, View,ScrollView, TouchableOpacity } from 'react-native'
import React , {useState, useEffect, useContext}from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {jwtDecode} from 'jwt-decode'
import "core-js/stable/atob";
import axios from 'axios'
import {UserType} from '../UserContext'
import User from '../components/User'

const ActivityScreen = () => {
const [selectedButton, setselectedButton] = useState("people")
const [content, setContent] = useState("People Content")
const [users, setUsers] = useState([])
const {userId, setUserId} = useContext(UserType)
const handleButton = (value) =>{
    setselectedButton(value)
}
useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.userId
      setUserId(userId)
      axios.get(`http://192.168.15.93:3000/user/${userId}`).then((response) => {
        setUsers(response.data)
      }).catch((error) => {
      console.log("error getting users: ",error)

      })
    }
    fetchUsers()
},[])
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Atividades</Text>
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 10, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => handleButton("people")} style={[{flex:1, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 0.7, borderColor: '#D0D0D0', borderRadius: 6, }, selectedButton === "people" && { backgroundColor: 'black'}]}>
                <Text style={[{textAlign: 'center',fontWeight: 'bold', }, selectedButton === "people" ? { color: 'white'} : { color: 'black'} ]}>Pessoas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButton("all")}  style={[{flex:1, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 0.7, borderColor: '#D0D0D0', borderRadius: 6, }, selectedButton === "all" && { backgroundColor: 'black'}]}>
                <Text style={[{textAlign: 'center',fontWeight: 'bold'}, selectedButton === "all" ? { color: 'white'} : { color: 'black'} ]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButton("requests")}  style={[{flex:1, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 0.7, borderColor: '#D0D0D0', borderRadius: 6, }, selectedButton === "requests" && { backgroundColor: 'black'}]}>
                <Text style={[{textAlign: 'center',fontWeight: 'bold', fontSize: 13}, selectedButton === "requests" ? { color: 'white'} : { color: 'black'} ]}>Requisições</Text>
            </TouchableOpacity>
        </View>

        <View>
          {
            selectedButton === "people" && (
              <View style={{ marginTop: 20 }}>
                {users.length > 0 && (
                 users.map((item, index) => (
                  <User key={index} item={item} />
                 )) 
                )}
              </View>

            )
          }
        </View>
      </View>
    </ScrollView>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({})