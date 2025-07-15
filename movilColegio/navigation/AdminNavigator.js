import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import DatosEstudianteScreen from "../screens/Estudiante/DatosEstudianteScreen";

const Drawer = createDrawerNavigator();

const AdminNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="AdminHome" component={AdminHomeScreen} />
    <Drawer.Screen name="DatosEstudiante" component={DatosEstudianteScreen} />
  </Drawer.Navigator>
);

export default AdminNavigator;
