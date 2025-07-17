import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="qr-code-outline" size={24} color="black" />

//import { Card } from "react-native-material-cards";

const AdminHomeScreen = () => {
  const { logout } = useContext(AuthContext);
  //const [users, setUsers] = useEffect();

  return (
    <ScrollView className="bg-white">
      <View className="h-full py-6 px-6 gap-6"> 

        <View className="flex-row items-center gap-3">
            <TextInput className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-100" placeholder="Buscar estudiante" />
            
            <TouchableOpacity className="p-2 bg-white border border-gray-300 rounded-lg">
              <Ionicons name="qr-code-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
      
        <TouchableOpacity className="bg-blue-500 py-3 px-4 rounded-lg">
          <Text>Logo</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default AdminHomeScreen;
