import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfesorHomeScreen from "../screens/Profesor/ProfesorHomeScreen";
import ChatsProfeScreen from "../screens/Profesor/ChatsProfeScreen";
import ChatConPadreScreen from "../screens/Profesor/ChatConPadreScreen"; 
import { Ionicons } from '@expo/vector-icons'

const Drawer = createDrawerNavigator();

const ProfeNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Inicio" component={ProfesorHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    <Drawer.Screen name="ChatsProfe" component={ChatsProfeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color={color} />) }} />
    <Drawer.Screen name="ChatsConPadre" component={ChatConPadreScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} />
  </Drawer.Navigator>
);

export default ProfeNavigator;
