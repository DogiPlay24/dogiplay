import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={{ padding: 50 }}>
      <Text>HomeScreen</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}
