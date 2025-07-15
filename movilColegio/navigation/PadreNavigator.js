import { createDrawerNavigator } from "@react-navigation/drawer";
import PadreHomeScreen from "../screens/Padre/PadreHomeScreen";
import ChatsPadreScreen from "../screens/Padre/ChatsPadreScreen";
import ChatConProfeScreen from "../screens/Padre/ChatConProfeScreen";

const Drawer = createDrawerNavigator();

const PadreNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={PadreHomeScreen} />
    <Drawer.Screen name="ChatsPadre" component={ChatsPadreScreen} />
    <Drawer.Screen name="ChatsConProfe" component={ChatConProfeScreen} />
  </Drawer.Navigator>
);

export default PadreNavigator;
