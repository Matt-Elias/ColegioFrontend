import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import PadreHomeScreen from "../screens/Padre/PadreHomeScreen";
//import ChatsPadreScreen from "../screens/Padre/ChatsPadreScreen";
//import ChatConProfeScreen from "../screens/Padre/ChatConProfeScreen";
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

const PadreNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="PadreHome" component={PadreHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    {/**
     *<Drawer.Screen name="ChatsPadre" component={ChatsPadreScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="ChatsConProfe" component={ChatConProfeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} /> 
     */}
  
  </Drawer.Navigator>
);

export default PadreNavigator;
