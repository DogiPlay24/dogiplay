import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import Colors from "../../Utils/Colors";
import { useSignIn } from "@clerk/clerk-expo";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function SignInForm({ handleForm }) {
  const { t } = useTranslation();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  // Email SignIn
  const { signIn, setActive, isLoaded } = useSignIn();
  const signInForm = t("signInForm", { returnObjects: true });

  const handleEmailLogin = useCallback(async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: `${signInForm.allInputs}`,
      });
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // console.error(JSON.stringify(signInAttempt, null, 2));
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: `${signInForm.errorLogin}`,
        });
      }
    } catch (error) {
      // console.error(JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: `${signInForm.errorUser}`,
      });
    }
  }, [isLoaded, emailAddress, password, signIn, setActive]);

  return (
    <View style={styles.form}>
      <Text style={styles.titleForm}>{signInForm.welcome}</Text>
      <TextInput
        style={styles.txtInput}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
        value={emailAddress}
        placeholder="JhonDoe@gmail.com"
        onChangeText={setEmailAddress}
      />
      <TextInput
        style={styles.txtInput}
        value={password}
        placeholder={signInForm.password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleEmailLogin} style={styles.btnSignIn}>
        <Text style={styles.textSignIn}>{signInForm.login}</Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
        <Text style={styles.register}>{signInForm.account}</Text>
        <TouchableOpacity onPress={handleForm}>
          <Text style={[styles.titleSocials, styles.registerText]}>
            {signInForm.register}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  titleForm: {
    fontFamily: "Roboto-Bold",
    color: Colors.GREY,
    fontSize: 24,
  },
  txtInput: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 10,
  },
  btnSignIn: {
    backgroundColor: Colors.BLUE_DARK,
    padding: 12,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  textSignIn: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  register: {
    fontFamily: "Roboto-Bold",
    color: Colors.GREY,
    fontSize: 14,
  },
  registerText: {
    color: Colors.BLUE_DARK,
    textDecorationLine: "underline",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
});
