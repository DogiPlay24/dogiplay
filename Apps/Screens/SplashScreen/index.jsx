import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import { images } from "./../../../assets/images";

export default function SplashScreen() {
  return (
    <View style={styles.background}>
      <ImageBackground source={images.pattern} resizeMode="cover" style={styles.bg}>
        <View>
          <Text style={styles.title}>
            Dogi
            <Text style={styles.span}>Play</Text>
          </Text>
          <Text style={styles.subtitle}>Las estrellas del deporte</Text>
        </View>
        <View style={styles.image}>
          <Image source={images.logo} style={styles.icon} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: "BigshotOne",
    color: Colors.WHITE,
    fontSize: 52,
    margin: 12,
    textAlign: 'center'
  },
  span: {
    color: Colors.LIGHT_BLUE,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    opacity: 0.3,
    fontSize: 18,
    color: Colors.WHITE,
    textAlign: 'center'
  },
  image: {
    alignItems: "center",
    paddingTop: 200
  },
  icon: {
    height: 200,
    resizeMode: "contain",
  },
});
