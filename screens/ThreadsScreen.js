import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const handleSharePost = () => {
    const postData = {
      userId,
    };
    if (content) {
      postData.content = content;
    }
    axios
      .post("http://192.168.15.93:3000/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("error create-post: ", error);
      });
  };
  return (
    <SafeAreaView style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
        />
        <Text>Tony Cleriston</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 15,
          marginTop: 20,
          padding: 10,
        }}
      >
        <TextInput
          multiline
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Digite sua mensagem..."
        />
      </View>
      <View style={{ marginTop: 20 }} />
      <Button
        title="Compartilhar Post"
        style={{ marginTop: 40 }}
        onPress={() => handleSharePost()}
      />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
