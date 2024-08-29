import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { lazy, Suspense } from "react";
const LoginScreen = lazy(() => import("./Apps/Screens/LoginScreen"));

export default function App() {
  const [load, error] = useFonts({
    DancingSc: require("./assets/fonts/DancingSc.ttf"),
    "DancingSc-Medium": require("./assets/fonts/DancingSc-Medium.ttf"),
    "DancingSc-Bold": require("./assets/fonts/DancingSc-Bold.ttf"),
    Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Cargando...</Text>}>
        <LoginScreen />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbfb",
  },
});
