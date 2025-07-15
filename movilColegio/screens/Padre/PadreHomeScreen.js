import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PadreHomeScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Bienvenido Padre</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "red", padding: 12, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default PadreHomeScreen;
