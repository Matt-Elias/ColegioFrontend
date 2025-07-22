import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Image, Alert } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import QRReader from "../../components/QRReader";
import estudianteService from "../../services/estudianteService";
import asistenciaService from "../../services/asistenciaService";

const AdminHomeScreen = () => {
  const { logout, user } = useContext(AuthContext);  // En lugar de userToken
  const [mostrarEscaner, setMostrarEscaner] = useState(false);
  const [estudianteData, setEstudianteData] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [cargando, setCargando] = useState(false);

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
        Alert.alert("Éxito", "Asistencia registrada correctamente");
        // Limpiar los datos después de registrar
        setEstudianteData(null);
        setApiData(null);
      } else {
        Alert.alert("Error", result.message || "No se pudo registrar la asistencia");
      }

    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      Alert.alert("Error", "Ocurrió un error al registrar la asistencia");
    } finally {
      setLoading(false);
    }

  }

  return (
    <ScrollView className="bg-blue-400">
      <View className="h-full py-6 px-6 gap-6"> 

        <View className="flex-row items-center space-x-4 gap-3">
            <View className="flex-auto">
              <TextInput className="border border-gray-300 px-4 py-3 rounded-lg bg-white" placeholder="Buscar estudiante" />
            </View>
            
            <View className="">
              <TouchableOpacity className="py-3 px-3 bg-slate-500 border border-slate-200 rounded-lg"
                onPress={()=> setMostrarEscaner(true)}
              >
                <Ionicons name="qr-code-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
        </View>

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

          </View>
        )}

        <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
        </TouchableOpacity>
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
