import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../hooks/useAuth";
import { WelcomeScreen } from "./welcome-screen";
import { PinSetup } from "./pin-setup";
import { useEffect } from "react";

export const AuthScreen = () => {
  const {
    isLoading,
    isFirstTime,
    isAuthenticated,
    authMethod,
    hasPasscode,
    hasBiometrics,
    pinState,
    setPinState,
    selectAuthMethod,
    handlePinSetup,
    verifyPin,
    authenticateWithMethod,
  } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active" && !isAuthenticated) {
      // Trigger authentication when app comes to the foreground

      authenticateUser();
    }
  };

  const authenticateUser = () => {
    if (authMethod) {
      authenticateWithMethod(authMethod);
    }
  };

  const renderLoading = () => {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  };

  const renderWelcomeScreen = () => {
    return (
      <WelcomeScreen
        hasPasscode={hasPasscode}
        hasBiometrics={hasBiometrics}
        onSelectMethod={selectAuthMethod}
      />
    );
  };

  const renderPinSetup = () => {
    return (
      <PinSetup
        pinState={pinState}
        onPinChange={(pin) => setPinState((prev) => ({ ...prev, pin }))}
        onConfirmPinChange={(confirmPin) =>
          setPinState((prev) => ({ ...prev, confirmPin }))
        }
        onSubmit={pinState.storedPin ? verifyPin : handlePinSetup}
      />
    );
  };

  const renderMainUI = () => {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        {!isAuthenticated ? (
          <View style={styles.authContainer}>
            <Text style={styles.text}>Authentication required</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.text}>Welcome to Remember-it!</Text>
            <Text style={styles.subText}>Your passwords are secure.</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return renderLoading();
  }

  if (isFirstTime) {
    return renderWelcomeScreen();
  }

  if (authMethod === "custom_pin" && !isAuthenticated) {
    return renderPinSetup();
  }

  return renderMainUI();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
