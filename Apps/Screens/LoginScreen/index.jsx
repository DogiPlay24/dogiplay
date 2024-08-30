import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import icon from "./../../../assets/images/logo.png";
import image from "./../../../assets/images/background.jpg";

export default function LoginScreen() {
  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.container}>
        <View style={styles.main}>
          <Image source={icon} style={styles.icon} />
          <View>
            <Text style={styles.title}>
              Dogg
              <Text style={styles.span}>y</Text>
              Pla
              <Text style={styles.span}>y</Text>
            </Text>
          </View>
        </View>
        <View style={styles.secondary}>
          <View style={styles.form}></View>
          <View style={styles.socials}></View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
  },
  main: {
    flex: 0.3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Roboto-Bold",
    color: Colors.WHITE,
    fontSize: 36,
  },
  span: {
    color: Colors.GREY,
  },
  secondary: {
    flex: 0.7,
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    paddingHorizontal: 30
  },
  form: {
    borderWidth: 1,
    borderColor: "red",
    flex: 0.5,
  },
  socials: {
    borderWidth: 1,
    borderColor: "blue",
    flex: 0.5,
  },
});
