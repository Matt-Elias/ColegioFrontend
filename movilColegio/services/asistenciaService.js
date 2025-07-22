import axios from "axios";
const API_URL = "http://192.168.1.93:8080";

const asistenciaService = {
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
      if (!response.data?.result?.[0]) {
        throw new Error('La respuesta no contiene datos de la asistencia');
      }
      
      return {
        success: true,
        data: response.data.result[0],
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
  },

  postDatosAsistencia: async (token) => {
    try {
      console.log("[asistenciaService] Token recibido:", token);

      if (!token) {
        throw new Error('Token no proporcionado');
      }

      const response = await axios.post(`${API_URL}/registroAsistencia/crearAsistencia`, {
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
      if (!response.data?.result?.[0]) {
        throw new Error('La respuesta no contiene datos de la asistencia');
      }
      
      return {
        success: true,
        data: response.data.result[0],
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
