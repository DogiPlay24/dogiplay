import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import icon from "./../../../assets/images/logo.png";

export default function SplashScreen() {
  return (
    <View style={styles.background}>
      <View>
        <Text style={styles.title}>
          Dogi
          <Text style={styles.span}>Play</Text>
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
    backgroundColor: Colors.BLUE_GRADIENT,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: "BigshotOne",
    color: Colors.WHITE,
    fontSize: 48,
    margin: 12
  },
  span: {
    opacity: 0.3
  },
  subtitle: {
    fontFamily: "Roboto",
    opacity: 0.3,
    fontSize: 16,
    color: Colors.WHITE,
    textAlign:'center'
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
