import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import profesorService from "../../services/profesorService";

const ProfesorHomeScreen = () => {
  const { logout, user } = useContext(AuthContext);
  const [cargando, setCargando] = useState(null);
  const [datosProfesor, setDatosProfesor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=> {
    const obtenerDatosProfesor = async () => {
      try {
        setCargando(true);
        setError(null);

        console.log("[ProfesorHomeScreen] User object:", user);

        if (!user || !user.token || !user.idUsuario) {
          const errorMsg = !user ? "No hay usuario" : !user.token ? "Falta token" : "Falta idUsuario";
          throw new Error(`Error de autenticación: ${errorMsg}`);
        }

        const resultProfesor = await profesorService.getDatosProfesor(user.token, user.idUsuario);

        if (!resultProfesor.success) {
          throw new Error(resultProfesor.message);
        }

        console.log("[ProfesorHomeScreen] Resultado del servicio:", resultProfesor);

        if (resultProfesor.success) {
          setDatosProfesor(resultProfesor.data);
        } else {
          throw new Error(resultProfesor.message || "Error al obtener datos del padre");
        }

      } catch (err) {
        //console.error("[ProfesorHomeScreen] Error:", err);
        setError(err.message || "Error al cargar los datos");
        
        // Si es error 401, forzar logout
        if (err.response?.status === 401 || err.message.includes('No autorizado')) {
          logout();
        }

      } finally {
        setCargando(false);
      }
    };

    obtenerDatosProfesor();
  }, [user, logout]);

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        {/**<Text className="text-red-500 text-lg mb-4">Error: {error}</Text> */}  
        <Text className="text-red-500 text-lg mb-4 text-center">Error: El profesor, no tiene asignado una materia. Conctacte con el Administrador del colegio para que se le asigne alguna.</Text>
        <Text className="text-gray-700 mb-2">Usuario: {user?.nombreCompleto || 'No disponible'}</Text>
        <Text className="text-gray-700 mb-2">Correo: {user?.correoElectronico || 'No disponible'}</Text>
        {/**<Text className="text-gray-700 mb-4">ID: {user?.idUsuario || 'No disponible'}</Text> */}
        <TouchableOpacity 
          className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
          onPress={() => logout()}
        >
          <Text className="text-white">Volver al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <View className="h-full py-6 px-6 gap-4">
        {/**
         * <Text className="text-2xl font-bold text-center text-sky-50">Colegio bilingüe portugués</Text>
         */}

        <Image source={require('../../img/ColegioFondoProfe.png')} style={styles.image} />

        {datosProfesor ? (
          <View className="bg-white p-4 rounded-lg gap-4">

            <View className="gap-1">
              <Text className="text-xl font-semibold text-center text-gray-700">Datos profesor/a</Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Nombre</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg">{datosProfesor[3]}</Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Correo electronico</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosProfesor[2]} </Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-600 text-lg font-semibold">Materia impartida</Text>
              <Text className="bg-gray-100 block rounded-lg py-2 px-2 text-gray-500 text-lg"> {datosProfesor[10]} </Text>
            </View>

          </View>
        ) : (
          <Text className="text-red-500">No se encontraron datos del profesor</Text>
        )}

        {/**
         *<TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
          </TouchableOpacity>
         */}

      </View>
    </ScrollView>
  );
};

export default ProfesorHomeScreen;
