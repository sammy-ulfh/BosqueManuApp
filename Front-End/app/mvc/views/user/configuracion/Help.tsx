import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Help() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayuda</Text>

      <Text style={styles.subtitle}>Preguntas Frecuentes</Text>

      <Text style={styles.item}>• ¿Cómo cambio mi contraseña?</Text>
      <Text style={styles.item}>• ¿Cómo contacto soporte?</Text>
      <Text style={styles.item}>• ¿Dónde veo mis datos personales?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15
  },
  item: {
    fontSize: 18,
    marginVertical: 8
  }
});
