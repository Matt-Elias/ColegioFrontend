import axios from "axios";
const API_URL = "http://192.168.1.93:8080";

const estudianteService = {
  getDatosEstudiante: async (token, idEstudiante) => {
    try {
      console.log("[estudianteService] Obteniendo datos del estudiante ID:", idEstudiante);
      
      if (!token || !idEstudiante) {
        throw new Error('Token o ID de estudiante no proporcionado');
      }

      const response = await axios.get(`${API_URL}/usuario/buscarEstudiante/${idEstudiante}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        validateStatus: (status) => status < 500
      });
      
      console.log("[estudianteService] Respuesta del estudiante:", response.data);
      
      if (response.status === 401) {
        throw new Error('No autorizado - Token inválido o expirado');
      }
      if (response.status !== 200) {
        throw new Error(response.data?.message || `Error ${response.status}`);
      }
      
      if (!response.data?.result?.[0]) {
        throw new Error('No se encontraron datos del estudiante');
      }
      
      // Mapeamos los datos a un objeto con propiedades nombradas para mejor legibilidad
      const estudianteData = response.data.result[0];
      const estudiante = {
        id: estudianteData[0],
        username: estudianteData[1],
        correo: estudianteData[2],
        nombreCompleto: estudianteData[3],
        fechaRegistro: estudianteData[4],
        activo: estudianteData[5] ? 'Activo' : 'Inactivo',
        rol: estudianteData[6],
        imagenUrl: estudianteData[7],
        idEntidadEstudiante: estudianteData[8],
        idInterseccion: estudianteData[9],
        matricula: estudianteData[10],
        tipoEstudiante: estudianteData[11],
        idGradoGrupo: estudianteData[12],
        gradoGrupo: estudianteData[13],
        idNivel: estudianteData[14],
        nivelAcademico: estudianteData[15]
      };
      
      return {
        success: true,
        data: estudiante,
        message: response.data.text
      };
    } catch (error) {
      console.error("[estudianteService] Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.message,
        status: error.response?.status,
        error: error
      };
    }
  }
};

export default estudianteService;
