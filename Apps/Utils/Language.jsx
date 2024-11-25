import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import i18next from "./../Utils/i18next";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "./Colors";

const languages = [
  {
    label: "Inglés",
    value: "en",
    flag: require("./../../assets/flags/en.png"),
  },
  {
    label: "Español",
    value: "es",
    flag: require("./../../assets/flags/es.png"),
  },
];

export default function Language() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    i18next.changeLanguage(language);
    await SecureStore.setItemAsync("language", language);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setDropdownVisible(true)}
      >
        <Image
          source={
            languages.find((lang) => lang.value === selectedLanguage)?.flag
          }
          style={styles.flag}
        />
        <Text style={styles.selectedText}>
          {languages.find((lang) => lang.value === selectedLanguage)?.label}
        </Text>
      </TouchableOpacity>

      {/* Modal para mostrar las opciones */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdown}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleLanguageChange(item.value)}
                >
                  <Image source={item.flag} style={styles.flag} />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setDropdownVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    justifyContent: "space-between",
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 10,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeIcon: {
    position: "absolute",
    top: -50,
    alignSelf: "center",
    backgroundColor: Colors.RED,
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
