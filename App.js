import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { lazy, Suspense, useEffect, useState } from "react";
import Colors from "./Apps/Utils/Colors";
import { ClerkProvider } from "@clerk/clerk-expo";
const LoginScreen = lazy(() => import("./Apps/Screens/LoginScreen"));
import SplashScreen from "./Apps/Screens/SplashScreen";
import FONTS from './assets/fonts';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts(FONTS);

  useEffect(() => {
    fontsLoaded && setTimeout(async () => setIsReady(true) , 5000);
  }, [fontsLoaded]);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {!isReady ? (
        <SplashScreen />
      ) : (
        <Suspense
          fallback={<ActivityIndicator size="large" color={Colors.GREY} />}
        >
          <LoginScreen />
        </Suspense>
      )}
    </ClerkProvider>
  );
}
