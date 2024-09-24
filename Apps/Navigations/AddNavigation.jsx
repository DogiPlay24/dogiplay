import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddScreen from "../Screens/AddScreen";
import PreviewScreen from "../Screens/AddScreen/PreviewScreen";

const Stack = createStackNavigator();
export default function AddNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddScreen" component={AddScreen} />
      <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
    </Stack.Navigator>
  );
}
