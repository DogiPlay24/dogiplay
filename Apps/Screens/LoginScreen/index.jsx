import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useCallback, useState } from "react";
import Colors from "../../Utils/Colors";
import icon from "./../../../assets/images/logo.png";
import image from "./../../../assets/images/background.jpg";
import google from "./../../../assets/images/google.png";
import facebook from "./../../../assets/images/facebook.png";
import * as WebBrowser from "expo-web-browser";
import useWarmUpBrowser from "./../../Hooks/useWarmUpBrowser";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import SignInForm from "../Forms/SignInForm";
import SignUpForm from "../Forms/SignUpForm";
import { supabase } from "./../../Utils/SupabaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { setActive } = useSignIn();

  useWarmUpBrowser();
  // Google OAuth
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  // Facebook OAuth
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({
    strategy: "oauth_facebook",
  });

  const handleOAuthLogin = useCallback(
    async (startOAuthFlow) => {
      try {
        const { createdSessionId, signUp } = await startOAuthFlow();
        if (createdSessionId) {
          setActive({ session: createdSessionId });
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
        }
      } catch (error) {
        console.log("OAuth error", error);
      }
    },
    [setActive]
  );

  const handleGoogleLogin = () => handleOAuthLogin(startGoogleOAuthFlow);
  const handleFacebookLogin = () => handleOAuthLogin(startFacebookOAuthFlow);

  const handleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={image} style={styles.image}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
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
              {isLogin ? (
                <SignInForm handleForm={handleForm} />
              ) : (
                <SignUpForm handleForm={handleForm} />
              )}
              <View style={styles.socials}>
                <Text style={styles.titleSocials}>O inicia sesión con:</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={handleGoogleLogin}
                    style={styles.btn}
                  >
                    <Image source={google} style={styles.social} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFacebookLogin}
                    style={styles.btn}
                  >
                    <Image source={facebook} style={styles.social} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  main: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    paddingHorizontal: 45,
    paddingTop: 30,
    paddingBottom: 20,
  },
  socials: {
    alignItems: "center",
    gap: 10,
  },
  titleSocials: {
    fontFamily: "Roboto-Bold",
    color: Colors.GREY,
    fontSize: 14,
  },
  buttons: {
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
  registerText: {
    color: Colors.BLUE_DARK,
    textDecorationLine: "underline",
  },
});
