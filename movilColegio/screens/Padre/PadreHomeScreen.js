import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import padreService from "../../services/padreService";
import estudianteService from "../../services/estudianteService";
import notificacionService from "../../services/notificacionService";
import useOneSignal from "../../hooks/useOneSignal";
import { OneSignal } from 'react-native-onesignal';

const PadreHomeScreen = () => {
  const { logout, user } = useContext(AuthContext);
  const [datosPadre, setDatosPadre] = useState(null);
  const [datosEstudiante, setDatosEstudiante] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cargarEstudiante, setCargandoEstudiante] = useState(false);

  const { playerId, isReady, subscriptionStatus ,getTokenData } = useOneSignal();

    // En PadreHomeScreen.js después del hook useOneSignal
    useEffect(() => {
      if (isReady && user?.idUsuario) {
        const loginOneSignal = async () => {
          try {
            console.log("[PadreHomeScreen] Haciendo login en OneSignal con ID:", user.idUsuario);
            OneSignal.login(user.idUsuario.toString());
            
            console.log("[PadreHomeScreen] Login exitoso en OneSignal ----> ./");
          } catch (error) {
            console.error("[PadreHomeScreen] Error en login OneSignal: <----->", error);
          }
        };
        loginOneSignal();
      }
    }, [isReady, user?.idUsuario]);

  useEffect(() => {
    const registrarToken = async () => {
      // Only proceed if user is actually subscribed
      if (isReady && playerId && subscriptionStatus === 'Subscribed' && user?.idUsuario && user?.token) {
        try {
          console.log("[PadreHomeScreen] Registering OneSignal token...");
          console.log("[PadreHomeScreen] Subscription status:", subscriptionStatus);
          
          const tokenData = getTokenData(user.idUsuario);

          if (tokenData) {
            const result = await notificacionService.registrarDispositivoToken(
              user.token,
              tokenData
            );
            
            if (result.success) {
              console.log("[PadreHomeScreen] Token registered successfully");
            } else {
              console.warn("[PadreHomeScreen] Token registration failed:", result.message);
            }
          }
        } catch (error) {
          console.error("[PadreHomeScreen] Error registering token:", error);
        }
      } else {
        console.log("[PadreHomeScreen] Not ready to register token:", {
          isReady,
          playerId: !!playerId,
          subscriptionStatus,
          hasUser: !!user?.idUsuario
        });
      }
    };

    registrarToken();
  }, [isReady, playerId, subscriptionStatus, user?.idUsuario, user?.token]);


  useEffect(() => {
    const obtenerDatosPadre = async () => {
      try {
        setCargando(true);
        setError(null);
        
        console.log("[PadreHomeScreen] User object:", user);
        
        if (!user || !user.token || !user.idUsuario) {
          const errorMsg = !user ? "No hay usuario" : !user.token ? "Falta token" : "Falta idUsuario";
          throw new Error(`Error de autenticación: ${errorMsg}`);
        }

        const resultPadre = await padreService.getDatosPadre(user.token, user.idUsuario);

        if (!resultPadre.success) {
          throw new Error(resultPadre.message);
        }

        console.log("[PadreHomeScreen] Resultado del servicio:", resultPadre);
        
        if (resultPadre.success) {
          setDatosPadre(resultPadre.data);
        } else {
          throw new Error(resultPadre.message || "Error al obtener datos del padre");
        }

        if (resultPadre.data[8]) {
          setCargandoEstudiante(true);
          const resultEstudiante = await estudianteService.getDatosEstudiante(
            user.token, 
            resultPadre.data[8] // ID del estudiante
          );

          if (resultEstudiante.success) {
            setDatosEstudiante(resultEstudiante.data);
          } else {
            console.warn("Estudiante no encontrado:", resultEstudiante.message);
          }
        }

      } catch (err) {
        console.error("[PadreHomeScreen] Error:", err);
        setError(err.message || "Error al cargar los datos");
        
        // Si es error 401, forzar logout
        if (err.response?.status === 401 || err.message.includes('No autorizado')) {
          logout();
        }
      } finally {
        setCargando(false);
        setCargandoEstudiante(false);
      }
    };
    
    obtenerDatosPadre();
  }, [user, logout]);

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600"> Configurando notificaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-lg mb-4">Error: {error}</Text>
        <Text className="text-gray-700 mb-2">Usuario: {user?.correoElectronico || 'No disponible'}</Text>
        <Text className="text-gray-700 mb-4">ID: {user?.idUsuario || 'No disponible'}</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
          onPress={() => logout()}
        >
          <Text className="text-white">Volver al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="bg-blue-400">
      <View className="h-full py-6 px-6 gap-4">
        <Text className="text-2xl font-bold text-center text-sky-50">Colegio bilingüe portugués</Text>
        
        <View className="bg-white p-3 rounded-lg border-l-4 border-green-500">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold">Notificaciones</Text>
              
              <Text className="text-gray-500 text-sm">
                {isReady && subscriptionStatus === 'Subscribed' ? 
                  "Configuradas correctamente" : 
                  subscriptionStatus === 'Not Subscribed' ?
                  "Permisos denegados - Toca para configurar" :
                  "Configurando..."
                }
              </Text>
              
            </View>
          </View>
        </View>
        
        {datosPadre ? (
          <View className="bg-white p-4 rounded-lg gap-4">
            
            <View className="gap-1">
              <Text className="text-xl font-semibold text-center text-gray-700">Datos del tutor/a</Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Nombre</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg">{datosPadre[3]}</Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Correo electronico</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosPadre[2]} </Text>
            </View>
            
            {datosPadre?.[8] && (
              <View className="bg-sky-50 p-4 rounded-lg border border-sky-100 gap-3">
                <Text className="font-semibold mb-2 gap-1 text-center text-gray-700 text-xl">Datos de tu hijo/a</Text>

                {cargarEstudiante ? (
                  <View className="flex-row items-center py-2">
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text className="ml-2">Cargando datos del estudiante...</Text>
                  </View>
                ) : datosEstudiante ? (
                  <>
                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Nombre </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.nombreCompleto} </Text>
                    </View>
                      
                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Matricula </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.matricula} </Text>
                    </View>

                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Estado </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.activo} </Text>
                    </View>

                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Nivel academico </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.nivelAcademico} </Text>
                    </View>
                      
                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Grado y grupo </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.gradoGrupo} </Text>
                    </View>
                      
                    <View className="gap-1">
                      <Text className="text-gray-600 text-lg font-semibold">Tipo </Text>
                      <Text className="bg-white block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosEstudiante.tipoEstudiante} </Text>
                    </View>

                    <View className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                      <Text className="text-blue-700 font-semibold text-center"> Notificaciones de Asistencia</Text>

                      <Text className="text-blue-600 text-sm text-center mt-1">
                        Recibirás notificaciones cuando tu hijo/a entre o salga del colegio
                      </Text>
                    </View>

                  </>
                ): (
                  <Text className="text-yellow-600">No se encontraron datos completos del estudiante</Text>
                )}
              </View>
            )}    
          
          </View>
        ) : (
          <Text className="text-red-500">No se encontraron datos del padre</Text>
        )}
        
        <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PadreHomeScreen;
