import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';

const AdminHomeScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <ScrollView className="bg-blue-400">
      <View className="h-full py-6 px-6 gap-6"> 

        <View className="flex-row items-center space-x-4">
            <View className="flex-auto">
              <TextInput className="border border-gray-300 px-4 py-3 rounded-lg bg-white" placeholder="Buscar estudiante" />
            </View>
            
            <View className="">
              <TouchableOpacity className="py-3 px-3 bg-gray-100 border border-gray-300 rounded-lg">
                <Ionicons name="qr-code-outline" size={18} color="black" />
              </TouchableOpacity>
            </View>
        </View>
      
        <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
          <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default AdminHomeScreen;
