import { createDrawerNavigator } from "@react-navigation/drawer";
import PadreHomeScreen from "../screens/Padre/PadreHomeScreen";
import ChatsPadreScreen from "../screens/Padre/ChatsPadreScreen";
import ChatConProfeScreen from "../screens/Padre/ChatConProfeScreen";
import { Ionicons } from '@expo/vector-icons'

const Drawer = createDrawerNavigator();

const PadreNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="PadreHome" component={PadreHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    <Drawer.Screen name="ChatsPadre" component={ChatsPadreScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubbles-outline" size={size} color={color} />) }} />
    <Drawer.Screen name="ChatsConProfe" component={ChatConProfeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} />
  </Drawer.Navigator>
);

export default PadreNavigator;
