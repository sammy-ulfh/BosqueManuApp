import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { MainButton } from "@/mvc/views/components/MainButton";
import { updatePassword } from "../../../models/auth/configuracion/authFunctions";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Todos los campos son obligatorios.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
    }

    const { error } = await updatePassword(currentPassword, newPassword);

    if (error) {
      return Alert.alert("Error", error.message);
    }

    Alert.alert("Éxito", "La contraseña ha sido actualizada.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar contraseña</Text>

      <TextInput
        secureTextEntry
        placeholder="Contraseña actual"
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        secureTextEntry
        placeholder="Nueva contraseña"
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        secureTextEntry
        placeholder="Confirmar nueva contraseña"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <MainButton 
        text="Guardar cambios"
        onPress={handleChangePassword}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: {
    width: "100%",
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  button: {
    marginTop: 25,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
});
