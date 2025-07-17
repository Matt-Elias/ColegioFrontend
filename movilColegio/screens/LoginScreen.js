import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import authService from '../services/authService'; // Adjust the path as needed

const LoginScreen = ({ navigation }) => {
  const { login: authLogin } = useContext(AuthContext); // Renombrado para evitar conflicto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const manejarLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }

    setEstaCargando(true);
    try {
      console.log("Iniciando login...");
      const result = await authService.login({
        correoElectronico: username,
        contrasena: password
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
    <View className="bg-blue-950 h-full py-3 px-20 gap-10">
      <Image source={require('../img/LogoColegio.png')} style={styles.image} className="" />

      <Text className="text-3xl font-bold text-white mb-4 text-center">
        Bienvenido
      </Text>

      <TextInput
        className= "bg-gray-500 text-white block w-full rounded-lg py-3 px-4" 
        placeholder="Usuario"
        autoCapitalize="none"
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        className= "bg-gray-500 text-white block w-full rounded-lg py-3 px-4"
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password }
      />

      <View className="gap-10">
        <TouchableOpacity className="bg-blue-600 rounded-lg py-3" onPress={manejarLogin} disabled={estaCargando}>
          <Text className="text-white text-center">
            {estaCargando ? "Cargando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );

}

export default LoginScreen;
