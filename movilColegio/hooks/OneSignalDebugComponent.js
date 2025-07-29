import React, { useEffect, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import useOneSignal from '../hooks/useOneSignal';
import notificacionService from '../services/notificacionService';
import { AuthContext } from '../context/AuthContext';

const OneSignalDebugComponent = () => {
  const { user } = useContext(AuthContext);
  const { playerId, isReady, isMockMode, getTokenData } = useOneSignal();

  useEffect(() => {
    if (isReady && playerId) {
      console.log('[DEBUG] OneSignal está listo');
      console.log('[DEBUG] Player ID:', playerId);
      console.log('[DEBUG] Es modo simulación:', isMockMode);
      console.log('[DEBUG] Es UUID válido:', isValidUUID(playerId));
    }
  }, [isReady, playerId, isMockMode]);

  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const reRegistrarToken = async () => {
    if (!user?.token || !playerId) {
      Alert.alert('Error', 'Faltan datos para re-registrar');
      return;
    }

    try {
      const tokenData = getTokenData(user.idUsuario);
      console.log('[DEBUG] Re-registrando token:', tokenData);
      
      const result = await notificacionService.registrarDispositivoToken(
        user.token,
        tokenData
      );

      if (result.success) {
        Alert.alert('Éxito', 'Token re-registrado correctamente');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('[DEBUG] Error re-registrando:', error);
      Alert.alert('Error', 'No se pudo re-registrar el token');
    }
  };

  const probarNotificacion = async () => {
    if (!user?.token) {
      Alert.alert('Error', 'No hay token de usuario');
      return;
    }

    try {
      const testData = {
        idEstudiante: 24, // ID del estudiante de prueba
        nombreEstudiante: "Estudiante Test",
        tipoRegistro: "Test",
        fechaHora: new Date().toISOString()
      };

      console.log('[DEBUG] Enviando notificación de prueba:', testData);
      
      const result = await notificacionService.enviarNotificacionAsistencia(
        user.token,
        testData
      );

      if (result.success) {
        Alert.alert('Éxito', 'Notificación de prueba enviada');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('[DEBUG] Error enviando notificación:', error);
      Alert.alert('Error', 'No se pudo enviar la notificación');
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>OneSignal Debug</Text>
      <Text>Player ID: {playerId || 'No disponible'}</Text>
      <Text>Estado: {isReady ? 'Listo' : 'No listo'}</Text>
      <Text>Modo simulación: {isMockMode ? 'Sí' : 'No'}</Text>
      <Text>UUID válido: {playerId ? (isValidUUID(playerId) ? 'Sí' : 'No') : 'N/A'}</Text>
      
      <View style={{ marginTop: 10 }}>
        <Button 
          title="Re-registrar Token" 
          onPress={reRegistrarToken}
          disabled={!isReady || !playerId}
        />
        <View style={{ marginTop: 5 }}>
          <Button 
            title="Probar Notificación" 
            onPress={probarNotificacion}
            disabled={!user?.token}
          />
        </View>
      </View>
    </View>
  );
};

export default OneSignalDebugComponent;
