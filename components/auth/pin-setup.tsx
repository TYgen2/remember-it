import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PinState } from "../../types/auth";

interface PinSetupProps {
  pinState: PinState;
  onPinChange: (pin: string) => void;
  onConfirmPinChange: (pin: string) => void;
  onSubmit: () => void;
}

export const PinSetup = ({
  pinState,
  onPinChange,
  onConfirmPinChange,
  onSubmit,
}: PinSetupProps) => {
  const { isSettingPin, pin, confirmPin, storedPin } = pinState;

  const getSubText = () => {
    if (storedPin) return "Enter your PIN";
    return isSettingPin
      ? "Confirm your PIN"
      : "Enter a new PIN (minimum 4 digits)";
  };

  const getInputValue = () => {
    return isSettingPin ? confirmPin : pin;
  };

  const getInputChangeHandler = () => {
    return isSettingPin ? onConfirmPinChange : onPinChange;
  };

  const getButtonText = () => {
    return isSettingPin ? "Confirm PIN" : "Set PIN";
  };

  if (!storedPin) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.authContainer}>
          <Text style={styles.text}>
            {storedPin ? "Enter your PIN" : "Set up a PIN for Remember-it"}
          </Text>
          <Text style={styles.subText}>{getSubText()}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            value={getInputValue()}
            onChangeText={getInputChangeHandler()}
            placeholder="Enter PIN"
          />
          <Pressable style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.authContainer}>
        <Text style={styles.text}>Enter your PIN</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
          value={pin}
          onChangeText={onPinChange}
          placeholder="Enter PIN"
        />
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
