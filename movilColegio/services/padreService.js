import axios from "axios";
import { API_URL } from '@env';

const padreService = {
  getDatosPadre: async (token, idUsuario) => {
    try {
      console.log("[padreService] Token recibido:", token);
      console.log("[padreService] ID Usuario recibido:", idUsuario);
      
      if (!token || !idUsuario) {
        throw new Error('Token o ID de usuario no proporcionado');
      }

      const response = await axios.get(`${API_URL}/usuario/buscarPadre/${idUsuario}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        validateStatus: (status) => status < 500
      });
      
      console.log("[padreService] Respuesta completa:", response);
      
      if (response.status === 401) {
        throw new Error('No autorizado - Token inválido o expirado');
      }
      if (response.status !== 200) {
        throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      if (!response.data?.result?.[0]) {
        throw new Error('La respuesta no contiene datos del padre');
      }
      
      return {
        success: true,
        data: response.data.result[0],
        message: response.data.text
      };
    } catch (error) {
      console.error("[padreService] Error detallado:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        error: error
      };
    }
  }
};

export default padreService;
