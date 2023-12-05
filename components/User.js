import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext'


const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType)
    const [requestSent, setRequestSent] = useState(false)
    const sendFollow = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch(`http://192.168.15.93:3000/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentUserId,
                    selectedUserId
                }),
            })

                if (response.ok) {
                    setRequestSent(true)
                }
        } catch (error) {
            console.log("error in activity people: ",error)
        }
    }
    const handleUnfollow = async (targetId) => {
        try {
            const response = await fetch(`http://192.168.15.93:3000/users/unfollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    loggedInUserId: userId,
                    targetUserId: targetId,
                }),
            })
        if (response.ok) {
            setRequestSent(false)
        }
        } catch (error) {
            console.log("error unfollowing: ",error)
        }
        
    }
  return (
    <View>
        <View style={{ flexDirection: "row", alignItems: "center",gap:10 }}>
        <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png" }}
            style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "contain" }}
        />
        <Text style={{ fontSize: 15, fontWeight: "500", flex:1}}>{item?.name}</Text>

        {requestSent || item?.followers?.includes(userId) ? (
             <Pressable onPress={() => handleUnfollow(item?._id)} style={{ borderColor: "D0D0D0", borderWidth: 1, padding: 10, marginLeft: 10 , borderRadius: 7, width: 100}}>
             <Text style={{ textAlign: "center",fontSize:15, fontWeight: "bold"}}>Seguindo</Text>
         </Pressable>
        ): (
            <Pressable onPress={() => sendFollow(userId, item._id)} style={{ borderColor: "D0D0D0", borderWidth: 1, padding: 10, marginLeft: 10 , borderRadius: 7, width: 100}}>
            <Text style={{ textAlign: "center",fontSize:15, fontWeight: "bold"}}>Seguir</Text>
            </Pressable>
        )}

       
        </View>
        
    </View>
  )
}

export default User

const styles = StyleSheet.create({})