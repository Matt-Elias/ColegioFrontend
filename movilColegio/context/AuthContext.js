import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context; 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);

  useEffect(()=>{
    cargarUsuarioData();
  }, []);

  const cargarUsuarioData = async() => {
    try {
      const [token, role, correoElectronico, idUsuario] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("role"),
        AsyncStorage.getItem("correoElectronico"),
        AsyncStorage.getItem("idUsuario")
      ]);
      if (token && role) {
        setUser({ token, role, correoElectronico, idUsuario });
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setEstaCargando(false);
    }
  } 

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "role",
        "correoElectronico",
        "idUsuario"
      ]);
      setUser(null);
    } catch (error) {
      console.error("Error en logout:", error);
    }
  }

  const login = async (userData, navigation) => {
    try {
      console.log("Iniciando login en AuthContext con:", userData);
      //const result = await authService.login(credentials); // Asegúrate que esto llame a tu authService.login

      // Guarda los datos en AsyncStorage
      await AsyncStorage.multiSet([
        //["token", userData.data.token],
        //["role", userData.data.role], // Asegúrate que el rol esté incluido
        ["token", userData.token], // Ahora accedemos directamente a userData.token
        ["role", userData.role],
        ["correoElectronico", userData.correoElectronico],
        ["idUsuario", String(userData.idUsuario)] // Convertir a string si es número
      ]);

      // Actualiza el estado del usuario
      setUser(userData);
      console.log("Usuario establecido:", userData);

      // Redirige basado en el rol
      redirectBasedOnRole(userData.role, navigation);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const redirectBasedOnRole = (role, navigation) => {
    switch (role?.toUpperCase()) {
      case "ADMINISTRADOR":
        navigation.replace("AdminDrawer");
        break;
      case "PADRE":
        navigation.replace("PadreDrawer");
        break;
      case "PROFESOR":
        navigation.replace("ProfeDrawer");
        break;
      default:
        navigation.replace("Login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, estaCargando, login, logout, cargarUsuarioData }}>
      {children}
    </AuthContext.Provider>
  );
};

