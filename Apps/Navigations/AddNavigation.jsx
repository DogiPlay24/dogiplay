import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddScreen from "../Screens/AddScreen";
import PreviewScreen from "../Screens/AddScreen/PreviewScreen";
import PreviewRecord from "../Screens/AddScreen/PreviewRecord";

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
      <Stack.Screen name="PreviewRecord" component={PreviewRecord} />
    </Stack.Navigator>
  );
}
