import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Image, Alert } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import QRReader from "../../components/QRReader";

const AdminHomeScreen = () => {
  const { logout, user } = useContext(AuthContext);  // En lugar de userToken
  const [mostrarEscaner, setMostrarEscaner] = useState(false);
  const [estudianteData, setEstudianteData] = useState(null);

  const manejarEscaner = async (qrData) => {
    setMostrarEscaner(false);
    setEstudianteData(qrData);

    if (!user?.token || !qrData?.estudiante?.matricula) {
      console.warn("Faltan parámetros requeridos");
      return;
    }

  };

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

            <Text className="text-gray-600 text-lg font-semibold">Asistencia</Text>

            <View className="flex-row space-x-4 gap-4">
              <View className="flex-1">
                <TouchableOpacity className="bg-green-500 py-3 px-4 rounded-lg" >
                  <Text className="text-white text-base font-bold text-center">Entrada</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" >
                  <Text className="text-white text-base font-bold text-center">Salida</Text>
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
