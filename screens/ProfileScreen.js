import { Pressable, StyleSheet, Text, View ,Image} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation()
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error fetching profile: ", error);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    clearAuthToken();
  }
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.replace("Login");
  }

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 20, marginTop: 15, alignItems: "center" }}>
          <View>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Estudando na Unex
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Trabalhando com React | React Native
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Javascript e Typescript
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 15, color: "gray", marginTop: 10 }}>{user?.followers?.length} seguidores</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginTop: 20 }}>
          <Pressable style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center",borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}>
              <Text>Editar Perfil</Text>
          </Pressable>
          <Pressable onPress={logout} style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center",borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}>
              <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
