// Convert all functions to arrow function syntax and remove unused imports
import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform, Linking, AppState } from "react-native";
import {
  AuthMethod,
  AuthState,
  DeviceCapabilities,
  PinState,
} from "../types/auth";
import { storage } from "../utils/storage";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    authMethod: undefined,
    isFirstTime: false,
  });
  const [deviceCapabilities, setDeviceCapabilities] =
    useState<DeviceCapabilities>({
      hasPasscode: false,
      hasBiometrics: false,
    });
  const [pinState, setPinState] = useState<PinState>({
    pin: "",
    confirmPin: "",
    isSettingPin: false,
    storedPin: null,
  });

  useEffect(() => {
    checkInitialState();
    const subscription = AppState.addEventListener("change", refreshAuthMethod);
    return () => subscription.remove();
  }, []);

  const checkInitialState = async () => {
    try {
      const savedAuthMethod = await storage.getAuthMethod();
      const { hasPasscode, hasBiometrics } = await getDeviceCapabilities();
      setDeviceCapabilities({ hasPasscode, hasBiometrics });

      if (savedAuthMethod) {
        setAuthState((prev) => ({
          ...prev,
          authMethod: savedAuthMethod,
          isFirstTime: false,
        }));
        authenticateWithMethod(savedAuthMethod);
      } else {
        setAuthState((prev) => ({ ...prev, isFirstTime: true }));
      }
    } catch (error) {
      console.error("Initial state check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceCapabilities = async () => {
    const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return {
      hasPasscode: securityLevel >= 1,
      hasBiometrics: hasHardware && isEnrolled,
    };
  };

  const authenticateWithMethod = async (method: AuthMethod) => {
    try {
      switch (method) {
        case "device_passcode":
        case "biometric":
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Please authenticate to access your passwords",
            fallbackLabel: "Use device passcode",
            disableDeviceFallback: method === "biometric",
            cancelLabel: "Cancel",
          });
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: result.success,
          }));
          break;
        case "custom_pin":
          const savedPin = await storage.getPin();
          setPinState((prev) => ({ ...prev, storedPin: savedPin }));
          break;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const selectAuthMethod = async (method: AuthMethod) => {
    try {
      if (!isMethodAvailable(method)) return;
      await storage.setAuthMethod(method);
      setAuthState((prev) => ({
        ...prev,
        authMethod: method,
        isFirstTime: false,
      }));
      if (method === "custom_pin") {
        setPinState((prev) => ({ ...prev, isSettingPin: true }));
      } else {
        authenticateWithMethod(method);
      }
    } catch (error) {
      console.error("Error selecting auth method:", error);
      alert("Failed to set authentication method. Please try again.");
    }
  };

  const isMethodAvailable = (method: AuthMethod) => {
    switch (method) {
      case "device_passcode":
        if (!deviceCapabilities.hasPasscode) {
          navigateToSettings("PASSCODE");
          return false;
        }
        break;
      case "biometric":
        if (!deviceCapabilities.hasBiometrics) {
          navigateToSettings("TOUCHID_PASSCODE");
          return false;
        }
        break;
    }
    return true;
  };

  const navigateToSettings = (setting: string) => {
    if (Platform.OS === "ios") {
      Linking.openURL(`App-Prefs:${setting}`);
    } else {
      Linking.sendIntent("android.settings.SECURITY_SETTINGS");
    }
  };

  const handlePinSetup = async () => {
    if (pinState.pin.length < 4) {
      alert("PIN must be at least 4 digits");
      return;
    }
    if (!pinState.isSettingPin) {
      setPinState((prev) => ({ ...prev, isSettingPin: true }));
      return;
    }
    if (pinState.pin !== pinState.confirmPin) {
      alert("PINs do not match. Please try again.");
      resetPinState();
      return;
    }
    try {
      await storage.setPin(pinState.pin);
      setPinState((prev) => ({ ...prev, storedPin: pinState.pin }));
      setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
    } catch (error) {
      console.error("Error saving PIN:", error);
      alert("Failed to save PIN. Please try again.");
    }
  };

  const resetPinState = () => {
    setPinState((prev) => ({
      ...prev,
      pin: "",
      confirmPin: "",
      isSettingPin: false,
    }));
  };

  const verifyPin = async () => {
    if (pinState.pin === pinState.storedPin) {
      setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
    } else {
      alert("Incorrect PIN");
      setPinState((prev) => ({ ...prev, pin: "" }));
    }
  };

  const refreshAuthMethod = async () => {
    const { hasPasscode, hasBiometrics } = await getDeviceCapabilities();
    setDeviceCapabilities({ hasPasscode, hasBiometrics });
  };

  return {
    isLoading,
    isFirstTime: authState.isFirstTime,
    isAuthenticated: authState.isAuthenticated,
    authMethod: authState.authMethod,
    hasPasscode: deviceCapabilities.hasPasscode,
    hasBiometrics: deviceCapabilities.hasBiometrics,
    pinState,
    setPinState,
    selectAuthMethod,
    handlePinSetup,
    verifyPin,
    authenticateWithMethod,
  };
};
