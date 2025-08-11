import { View, Text, TouchableOpacity, ScrollView, Modal, Image, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import QRReader from "../../components/QRReader";
import estudianteService from "../../services/estudianteService";
import asistenciaService from "../../services/asistenciaService";
import notificacionService from "../../services/notificacionService";

const AdminHomeScreen = () => {
  const { logout, user } = useContext(AuthContext);  // En lugar de userToken
  const [mostrarEscaner, setMostrarEscaner] = useState(false);
  const [estudianteData, setEstudianteData] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (user?.token) {
      try {
        const tokenParts = user.token.split('.');

        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          const exp = payload.exp;

          console.log('[DEBUG] Token exp:', new Date(exp * 1000));
          console.log('[DEBUG] Tiempo actual:', new Date());
          console.log('[DEBUG] Token válido:', exp > now);

          if (exp <= now) {
            console.error('[DEBUG] TOKEN EXPIRADO - Cerrando sesión');
            Alert.alert(
              'Sesión Expirada',
              'Tu sesión ha expirado. Serás redirigido al login.',
              [{ text: 'OK', onPress: () => logout() }]
            );
          }
        }

      } catch (error) {
        console.error('[DEBUG] Error decodificando token:', error);
      }
    }
  }, [user]);

  const manejarEscaner = async (qrData) => {
    setMostrarEscaner(false);
    setEstudianteData(qrData);

    if (!user?.token || !qrData?.estudiante?.idEstudiante) {
      console.warn("Faltan parámetros requeridos");
      return;
    }

    try {
      const result = await estudianteService.getDatosEstudiante(
        user.token,
        qrData.estudiante.idEstudiante
      );

      if (!user?.token) {
        Alert.alert("Error", "No hay sesión activa. Por favor inicie sesión.");
        return;
      }
      if (!qrData?.estudiante?.idEstudiante) {
        Alert.alert("Error", "El código QR no contiene información válida del estudiante");
        return;
      }
      if (result.success) {
        setApiData(result.data);
      } else {
        Alert.alert("Error", result.message || "No se pudo obtener información adicional");
      }

    } catch (error) {
      console.error("Error al obtener datos del estudiante:", error);
      Alert.alert("Error", "Ocurrió un error al consultar los datos del estudiante");
    }
  };

  const registrarAsistencia = async(tipoRegistro) => {
    if (!user?.token || !estudianteData?.estudiante?.idEstudiante) {
      Alert.alert("Error", "Datos incompletos para registrar la asistencia");
      return;
    }

    setCargando(true);

    const registroData = {
      idUsuario: user.idUsuario, // Asegúrate que el contexto de autenticación proporcione el id del usuario
      registro: tipoRegistro,
      idEstudiante: estudianteData.estudiante.idEstudiante
    }

    try {
      const result = await asistenciaService.registrarDatosAsistencia(
        user.token,
        registroData
      );
      
      if (result.success) {
        console.log("[AdminHomeScreen] Asistencia registrada exitosamente");

        // Variable para controlar si ya se mostró un alert
        let alertMostrado = false;

        try {
          console.log("[AdminHomeScreen] Enviando notificación...");

          const notificacionData = {
            idEstudiante: estudianteData.estudiante.idEstudiante,
            nombreEstudiante: estudianteData.nombreCompleto,
            tipoRegistro: tipoRegistro,
            fechaHora: new Date().toISOString()
          };

          const notificacionResult = await notificacionService.enviarNotificacionAsistencia(
            user.token,
            notificacionData
          );

          if (notificacionResult.success) {
            console.log("[AdminHomeScreen] Notificación enviada exitosamente");

            Alert.alert(
              "¡Éxito!", 
              `Asistencia registrada correctamente.\nNotificación enviada a los padres.`,
              [{ text: "OK" }]
            );
            alertMostrado = true;

          } else {
              console.warn("[AdminHomeScreen] Error enviando notificación:", notificacionResult.message);
              
              Alert.alert(
                "Parcialmente exitoso", 
                `Asistencia registrada correctamente.\nAdvertencia: ${notificacionResult.message}`,
                [{ text: "OK" }]
              );
              alertMostrado = true;
          }

        } catch (error) {
          //console.error("[AdminHomeScreen] Error enviando notificación:", error);
          
          Alert.alert(
            "Parcialmente exitoso", 
            "Asistencia registrada correctamente.\nNo se pudo enviar la notificación a los padres.",
            [{ text: "OK" }]
          );
          alertMostrado = true;
        }

        // Limpiar los datos después de registrar
        setEstudianteData(null);
        setApiData(null);

      } else {
        console.error("[AdminHomeScreen] Error registrando asistencia:", result.message); //Checarlo
        Alert.alert("Error", result.message || "No se pudo registrar la asistencia");
      }

    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      Alert.alert("Error", "Ocurrió un error al registrar la asistencia");
    } finally {
      setCargando(false);
    }

  };

  const styles = {
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginTop: 0,
      alignSelf: 'center',
    },
  };

  return (
    <ScrollView className="bg-blue-400">
      <View className="h-full py-6 px-6 gap-6"> 

        <View className="flex-row items-center space-x-16 gap-3">
            <Text className="text-2xl font-bold text-left text-sky-50">Sección: Escaneo de estudiantes</Text>
            
            <View className="">
              <TouchableOpacity className="py-3 px-3 bg-slate-500 border border-slate-200 rounded-lg"
                onPress={()=> setMostrarEscaner(true)}
              >
                <Ionicons name="qr-code-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
        </View>

        {/**<Image source={require('../../img/ColegioFondoProfe.png')} style={styles.image} /> */}

        {estudianteData && (
          <View className="bg-white p-4 rounded-lg shadow">
            <Text className="text-xl font-semibold text-left text-gray-700"> Datos del QR:</Text>

            {estudianteData.urlImagen && (
              <Image 
                source={{ uri: estudianteData.urlImagen }} 
                className="w-24 h-24 rounded-full self-center mb-2"
              />
            )}
          
            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Nombre</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {estudianteData.nombreCompleto} </Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Correo electronico</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {estudianteData.correoElectronico} </Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Matricula</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {estudianteData.estudiante.matricula} </Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Tipo</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {estudianteData.estudiante.tipo} </Text>
            </View> 

            {apiData && (
              <View>
                <View className="gap-1">
                  <Text className="text-gray-600 text-lg font-semibold">Grado/Grupo</Text>
                  <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {apiData.gradoGrupo} </Text>
                </View>    

                <View className="gap-1">
                  <Text className="text-gray-600 text-lg font-semibold">Nivel academico</Text>
                  <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {apiData.nivelAcademico} </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-gray-600 text-lg font-semibold">Estado</Text>
                  <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-green-500 text-lg"> {apiData.activo} </Text>
                </View>
              </View>
           )}

            <Text className="text-gray-600 text-lg font-semibold">Asistencia</Text>
            <View className="flex-row space-x-4 gap-4">

              <View className="flex-1">
                <TouchableOpacity 
                  className="bg-green-500 py-3 px-4 rounded-lg" 
                  onPress={() => registrarAsistencia("Entrada")}
                  disabled={cargando}
                >  
                  <Text className="text-white text-base font-bold text-center">
                    {cargando ? "Procesando..." : "Entrada"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <TouchableOpacity 
                  className="bg-red-500 py-3 px-4 rounded-lg" 
                  onPress={() => registrarAsistencia("Salida")}
                  disabled={cargando}
                >
                  <Text className="text-white text-base font-bold text-center">
                    {cargando ? "Procesando..." : "Salida"}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

            {cargando && (
              <View className="mt-3 p-2 bg-blue-50 rounded-lg">
                <Text className="text-blue-600 text-center">
                  Registrando asistencia...{"\n"}
                  Enviando notificación a los padres...
                </Text>
              </View>
            )} 

          </View>
        )}

        {/**
         *<TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
          </TouchableOpacity>
         * 
         */}
      </View>

      <Modal
        visible={mostrarEscaner}
        transparent={false}
        animationType="slide"
        onRequestClose={()=> setMostrarEscaner(false)}
      >
        <QRReader
          onScan={manejarEscaner}
          onClose={()=> setMostrarEscaner(false)} />

      </Modal>

    </ScrollView>
  );
};

export default AdminHomeScreen;
