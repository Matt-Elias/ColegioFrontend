import axios from "axios";
import { API_URL } from '@env';

const asistenciaService = {
  registrarDatosAsistencia: async (token, registroData) => {
    try {
      console.log("[asistenciaService] Token recibido:", token);
      console.log("[asistenciaService] Datos de registro:", registroData);

      if (!token) {
        throw new Error('Token no proporcionado');
      }
      
      const response = await axios.post(
        `${API_URL}/registroAsistencia/crearAsistencia`, 
        registroData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500
        }
      );
      
      console.log("[asistenciaService] Respuesta completa:", response);
      
      if (response.status === 401) {
        throw new Error('No autorizado - Token inválido o expirado');
      }
      if (response.status !== 200) {
        throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Modificación aquí - la respuesta no viene en un array [0]
      if (!response.data?.result) {
        throw new Error('La respuesta no contiene datos de la asistencia');
      }
      
      return {
        success: true,
        data: response.data.result, // Cambiado de result[0] a result
        message: response.data.text || 'Asistencia registrada correctamente'
      };
    } catch (error) {
      console.error("[asistenciaService] Error detallado:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        error: error
      };
    }
  },

  getDatosAsistencia: async (token) => {
    try {
      console.log("[asistenciaService] Token recibido:", token);

      if (!token) {
        throw new Error('Token no proporcionado');
      }
      const response = await axios.get(`${API_URL}/registroAsistencia/listadoAsistencia`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        validateStatus: (status) => status < 500
      });
      
      console.log("[asistenciaService] Respuesta completa:", response);
      if (response.status === 401) {
        throw new Error('No autorizado - Token inválido o expirado');
      }
      if (response.status !== 200) {
        throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      // Modificación aquí - la respuesta no viene en un array [0]
      if (!response.data?.result) {
        throw new Error('La respuesta no contiene datos de la asistencia');
      }
      
      return {
        success: true,
        data: response.data.result, // Cambiado de result[0] a result
        message: response.data.text
      };
    } catch (error) {
      console.error("[asistenciaService] Error detallado:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        error: error
      };
    }
  }
};

export default asistenciaService;