import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import SplashScreen from "./Apps/Screens/SplashScreen";
import FONTS from "./assets/fonts";
import LoginScreen from "./Apps/Screens/LoginScreen";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import MainNavigation from "./Apps/Navigations/MainNavigation";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts(FONTS);

  useEffect(() => {
    fontsLoaded && setTimeout(async () => setIsReady(true), 5000);
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
        <NavigationContainer>
          <PaperProvider>
            <MainNavigation />
          </PaperProvider>
        </NavigationContainer>
      </SignedIn>
      <SignedOut>{!isReady ? <SplashScreen /> : <LoginScreen />}</SignedOut>
      <Toast position="bottom" />
    </ClerkProvider>
  );
}
