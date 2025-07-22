import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import DatosEstudianteScreen from "../screens/Estudiante/DatosEstudianteScreen";
import { Ionicons } from '@expo/vector-icons'

const Drawer = createDrawerNavigator();

const AdminNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="AdminHome" component={AdminHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    <Drawer.Screen name="Historial" component={DatosEstudianteScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="clipboard-outline" size={size} color={color} />) }} />
  </Drawer.Navigator>
);

export default AdminNavigator;
