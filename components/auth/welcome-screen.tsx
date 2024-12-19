import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthMethod } from "../../types/auth";

interface WelcomeScreenProps {
  hasPasscode: boolean;
  hasBiometrics: boolean;
  onSelectMethod: (method: AuthMethod) => void;
}

export const WelcomeScreen = ({
  hasPasscode,
  hasBiometrics,
  onSelectMethod,
}: WelcomeScreenProps) => {
  const renderAuthOption = (
    method: AuthMethod,
    text: string,
    isEnabled: boolean = true
  ) => {
    return (
      <Pressable
        style={[styles.authOption, !isEnabled && styles.authOptionDisabled]}
        onPress={() => onSelectMethod(method)}
      >
        <Text style={styles.authOptionText}>
          {text}
          {!isEnabled && "\n(Setup Required)"}
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Welcome to Remember-it!</Text>
        <Text style={styles.subtitle}>
          Choose your preferred authentication method:
        </Text>
        {renderAuthOption(
          "device_passcode",
          "Use Device Passcode/Pattern",
          hasPasscode
        )}
        {renderAuthOption(
          "biometric",
          "Use Biometric Authentication",
          hasBiometrics
        )}
        {renderAuthOption("custom_pin", "Use Custom PIN")}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  authOption: {
    width: "80%",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  authOptionDisabled: {
    backgroundColor: "#999",
  },
  authOptionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
