import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../movilColegio/context/AuthContext';
import MainNavigator from '../movilColegio/navigation/AppNavigator';
import './global.css';
import 'nativewind';
import { OneSignal } from 'react-native-onesignal';

export default function App() {
  useEffect(() => {
    console.log('🔔 Iniciando configuración de OneSignal v5...');
    
    try {
      // Configurar OneSignal v5
      OneSignal.initialize("72342681-80f1-46bb-8e88-db8bfe80c758");
      console.log('🔔 OneSignal inicializado con App ID: 72342681-80f1-46bb-8e88-db8bfe80c758');
      
      // Solicitar permisos de notificación (v5)
      OneSignal.Notifications.requestPermission(true);
      console.log('🔔 Permisos de notificación solicitados');
      
      // MÉTODO CORREGIDO: Obtener el Player ID usando la nueva API v5
      // Verificar si el método existe antes de usarlo
      if (OneSignal.User && OneSignal.User.addObserver) {
        OneSignal.User.addObserver('pushSubscription', (event) => {
          console.log('🔔 OneSignal Push Subscription Event:', event);
          if (event.current && event.current.id) {
            console.log('🔔 OneSignal Player ID:', event.current.id);
          }
          if (event.current && event.current.token) {
            console.log('🔔 OneSignal Push Token:', event.current.token);
          }
        });
        
        OneSignal.User.addObserver('onesignalId', (event) => {
          console.log('🔔 OneSignal ID Event:', event);
          if (event.current && event.current.onesignalId) {
            console.log('🔔 OneSignal ID:', event.current.onesignalId);
          }
        });
      } else {
        console.warn('🔔 OneSignal.User.addObserver no está disponible');
        
        // Método alternativo para obtener el Player ID
        setTimeout(() => {
          const pushSubscription = OneSignal.User.pushSubscription;
          if (pushSubscription && pushSubscription.id) {
            console.log('🔔 OneSignal Player ID (alternativo):', pushSubscription.id);
          }
          
          const onesignalId = OneSignal.User.onesignalId;
          if (onesignalId) {
            console.log('🔔 OneSignal ID (alternativo):', onesignalId);
          }
        }, 2000);
      }
      
      // Eventos de notificación (v5)
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log('🔔 OneSignal: notification clicked:', event);
      });
      
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
        console.log('🔔 OneSignal: notification received in foreground:', event);
        // Mostrar la notificación
        event.getNotification().display();
      });
      
      console.log('🔔 OneSignal configuración completada');
      
    } catch (error) {
      console.error('🔔 Error configurando OneSignal:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}