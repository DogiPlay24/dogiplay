import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Colors from "../../Utils/Colors";

export default function LoginScreen() {
  return (
    <View style={styles.main}>
      <Video
        style={styles.background}
        source={{
          uri: "https://cdn.pixabay.com/video/2020/11/07/54767-478767638_large.mp4",
        }}
        shouldPlay
        resizeMode="cover"
        isLooping={true}
      />
      <View style={styles.secondary}>
        <Text style={styles.title}>DogiPlay</Text>
        <Text style={styles.subtitle}>Las estrellas del deporte</Text>

        <View style={styles.btns}>
          <TouchableOpacity onPress={() => console.log("Google")} style={styles.btn}>
            <Image
              style={styles.btnIcon}
              source={require("./../../../assets/images/google.png")}
            />
            <Text style={styles.btnText}>Iniciar Sesión con Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Facebook")} style={styles.btn}>
            <Image
              style={styles.btnIcon}
              source={require("./../../../assets/images/facebook.png")}
            />
            <Text style={styles.btnText}>Iniciar Sesión con Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  secondary: {
    display: "flex",
    alignItems: "center",
    paddingTop: 150,
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.BACKGROUND_TRANSPARENT,
  },
  title: {
    fontFamily: "DancingSc-Bold",
    color: Colors.WHITE,
    fontSize: 38,
  },
  subtitle: {
    fontFamily: "Roboto",
    color: Colors.WHITE,
    fontSize: 12,
    textAlign: "center",
  },
  btns: {
    marginTop: 8,
    gap: 8,
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  btn: {
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    padding: 8,
    paddingHorizontal: 24,
    borderRadius: 99,
  },
  btnIcon: {
    width: 30,
    height: 30,
  },
  btnText: {
    fontFamily: "Roboto",
    fontSize: 12,
    textAlign: "center",
  },
});
