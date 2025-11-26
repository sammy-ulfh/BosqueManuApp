import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { MainButton } from "@/mvc/views/components/MainButton";
import { updatePassword } from "../../../models/auth/configuracion/authFunctions";
import * as Font from "expo-font";

export default function ChangePassword({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setIsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const isDisabled = !currentPassword || !newPassword || !confirmPassword;

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  async function submit() {
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Alguno de los campos es incorrecto");
    }

    const { error } = await updatePassword(currentPassword, newPassword);

    if (error) {
      if (error.message.includes("actual es incorrecta")) {
        return Alert.alert("Error", "La contraseña actual es incorrecta.");
      }
      return Alert.alert("Error", error.message);
    }

    Alert.alert(
      "Contraseña actualizada",
      "Tu contraseña se cambió correctamente."
    );

    navigation.goBack();
  }

  if (!isLoaded) return null;

  return (
    <ImageBackground
      source={require("@/assets/main/cascada.jpg")}
      style={styles.background}
    >
      <View style={[styles.overlay, styles.container]}>
        <View style={styles.card}>
          <Text style={styles.title}>Cambiar contraseña</Text>

          <TextInput
            secureTextEntry
            placeholder="Contraseña actual"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <TextInput
            secureTextEntry
            placeholder="Nueva contraseña"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            secureTextEntry
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {passwordsMatch && (
            <Text style={[styles.matchIndicator, { alignSelf: "flex-end", marginRight: 10 }]}>
              Las contraseñas coinciden
            </Text>
          )}

          <View style={{ alignItems: "center" }}>
            <MainButton
              text="Guardar"
              onPress={submit}
              style={[
                styles.button,
                isDisabled && { backgroundColor: "rgba(150,150,150,0.5)" },
              ]}
              disabled={isDisabled}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(72, 65, 50, 0.8)",
    padding: 25,
    borderRadius: 25,
  },
  title: {
    color: "white",
    fontFamily: "Gloock",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    color: "white",
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  matchIndicator: {
    color: "#7c897cff",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    width: "40%",
    height: 45,
    backgroundColor: "rgba(211, 106, 82, 0.85)",
    borderRadius: 12,
    alignSelf: "center",
  },
});
