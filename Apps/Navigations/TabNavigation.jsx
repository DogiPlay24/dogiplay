import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddScreen from "./../Screens/AddScreen";
import ProfileScreen from "./../Screens/ProfileScreen";
import Colors from "../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import HallScreen from "../Screens/HallScreen";
import HomeNavigation from "./HomeNavigation";
import { useUser } from "@clerk/clerk-expo";
import { Image, View, Text } from "react-native";
import AddNavigation from "./AddNavigation";
import * as Animatable from "react-native-animatable";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { user } = useUser();
  const profileImage = user?.imageUrl;
  const [showNumbers, setShowNumbers] = useState(false);

  const handleFocusTrophy = () => {
    setShowNumbers(true);
    setTimeout(() => setShowNumbers(false), 1500); // Ocultar números después de 1.5s
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.WHITE,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#1f1f1f" },
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
        listeners={{
          tabPress: handleFocusTrophy,
        }}
        options={{
          tabBarIcon: ({ size }) => (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="trophy" size={size} color="#FFD700" />
              {showNumbers && (
                <View style={{ position: "absolute", top: -30, flexDirection: "row" }}>
                  <Animatable.View
                    animation="fadeInUp"
                    duration={800}
                    delay={200}
                    style={{
                      backgroundColor: "#FFD700", // Dorado para el número 1
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginHorizontal: 5,
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 12 }}>1</Text>
                  </Animatable.View>
                  <Animatable.View
                    animation="fadeInUp"
                    duration={800}
                    delay={400}
                    style={{
                      backgroundColor: "#C0C0C0", // Plateado para el número 2
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginHorizontal: 5,
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 12 }}>2</Text>
                  </Animatable.View>
                  <Animatable.View
                    animation="fadeInUp"
                    duration={800}
                    delay={600}
                    style={{
                      backgroundColor: "#CD7F32", // Bronce para el número 3
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginHorizontal: 5,
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 12 }}>3</Text>
                  </Animatable.View>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Extra"
        component={AddNavigation}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animatable.View
              animation={focused ? "bounceIn" : undefined}
              duration={1000}
            >
              <Ionicons name="search" size={size} color={color} />
            </Animatable.View>
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
