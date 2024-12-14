import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  AppState,
  TextInput,
  Pressable,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const APP_PIN_KEY = "remember_it_pin";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasDeviceSecurity, setHasDeviceSecurity] = useState(false);
  const [appPin, setAppPin] = useState("");
  const [confirmAppPin, setConfirmAppPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    checkSecurityStatus();
  }, []);

  const checkSecurityStatus = async () => {
    try {
      // Check device security
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const deviceHasSecurity = hasHardware && isEnrolled;
      setHasDeviceSecurity(deviceHasSecurity);

      // Check for existing app PIN
      const existingPin = await SecureStore.getItemAsync(APP_PIN_KEY);
      setStoredPin(existingPin);

      // If device has security, proceed with biometric auth
      // if (deviceHasSecurity) {
      //   authenticate();
      // }
    } catch (error) {
      console.error("Security check error:", error);
    }
  };

  return (
    <View>
      <Text>App</Text>
    </View>
  );
}
