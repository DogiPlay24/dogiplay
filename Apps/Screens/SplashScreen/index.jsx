import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import icon from "./../../../assets/images/logo.png";

export default function SplashScreen() {
  return (
    <View style={styles.background}>
      <View>
        <Text style={styles.title}>
          Dogg
          <Text style={styles.span}>y</Text>
          Pla
          <Text style={styles.span}>y</Text>
        </Text>
        <Text style={styles.subtitle}>Las estrellas del deporte</Text>
      </View>
      <View style={styles.image}>
        <Image source={icon} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.BLUE,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: "Roboto-Bold",
    color: Colors.WHITE,
    fontSize: 36,
  },
  subtitle: {
    fontFamily: "Roboto-Bold",
    color: Colors.GREY,
    fontSize: 16,
  },
  span: {
    color: Colors.GREY,
  },
  image: {
    alignItems: "center",
    paddingTop: 14,
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
