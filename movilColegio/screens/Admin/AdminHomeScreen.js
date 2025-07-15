import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, FlatList } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {getData} from "../../Api";
//import { Card } from "react-native-material-cards";

const AdminHomeScreen = () => {
  const { logout } = useContext(AuthContext);
  //const [users, setUsers] = useEffect();

  return (
    <ScrollView>
      <View className="h-full py-3 px-10 gap-10"> 

      <View className="">
         <TextInput className="border border-gray-300 px-4 py-2 rounded-lg w-3/4 mb-4" placeholder="Buscar estudiante" />
      </View>

      <TouchableOpacity className="">
        <Text>Luego</Text>
      </TouchableOpacity>
     
      <TouchableOpacity className="bg-blue-500 py-3 px-4 rounded-lg">
        <Text>Logo</Text>
      </TouchableOpacity>

      <FlatList

      />

      <TouchableOpacity className="bg-red-500 py-3 px-4 rounded-lg" onPress={logout}>
        <Text className="text-white text-base font-bold text-center">Cerrar Sesión</Text>
      </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default AdminHomeScreen;
