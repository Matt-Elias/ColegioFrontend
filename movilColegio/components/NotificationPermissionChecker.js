import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

const NotificationPermissionChecker = ({ onPermissionGranted, onPermissionDenied }) => {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  const checkAndRequestPermissions = async () => {
    try {
      console.log('[NotificationPermissionChecker] Verificando permisos v5...');
      
      // Verificar si OneSignal está disponible
      if (!OneSignal) {
        console.error('[NotificationPermissionChecker] OneSignal no está disponible');
        setPermissionStatus('error');
        return;
      }

      // Inicializar OneSignal si no está inicializado
      if (!isInitialized) {
        await initializeOneSignal();
      }

      // Verificar el estado actual de los permisos (v5)
      await checkPermissionStatus();

    } catch (error) {
      console.error('[NotificationPermissionChecker] Error verificando permisos:', error);
      setPermissionStatus('error');
    }
  };

  const checkPermissionStatus = async () => {
    try {
      // En OneSignal v5, verificar permisos puede ser diferente
      if (OneSignal.Notifications && OneSignal.Notifications.getPermissionAsync) {
        const permissionState = await OneSignal.Notifications.getPermissionAsync();
        console.log('[NotificationPermissionChecker] Estado actual de permisos:', permissionState);

        if (permissionState) {
          setPermissionStatus('granted');
          onPermissionGranted && onPermissionGranted();
        } else {
          setPermissionStatus('denied');
        }
      } else {
        console.warn('[NotificationPermissionChecker] getPermissionAsync no disponible, verificando de forma alternativa');
        // Método alternativo para v5
        setTimeout(() => {
          checkAlternativePermission();
        }, 2000);
      }
    } catch (error) {
      console.error('[NotificationPermissionChecker] Error verificando estado de permisos:', error);
      // Asumir que necesitamos solicitar permisos
      setPermissionStatus('denied');
    }
  };

  const checkAlternativePermission = (attempt = 1) => {
    try {
      console.log(`[NotificationPermissionChecker] Verificación alternativa, intento ${attempt}`);
      
      // Verificar si ya tenemos un pushSubscription activo
      const pushSubscription = OneSignal.User?.pushSubscription;
      const onesignalId = OneSignal.User?.onesignalId;
      
      if (pushSubscription && pushSubscription.id) {
        console.log('[NotificationPermissionChecker] Push subscription activa, permisos concedidos');
        setPermissionStatus('granted');
        onPermissionGranted && onPermissionGranted();
      } else if (onesignalId) {
        console.log('[NotificationPermissionChecker] OneSignal ID disponible, permisos probablemente concedidos');
        setPermissionStatus('granted');
        onPermissionGranted && onPermissionGranted();
      } else if (attempt < 5) {
        console.log(`[NotificationPermissionChecker] No hay suscripción aún, reintentando en 2 segundos... (${attempt}/5)`);
        setTimeout(() => {
          checkAlternativePermission(attempt + 1);
        }, 2000);
      } else {
        console.log('[NotificationPermissionChecker] No se pudo verificar después de 5 intentos, asumiendo permisos denegados');
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('[NotificationPermissionChecker] Error en verificación alternativa:', error);
      setPermissionStatus('denied');
    }
  };

  const initializeOneSignal = async () => {
    try {
      console.log('[NotificationPermissionChecker] Inicializando OneSignal v5...');
      
      // Configurar OneSignal v5
      OneSignal.initialize("72342681-80f1-46bb-8e88-db8bfe80c758");
      
      // Configurar listeners para debug (si están disponibles)
      if (OneSignal.User && OneSignal.User.addObserver) {
        OneSignal.User.addObserver('pushSubscription', (event) => {
          console.log('[OneSignal] Push Subscription cambió:', event);
          if (event.current && event.current.id) {
            setPermissionStatus('granted');
            onPermissionGranted && onPermissionGranted();
          }
        });

        OneSignal.User.addObserver('onesignalId', (event) => {
          console.log('[OneSignal] OneSignal ID cambió:', event);
        });
      } else {
        console.warn('[NotificationPermissionChecker] Observers no disponibles en esta versión');
      }

      // Configurar manejo de notificaciones (v5)
      if (OneSignal.Notifications) {
        OneSignal.Notifications.addEventListener('click', (event) => {
          console.log('[OneSignal] Notificación clickeada:', event);
        });

        OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
          console.log('[OneSignal] Notificación en foreground:', event);
          event.getNotification().display();
        });
      }

      setIsInitialized(true);
      console.log('[NotificationPermissionChecker] OneSignal v5 inicializado correctamente');
      
    } catch (error) {
      console.error('[NotificationPermissionChecker] Error inicializando OneSignal:', error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    try {
      console.log('[NotificationPermissionChecker] Solicitando permisos v5...');
      setPermissionStatus('requesting');

      // Solicitar permisos de notificación (v5)
      if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
        const permissionResult = await OneSignal.Notifications.requestPermission(true);
        console.log('[NotificationPermissionChecker] Resultado de permisos:', permissionResult);

        if (permissionResult) {
          setPermissionStatus('granted');
          
          // Esperar un momento para que OneSignal procese
          setTimeout(() => {
            onPermissionGranted && onPermissionGranted();
          }, 2000);
          
          Alert.alert(
            'Permisos Concedidos',
            'Ahora recibirás notificaciones importantes del colegio.',
            [{ text: 'OK' }]
          );
        } else {
          setPermissionStatus('denied');
          onPermissionDenied && onPermissionDenied();
          
          Alert.alert(
            'Permisos Denegados',
            'Para recibir notificaciones importantes, ve a Configuración > Aplicaciones > ' + 
            'Colegio Bilingüe > Notificaciones y actívalas manualmente.',
            [{ text: 'Entendido' }]
          );
        }
      } else {
        console.warn('[NotificationPermissionChecker] requestPermission no disponible');
        // En algunas versiones de v5, los permisos se manejan automáticamente
        Alert.alert(
          'Configuración Automática',
          'Los permisos de notificación se están configurando automáticamente.',
          [{ text: 'OK' }]
        );
        
        // Verificar después de un momento si se configuraron correctamente
        setTimeout(() => {
          checkAlternativePermission();
        }, 3000);
      }

    } catch (error) {
      console.error('[NotificationPermissionChecker] Error solicitando permisos:', error);
      setPermissionStatus('error');
      
      Alert.alert(
        'Error',
        'Hubo un problema al configurar las notificaciones. Inténtalo de nuevo.',
        [
          { text: 'Reintentar', onPress: () => checkAndRequestPermissions() },
          { text: 'Cancelar' }
        ]
      );
    }
  };

  const openSettings = () => {
    const appName = Platform.OS === 'ios' ? 'Colegio Bilingüe' : 'Colegio Bilingüe';
    const settingsPath = Platform.OS === 'ios' 
      ? 'Configuración > Notificaciones > Colegio Bilingüe'
      : 'Configuración > Aplicaciones > Colegio Bilingüe > Notificaciones';
    
    Alert.alert(
      'Configurar Notificaciones',
      `Ve a ${settingsPath} y activa las notificaciones.`,
      [{ text: 'Entendido' }]
    );
  };

  const renderContent = () => {
    switch (permissionStatus) {
      case 'checking':
        return (
          <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <Text className="text-blue-800 font-semibold mb-2">
              Verificando permisos de notificación...
            </Text>
            <Text className="text-blue-600 text-sm">
              Por favor espera un momento (OneSignal v5)
            </Text>
          </View>
        );

      case 'requesting':
        return (
          <View className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <Text className="text-orange-800 font-semibold mb-2">
              Solicitando permisos...
            </Text>
            <Text className="text-orange-600 text-sm">
              Por favor acepta los permisos en el diálogo que aparece
            </Text>
          </View>
        );

      case 'denied':
        return (
          <View className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <Text className="text-red-800 font-semibold mb-2">
              Notificaciones Desactivadas
            </Text>
            <Text className="text-red-600 text-sm mb-3">
              Para recibir información importante del colegio, necesitas activar las notificaciones.
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded flex-1"
                onPress={requestPermissions}
              >
                <Text className="text-white text-center font-semibold">
                  Activar Notificaciones
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-600 py-2 px-4 rounded flex-1"
                onPress={openSettings}
              >
                <Text className="text-white text-center font-semibold">
                  Configuración
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'granted':
        return (
          <View className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <Text className="text-green-800 font-semibold mb-2">
              ✓ Notificaciones Activadas
            </Text>
            <Text className="text-green-600 text-sm">
              Recibirás notificaciones importantes del colegio (OneSignal v5)
            </Text>
          </View>
        );

      case 'error':
        return (
          <View className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <Text className="text-red-800 font-semibold mb-2">
              Error de Configuración
            </Text>
            <Text className="text-red-600 text-sm mb-3">
              Hubo un problema configurando las notificaciones con OneSignal v5
            </Text>
            <TouchableOpacity
              className="bg-red-600 py-2 px-4 rounded"
              onPress={checkAndRequestPermissions}
            >
              <Text className="text-white text-center font-semibold">
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default NotificationPermissionChecker;
