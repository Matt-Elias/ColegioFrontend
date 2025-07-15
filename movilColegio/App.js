import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../movilColegio/context/AuthContext";
import MainNavigator from "../movilColegio/navigation/AppNavigator";
import "./global.css";
import "nativewind";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

