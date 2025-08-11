import axios from "axios";
import { API_URL } from '@env';

const notificacionService = {
    registrarDispositivoToken: async (token, tokenData) => {
        try {
            console.log("[notificacionService] Registrando token del dispositivo:", tokenData);
            
            if (!token) {
                throw new Error("Token de autorizacion no proporcionado");
            }

            // FORZAR SIEMPRE UN UUID VÁLIDO
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!tokenData.claveOneSignalId || !uuidRegex.test(tokenData.claveOneSignalId)) {
                const oldId = tokenData.claveOneSignalId;
                tokenData.claveOneSignalId = generateValidUUID();
                console.warn("[notificacionService] UUID inválido:", oldId);
                console.log("[notificacionService] UUID generado:", tokenData.claveOneSignalId);
            } else {
                console.log("[notificacionService] UUID válido confirmado:", tokenData.claveOneSignalId);
            }

            const response = await axios.post(
                `${API_URL}/notificacionToken/registrarDispositivoToken`, 
                tokenData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: `application/json`,
                        'Content-Type': 'application/json'
                    },
                    validateStatus: (status) => status < 500
                }
            );
            
            console.log("[notificacionService] Respuesta registro token:", response.data);

            if (response.status === 401) {
                throw new Error('No autorizado - Token inválido o expirado');
            }
            if (response.status !== 200) {
                throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
            }

            return {
                success: true,
                message: response.data.text || 'Token registrado correctamente'
            };
        } catch (error) {
            console.error("[notificacionService] Error registrando token:", error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                error: error
            };
        }
    },

    enviarNotificacionAsistencia: async (token, notificacionData) => {
        try {
            console.log("[notificacionService] Enviando notificación de asistencia:", notificacionData);
        
            if (!token) {
                throw new Error('Token de autorización no proporcionado');
            }

            const response = await axios.post(
                `${API_URL}/notificacionToken/enviarNotificacionAsistencia`, 
                notificacionData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    validateStatus: (status) => status < 500,
                    timeout: 10000 // 10 segundos timeout
                }
            );

            console.log("[notificacionService] Respuesta notificación:", response.data);
      
            if (response.status === 401) {
                throw new Error('No autorizado - Token inválido o expirado');
            }
            
            if (response.status === 400) {
                // Error específico de OneSignal
                const errorMsg = response.data?.message || response.data?.text || 'Error de formato en OneSignal';
                throw new Error(`Error OneSignal: ${errorMsg}`);
            }
            
            if (response.status !== 200) {
                throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
            }

            return {
                success: true,
                message: response.data.text || 'Notificación enviada correctamente'
            };
        } catch (error) {
            console.error("[notificacionService] Error enviando notificación:", error.response?.data || error.message);
            
            // Manejar errores específicos
            let errorMessage = error.message;
            if (error.response?.data?.text) {
                errorMessage = error.response.data.text;
            }
            
            return {
                success: false,
                message: errorMessage,
                status: error.response?.status,
                error: error
            };
        }
    },

    //MÉTODO NUEVO: Para limpiar tokens inválidos
    limpiarTokensInvalidos: async (token, idUsuario) => {
        try {
            console.log("[notificacionService] Limpiando tokens inválidos para usuario:", idUsuario);
            
            const response = await axios.post(
                `${API_URL}/notificacionToken/limpiarTokensInvalidos`,
                { idUsuario: idUsuario },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    validateStatus: (status) => status < 500
                }
            );

            console.log("[notificacionService] Respuesta limpiar tokens:", response.data);

            if (response.status === 401) {
                throw new Error('No autorizado - Token inválido o expirado');
            }
            if (response.status !== 200) {
                throw new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
            }

            return {
                success: true,
                message: response.data.text || 'Tokens limpiados correctamente'
            };
        } catch (error) {
            console.error("[notificacionService] Error limpiando tokens:", error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                error: error
            };
        }
    },

    // Método para probar notificaciones (modo desarrollo)
    testNotificacion: async (token, estudianteId) => {
        try {
            console.log("[notificacionService] Probando notificación para estudiante:", estudianteId);
            
            const testData = {
                idEstudiante: estudianteId,
                nombreEstudiante: "Estudiante Test",
                tipoRegistro: "Test",
                fechaHora: new Date().toISOString()
            };
            
            return await notificacionService.enviarNotificacionAsistencia(token, testData);
        } catch (error) {
            console.error("[notificacionService] Error en test de notificación:", error);
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }
};

// Función auxiliar para generar UUID válido
const generateValidUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default notificacionService;