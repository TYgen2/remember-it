import * as SecureStore from "expo-secure-store";
import { AuthMethod } from "../types/auth";
import { STORAGE_KEYS } from "../constants/keys";

export const storage = {
  async getAuthMethod(): Promise<AuthMethod | undefined> {
    const method = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_METHOD);
    return method as AuthMethod | undefined;
  },

  async setAuthMethod(method: AuthMethod): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_METHOD, method);
  },

  async getPin(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.APP_PIN);
  },

  async setPin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.APP_PIN, pin);
  },
};
