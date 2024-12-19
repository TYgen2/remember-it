export type AuthMethod = "device_passcode" | "biometric" | "custom_pin";

export interface AuthState {
  isAuthenticated: boolean;
  authMethod: AuthMethod | undefined;
  isFirstTime: boolean;
}

export interface DeviceCapabilities {
  hasPasscode: boolean;
  hasBiometrics: boolean;
}

export interface PinState {
  pin: string;
  confirmPin: string;
  isSettingPin: boolean;
  storedPin: string | null;
}
