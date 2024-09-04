import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import i18next from "./../Utils/i18next";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";

export default function Language() {
  const { i18n } = useTranslation();

  const handleLanguageChange = async (language) => {
    i18next.changeLanguage(language);
    await SecureStore.setItemAsync("language", language);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleLanguageChange("en")}>
        <Image
          source={require("./../../assets/flags/en.png")}
          style={styles.flag}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLanguageChange("es")}>
        <Image
          source={require("./../../assets/flags/es.png")}
          style={styles.flag}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  flag: {
    width: 32,
    height: 32,
    marginHorizontal: 5,
  },
});
