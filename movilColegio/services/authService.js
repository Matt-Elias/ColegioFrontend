import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.93:8080";
//20233tn100@utez.edu.mx

//padreEn@gmail.com
//encriptado

//profeEn@gmail.com
//profeEnc

// Exporta un objeto con todas las funciones
const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log("Respuesta completa:", response);
      console.log("Respuesta data:", response.data);
      console.log("Status:", response.status);

      if (response.data?.result?.token) {
        return {
          success: true,
          data: {
            token: response.data.result.token,
            role: response.data.result.tipoUsuario,
            correoElectronico: response.data.result.correoElectronico,
            idUsuario: response.data.result.usuarioId
          },
          message: response.data.text
        };
      }
      return { success: false, message: "Formato inválido" };
    } catch (error) {
      console.error("Error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || "Error de conexión"
      };
    }
  },
  getDatosProtegidos: async () => {
    // ... implementación ...
  },
  verifyToken: async () => {
    // ... implementación ...
  }
};

export default authService; // Exportación por defecto
