import { create } from "zustand";
import {
  AuthMethod,
  AuthState,
  DeviceCapabilities,
  PinState,
} from "../types/auth";

interface AuthStore {
  authState: AuthState;
  setAuthState: (authState: Partial<AuthState>) => void;
  deviceCapabilities: DeviceCapabilities;
  setDeviceCapabilities: (capabilities: Partial<DeviceCapabilities>) => void;
  pinState: PinState;
  setPinState: (pinState: Partial<PinState>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authState: {
    isAuthenticated: false,
    authMethod: undefined,
    isFirstTime: false,
  },
  setAuthState: (authState: Partial<AuthState>) =>
    set((state) => ({
      authState: { ...state.authState, ...authState },
    })),
  deviceCapabilities: {
    hasPasscode: false,
    hasBiometrics: false,
  },
  setDeviceCapabilities: (capabilities: Partial<DeviceCapabilities>) =>
    set((state) => ({
      deviceCapabilities: { ...state.deviceCapabilities, ...capabilities },
    })),
  pinState: {
    pin: "",
    confirmPin: "",
    isSettingPin: false,
    storedPin: null,
  },
  setPinState: (pinState: Partial<PinState>) =>
    set((state) => ({
      pinState: { ...state.pinState, ...pinState },
    })),
}));
