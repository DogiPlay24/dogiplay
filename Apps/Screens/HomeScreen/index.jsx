import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Utils/SupabaseConfig";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    user && updateProfileImage();
  }, [user]);

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({ profileImage: user?.imageUrl })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select();

  };
  return (
    <View style={{ padding: 50 }}>
      <Text>HomeScreen</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}
