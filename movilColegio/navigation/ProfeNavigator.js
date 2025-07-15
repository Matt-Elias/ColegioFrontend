import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfesorHomeScreen from "../screens/Profesor/ProfesorHomeScreen";
import ChatsProfeScreen from "../screens/Profesor/ChatsProfeScreen";
import ChatConPadreScreen from "../screens/Profesor/ChatConPadreScreen"; 

const Drawer = createDrawerNavigator();

const ProfeNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Inicio" component={ProfesorHomeScreen} />
    <Drawer.Screen name="ChatsProfe" component={ChatsProfeScreen} />
    <Drawer.Screen name="ChatsConPadre" component={ChatConPadreScreen} />
  </Drawer.Navigator>
);

export default ProfeNavigator;
