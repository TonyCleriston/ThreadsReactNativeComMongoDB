import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, {
  useEffect,
  useContext,
  useState,
  useCallback
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode} from 'jwt-decode'
import axios from 'axios'
import "core-js/stable/atob";
import { UserType } from '../UserContext'
import {AntDesign} from '@expo/vector-icons'
import {FontAwesome} from '@expo/vector-icons'
import {Ionicons} from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'


const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.userId
      setUserId(userId);

      
    }
    fetchUsers()
},[])
useEffect(() => {
  fetchPosts()
},[])
useEffect(() => {
  fetchPosts()
},[posts])
useFocusEffect(
  useCallback(() => {
    fetchPosts()
  }, [])
)
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://192.168.15.93:3000/get-posts')
    setPosts(response.data)
  }
  catch (error) {
    console.log("error fetching posts: ", error)
  }
}
const handleLike = async (postId) => {
  try {
    const response = await axios.put(`http://192.168.15.93:3000/posts/${postId}/${userId}/like`)
    const updatedPost = response.data;
    const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post)
    setPosts(updatedPosts)
  }
  catch (error) {
    console.log("error liking post: ", error)
  }
}
const handleUnlike = async (postId) => {
  try {
    const response = await axios.put(`http://192.168.15.93:3000/posts/${postId}/${userId}/unlike`)
    const updatedPost = response.data;
    const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post)
    setPosts(updatedPosts)
  }
  catch (error) {
    console.log("error unliking post: ", error)
  }
}
  return (
    <ScrollView style={{ marginTop:50, flex: 1, backgroundColor: 'white'}}>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Image
          source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }}
          style={{ width: 60, height: 40, resizeMode: "contain" }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        {posts?.map((post , index) => (
          <View key={index} style={{ padding: 15, borderColor: '#D0D0D0', borderTopWidth: 1, flexDirection: 'row', gap: 10, marginVertical: 10 }}>
            <View>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png" }}
                style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' , marginBottom: 5}}>{post?.user?.name}</Text>
       
              <Text>{post?.content}</Text>
        
              <View style={{ flexDirection: 'row',alignItems: 'center', gap: 18, marginTop: 15 }}>
                {post?.likes?.includes(userId) ? <AntDesign onPress={() => handleUnlike(post?._id)} name='heart' size={20} color="red" /> : <AntDesign onPress={() => handleLike(post?._id)} name='hearto' size={20} color="black" />}
                  <FontAwesome name='comment-o' size={20} color="black" />
                  <Ionicons name='share-social-outline' size={20} color="black" />
              </View>
              <Text style={{ marginTop: 7,  color: 'gray', }}>{post?.likes?.length} likes - {post?.replies?.length} replies</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})