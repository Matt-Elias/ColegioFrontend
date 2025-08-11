import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import ProfesorHomeScreen from "../screens/Profesor/ProfesorHomeScreen";
//import ChatsProfeScreen from "../screens/Profesor/ChatsProfeScreen";
//import ChatConPadreScreen from "../screens/Profesor/ChatConPadreScreen"; 
import { Ionicons } from '@expo/vector-icons';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label="Cerrar Sesión"
        onPress={logout}
        icon={({ color, size }) => (
          <Ionicons name="exit-outline" size={size} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
}

const ProfeNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Inicio" component={ProfesorHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    {/**
     *<Drawer.Screen name="ChatsProfe" component={ChatsProfeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="ChatsConPadre" component={ChatConPadreScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} />
     */}
  </Drawer.Navigator>
);

export default ProfeNavigator;
