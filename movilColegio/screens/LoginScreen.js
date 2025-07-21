import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import authService from '../services/authService'; // Adjust the path as needed

const LoginScreen = ({ navigation }) => {
  const { login: authLogin } = useContext(AuthContext); // Renombrado para evitar conflicto
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const manejarLogin = async () => {
    if (!correoElectronico || !contrasena) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }

    setEstaCargando(true);
    try {
      console.log("Iniciando login...");
      const result = await authService.login({
        correoElectronico: correoElectronico,
        contrasena: contrasena
      });

      console.log("Resultado del login:", result);

      if (result.success) {
        // Luego usamos el contexto para manejar el estado
        //await authLogin(result, navigation);
        await authLogin({
          token: result.data.token,
          role: result.data.role,
          correoElectronico: result.data.correoElectronico,
          idUsuario: result.data.idUsuario
        }, navigation);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert("Error", error.message || "Ocurrió un error al iniciar sesión");
    } finally {
      setEstaCargando(false);
    }
  }

  const styles = {
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginTop: 50,
      alignSelf: 'center',
    },
  };

  return (
    <View className="bg-blue-950 h-full py-3 px-20 gap-6">
      <Image source={require('../img/LogoColegio.png')} style={styles.image} />

      <Text className="text-3xl font-bold text-white mb-4 text-center">
        Bienvenido
      </Text>

      <View className="gap-1">
        <Text className="text-gray-300 text-lg font-semibold">Correo Electronico</Text>

        <TextInput
          className= "bg-gray-400 text-white block w-full rounded-lg py-3 px-3" 
          placeholder="Correo eletronico"
          autoCapitalize="none"
          onChangeText={setCorreoElectronico}
          value={correoElectronico}
        />
      </View>

      <View className="gap-1">
        <Text className="text-gray-300 text-lg font-semibold">Contraseña</Text>

        <TextInput
          className= "bg-gray-400 text-white block w-full rounded-lg py-3 px-3"
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setContrasena}
          value={contrasena}
        />
      </View>

      <View className="gap-1">
        <TouchableOpacity className="bg-blue-600 rounded-lg py-3" onPress={manejarLogin} disabled={estaCargando}>
          <Text className="text-white text-center text-lg">
            {estaCargando ? "Cargando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default LoginScreen;
