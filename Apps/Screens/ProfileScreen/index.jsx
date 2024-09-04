import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import Language from "../../Utils/Language";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const profileScreen = t("profileScreen", { returnObjects: true });
  return (
    <View style={{ padding: 50 }}>
      <Button title={profileScreen.logout} onPress={signOut} />
      <Language />
    </View>
  );
}
