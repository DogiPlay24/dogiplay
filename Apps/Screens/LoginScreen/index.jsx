import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import icon from "./../../../assets/images/logo.png";
import image from "./../../../assets/images/background.jpg";
import google from "./../../../assets/images/google.png";
import facebook from "./../../../assets/images/facebook.png";
import { TouchableOpacity } from "react-native";

export default function LoginScreen() {
  const [emailAddress, setEmailAddress] = useState();
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
          <View style={styles.form}>
          <Text>Inicio de Sesión</Text>
            <TextInput
              style={styles.txtInput}
              autoCapitalize="none"
              textContentType="emailAddress"
              // value={emailAddress}
              placeholder="JhonDoe@gmail.com"
              onChange={(email) => setEmailAddress(email)}
            />
            <TextInput
              style={styles.txtInput}
              // value={password}
              placeholder="Contraseña"
              secureTextEntry
              onChange={(password) => setEmailAddress(password)}
            />
            <TouchableOpacity style={styles.btnSignIn}>
              <Text style={styles.textSignIn}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.socials}>
            <Text>O inicia sesión con:</Text>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.btn}>
                <Image source={google} style={styles.social} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Image source={facebook} style={styles.social} />
              </TouchableOpacity>
            </View>
          </View>
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
    paddingHorizontal: 45,
  },
  form: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  txtInput: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 16,
    width: 250,
    borderRadius: 10,
  },
  btnSignIn: {
    backgroundColor: Colors.BLUE_DARK,
    padding: 10,
    paddingHorizontal: 10,
    width: 250,
    alignItems: "center",
    borderRadius: 10,
  },
  textSignIn: {
    color: Colors.WHITE,
  },
  socials: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 0.3,
    gap: 10,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
  },
  social: {
    width: 40,
    height: 40,
  },
});
