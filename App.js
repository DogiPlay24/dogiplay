import { ActivityIndicator, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { lazy, Suspense, useEffect, useState } from "react";
import Colors from "./Apps/Utils/Colors";
// const LoginScreen = lazy(() => import("./Apps/Screens/LoginScreen"));
import SplashScreen from "./Apps/Screens/SplashScreen";
import LoginScreen from "./Apps/Screens/LoginScreen";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import HomeScreen from "./Apps/Screens/HomeScreen";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    DancingSc: require("./assets/fonts/DancingSc.ttf"),
    "DancingSc-Medium": require("./assets/fonts/DancingSc-Medium.ttf"),
    "DancingSc-Bold": require("./assets/fonts/DancingSc-Bold.ttf"),
    Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      if (fontsLoaded) {
        setTimeout(async () => {
          setIsReady(true);
        }, 5000);
      }
    }
    prepareApp();
  }, [fontsLoaded]);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  const tokenCache = {
    async getToken(key) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        return console.log(error);
      }
    },
    async saveToken(key, value) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (error) {
        return console.log(error);
      }
    },
    async deleteToken(key) {
      try {
        return await SecureStore.deleteItemAsync(key);
      } catch (error) {
        return console.log(error);
      }
    },
  };

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      style={{ flex: 1 }}
    >
      <SignedIn>
        <HomeScreen />
      </SignedIn>
      <SignedOut>{!isReady ? <SplashScreen /> : <LoginScreen />}</SignedOut>
    </ClerkProvider>
  );
}
