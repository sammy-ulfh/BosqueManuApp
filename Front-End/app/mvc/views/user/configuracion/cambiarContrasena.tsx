import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainButton } from "@/mvc/views/components/MainButton";

export default function Security({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contraseñas y seguridad</Text>

      <MainButton 
        text="Cambiar contraseña"
        onPress={() => console.log("Cambiar contraseña")}
        style={styles.button}
      />

      <MainButton 
        text="Configurar autenticación"
        onPress={() => console.log("2FA")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    width: "80%",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
});
