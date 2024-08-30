import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { lazy, Suspense, useEffect, useState } from "react";
import Colors from "./Apps/Utils/Colors";
import { ClerkProvider } from "@clerk/clerk-expo";
const LoginScreen = lazy(() => import("./Apps/Screens/LoginScreen"));
import SplashScreen from "./Apps/Screens/SplashScreen";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbfb",
  },
});
