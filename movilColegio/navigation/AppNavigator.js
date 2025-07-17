import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import AdminNavigator from "../navigation/AdminNavigator";
import PadreNavigator from "../navigation/PadreNavigator";
import ProfeNavigator from "../navigation/ProfeNavigator";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { user, estaCargando } = useContext(AuthContext);

  if (estaCargando) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {user.role?.toUpperCase() === "ADMINISTRADOR" && (
              <Stack.Screen name="AdminDrawer" component={AdminNavigator} />
            )}
            {user.role?.toUpperCase() === "PADRE" && (
              <Stack.Screen name="PadreDrawer" component={PadreNavigator} />
            )}
            {user.role?.toUpperCase() === "PROFESOR" && (
              <Stack.Screen name="ProfeDrawer" component={ProfeNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
