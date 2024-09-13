import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import { useSignUp } from "@clerk/clerk-expo";
import { supabase } from "../../Utils/SupabaseConfig";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function SignUpForm({ handleForm }) {
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const signUpForm = t("signUpForm", { returnObjects: true });
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInputs = async () => {
    const userExists = await checkUser(emailAddress);

    if (!name || !lastname || !emailAddress || !password) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: `${signUpForm.allInputs}`,
      });
      return;
    }
    if (userExists) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "El correo electrónico ya está registrado.",
      });
      return;
    }
    if (!emailPattern.test(emailAddress)) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Por favor ingresa un correo electrónico válido",
      });
      return;
    }
    if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "La contraseña debe tener al menos 8 caracteres",
      });
      return false;
    }
  };

  const checkUser = async (email) => {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Error al verificar el usuario", error);
      return false;
    }

    return data.length > 0;
  };

  const handleEmailRegister = async () => {
    if (!isLoaded || !validateInputs()) return;

    try {
      await signUp.create({
        firstName: name,
        lastName: lastname,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "El correo electrónico ya está registrado.",
      });
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setIsVerifying(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        if (signUp?.emailAddress) {
          const { data, error } = await supabase
            .from("Users")
            .insert([
              {
                name: signUp?.firstName + " " + signUp?.lastName,
                email: signUp?.emailAddress,
                username: (signUp?.emailAddress).split("@")[0],
              },
            ])
            .select();
        }
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: "No se logró crear el usuario. Inténtalo más tarde.",
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "El código es incorrecto. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.titleForm}>{signUpForm.register}</Text>
      {!pendingVerification && (
        <>
          <TextInput
            style={styles.txtInput}
            value={name}
            placeholder={signUpForm.name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.txtInput}
            value={lastname}
            placeholder={signUpForm.lastname}
            onChangeText={setLastname}
          />
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
            placeholder={signUpForm.password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={handleEmailRegister}
            style={styles.btnSignIn}
          >
            <Text style={styles.textSignIn}>{signUpForm.sign}</Text>
          </TouchableOpacity>
          <View style={styles.buttons}>
            <Text style={styles.register}>{signUpForm.account}</Text>
            <TouchableOpacity onPress={handleForm}>
              <Text style={[styles.titleSocials, styles.registerText]}>
                {signUpForm.login}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            style={styles.txtInput}
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            value={code}
            placeholder={signUpForm.code}
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity onPress={handleVerify} style={styles.btnSignIn}>
            <Text style={styles.textSignIn}>
              {!isVerifying ? (
                signUpForm.verify
              ) : (
                <ActivityIndicator size="small" color={Colors.WHITE} />
              )}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-Regular",
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
