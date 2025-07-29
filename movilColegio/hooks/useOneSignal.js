import { useState, useEffect } from 'react';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { Platform } from 'react-native';

const useOneSignal = () => {
  const [playerId, setPlayerId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    initializeOneSignal();
  }, []);

  const initializeOneSignal = async () => {
    console.log('[useOneSignal] Initializing OneSignal...');
    
    try {
      // Enable verbose logging for debugging
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      
      // Initialize OneSignal
      OneSignal.initialize("72342681-80f1-46bb-8e88-db8bfe80c758");
      setIsInitialized(true);
      console.log('[useOneSignal] OneSignal initialized successfully');
      
    } catch (error) {
      console.error('[useOneSignal] Error in initialization phase:', error);
    }

    // SEPARAR LA SOLICITUD DE PERMISOS
    try {
      console.log('[useOneSignal] Requesting permissions...');
      OneSignal.Notifications.requestPermission(false).then(result => {
        console.log('[useOneSignal] Permission result:', result);
      }).catch(error => {
        console.error('[useOneSignal] Error requesting permissions:', error);
      });

    } catch (error) {
      console.error('[useOneSignal] Error requesting permissions:', error);
    }

    // SEPARAR EL CHECKING
    try {
      console.log('[useOneSignal] Setting up status checking...');
      
      setTimeout(() => {
        console.log('[useOneSignal] First timeout reached, checking status...');
        checkSubscriptionStatus();
      }, 3000);

      const intervalId = setInterval(() => {
        console.log('[useOneSignal] Interval check...');
        checkSubscriptionStatus();
      }, 5000);
      
      setTimeout(() => {
        console.log('[useOneSignal] Clearing interval...');
        clearInterval(intervalId);
      }, 30000);
      
    } catch (error) {
      console.error('[useOneSignal] Error setting up checking:', error);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      console.log('[useOneSignal] === CHECKING SUBSCRIPTION STATUS ===');

      const subscription = OneSignal.User.pushSubscription;      
      console.log('[useOneSignal] Raw subscription object:', subscription);

      const hasPermission = OneSignal.Notifications.hasPermission(); 
      console.log('[useOneSignal] Has system permission:', hasPermission);

      const playerId = subscription.getPushSubscriptionId(); // API correcta v5
      const isOptedIn = subscription.getOptedIn(); // API correcta v5

      if (playerId) {
        setPlayerId(playerId);
        setSubscriptionStatus(isOptedIn ? 'Subscribed' : 'Not Subscribed');
        
        if (isOptedIn) {
          setIsReady(true);
          console.log('[useOneSignal] Ready to receive notifications!');
        } else {
          console.warn('[useOneSignal] Player ID exists but user is not opted in');
        }
      } else {
        console.log('[useOneSignal] No player ID found yet');
      }

    } catch (error) {
      console.error('[useOneSignal] Error checking subscription:', error);
    }
  };

  const getTokenData = (userId) => {
    if (!playerId || !userId || subscriptionStatus !== 'Subscribed') {
      console.warn('[useOneSignal] getTokenData: Missing data or not subscribed', { 
        playerId, 
        userId, 
        subscriptionStatus 
      });
      return null;
    }
    
    return {
      idUsuario: userId,
      claveOneSignalId: playerId,
      tipoDispositivo: Platform.OS === 'ios' ? 'iOS' : 'Android'
    };
  };

  return {
    playerId,
    isReady,
    isInitialized,
    subscriptionStatus,
    getTokenData
  };
};

export default useOneSignal;
