import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddScreen from "./../Screens/AddScreen";
import ProfileScreen from "./../Screens/ProfileScreen";
import Colors from "../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import HallScreen from "../Screens/HallScreen";
import HomeNavigation from "./HomeNavigation";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "react-native";
import AddNavigation from "./AddNavigation";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { user } = useUser();
  const profileImage = user?.imageUrl;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.WHITE,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: Colors.BLUE_DARK },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Publicaciones"
        component={AddNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Hall"
        component={HallScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 25,
                height: 25,
                borderRadius: 25 / 2,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
