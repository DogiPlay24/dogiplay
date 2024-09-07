import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import { useSignIn } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

export default function PasswordReset({ onBack }) {
  const { t } = useTranslation();
  const passwordResetForm = t("passwordReset", { returnObjects: true });
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  const handleSendCode = async () => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      Toast.show({
        type: "success",
        text1: "📧 Código enviado",
        text2: "Revisa tu correo para el código de verificación.",
      });
    } catch (error) {
      setError(error.errors?.[0]?.longMessage || "Error al enviar el código.");
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: error.errors?.[0]?.longMessage || "Error al enviar el código.",
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Toast.show({
          type: "success",
          text1: "🔑 Contraseña restablecida",
          text2: "Has iniciado sesión correctamente.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: "Algo salió mal. Inténtalo más tarde.",
        });
      }
    } catch (error) {
      setError(
        error.errors?.[0]?.longMessage || "Error al restablecer la contraseña."
      );
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2:
          error.errors?.[0]?.longMessage ||
          "Error al restablecer la contraseña.",
      });
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.rowBack}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.GREY} />
        </TouchableOpacity>
        <Text style={styles.titleForm}>{passwordResetForm.passwordReset}</Text>
      </View>

      {!successfulCreation && (
        <>
          <TextInput
            style={styles.txtInput}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
            value={email}
            placeholder={passwordResetForm.email}
            onChangeText={setEmail}
          />
          <TouchableOpacity onPress={handleSendCode} style={styles.btnSignIn}>
            <Text style={styles.textSignIn}>{passwordResetForm.sendCode}</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}

      {successfulCreation && (
        <>
          <TextInput
            style={styles.txtInput}
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            value={code}
            placeholder={passwordResetForm.verificationCode}
            onChangeText={setCode}
          />
          <TextInput
            style={styles.txtInput}
            value={password}
            placeholder={passwordResetForm.newPassword}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={handlePasswordReset}
            style={styles.btnSignIn}
          >
            <Text style={styles.textSignIn}>{passwordResetForm.passwordReset}</Text>
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
  errorText: {
    color: "red",
    marginTop: 10,
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
  rowBack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
