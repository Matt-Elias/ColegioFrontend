import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import authService from '../services/authService'; // Adjust the path as needed
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const { login: authLogin } = useContext(AuthContext); // Renombrado para evitar conflicto
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const [esVisible, setEsVisible] = useState(false);
  const toggleVisibilidad = () => setEsVisible((prev) => !prev);
  const [errors, setErrors] = useState({}); // <- Estado para errores
  const [errorGeneral, setErrorGeneral] = useState(""); // <- Error general de login

  const validarCampos = () => {
    let errores = {};

    if (!correoElectronico.trim()) {
      errores.correoElectronico = "El correo es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correoElectronico)) {
        errores.correoElectronico = "El correo no es válido";
      }
    }

    if (!contrasena.trim()) {
      errores.contrasena = "La contraseña es obligatoria";
    }

    setErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const manejarLogin = async () => {
    setErrorGeneral(""); // Limpia el error general

    if (!validarCampos()) {
      return; // No continuar si hay errores
    }

    /*if (!correoElectronico || !contrasena) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }*/

    setEstaCargando(true);
    try {
      //console.log("Iniciando login...");
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
        setErrorGeneral("Correo o contraseña incorrectos. Por favor, vuelva a intentarlo.");
      }
    } catch (error) {
      console.error("Error completo:", error);
      setErrorGeneral("Ocurrió un error al iniciar sesión");
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
    <View className="bg-blue-950 h-full py-3 px-6 gap-3">
      <Image source={require('../img/LogoColegio.png')} style={styles.image} />

      <Text className="text-3xl font-bold text-white mb-4 text-center">
        Bienvenido
      </Text>

      <View className = "bg-white p-8 rounded-2xl gap-7 px-6">
        <View className="gap-1">
          <Text className="text-gray-500 text-lg font-semibold">Correo Electronico</Text>

          <TextInput className= "bg-sky-300 text-white block w-full rounded-lg py-3 px-3" placeholder="Correo eletronico" autoCapitalize="none"
            onChangeText={(text) => {
              setCorreoElectronico(text);
              if (text.trim() !== "") {
                setErrors(prev => ({ ...prev, correoElectronico: undefined }));
              }
            }}
            value={correoElectronico}
          />

          {errors.correoElectronico && (
            <Text style={{ color: 'red', fontSize: 16 }}>{errors.correoElectronico}</Text>
          )}
        </View>

        <View className="gap-1">
          <Text className="text-gray-500 text-lg font-semibold">Contraseña</Text>

          <TextInput className= "bg-sky-300 text-white block w-full rounded-lg py-3 px-3" placeholder="Contraseña" secureTextEntry={!esVisible}
            onChangeText={(text) => {
              setContrasena(text);
              if (text.trim() !== "") {
                setErrors(prev => ({ ...prev, contrasena: undefined }));
              }
            }}
            value={contrasena}
          />

          <TouchableOpacity
            onPress={toggleVisibilidad}
            className="absolute right-3 top-10"
          >
            <Ionicons name={esVisible ? "eye-off-outline" : "eye-outline"} size={22} color="white" />
          </TouchableOpacity>

          {errors.contrasena && (
            <Text style={{ color: 'red', fontSize: 16 }}>{errors.contrasena}</Text>
          )}
        </View>

        {errorGeneral ? (
          <Text style={{ color: 'red', textAlign: 'center', fontSize: 16 }}>{errorGeneral}</Text>
        ) : null}

        <View className="gap-1">
          <TouchableOpacity className="bg-sky-500 rounded-lg py-3" onPress={manejarLogin} disabled={estaCargando}>
            <Text className="text-white text-center text-lg">
              {estaCargando ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}

export default LoginScreen;
