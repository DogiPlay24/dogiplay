import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./../Screens/HomeScreen";
const Stack = createStackNavigator();
export default function HomeNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='home' component={HomeScreen} />
        </Stack.Navigator>
    )
}