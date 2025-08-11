import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
//import DatosEstudianteScreen from "../screens/Estudiante/DatosEstudianteScreen";
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

const AdminNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="AdminHome" component={AdminHomeScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
    {
      /**
       * <Drawer.Screen name="Historial" component={DatosEstudianteScreen} options={{drawerIcon: ({color, size}) => (<Ionicons name="clipboard-outline" size={size} color={color} />) }} />
       */
    }
  </Drawer.Navigator>
);

export default AdminNavigator;
