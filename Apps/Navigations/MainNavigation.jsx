import { createStackNavigator } from "@react-navigation/stack";
import ProfileForm from "../Screens/Forms/ProfileForm";
import TabNavigation from "./TabNavigation";

const Stack = createStackNavigator();
export default function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileForm" component={ProfileForm} />
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  );
}
