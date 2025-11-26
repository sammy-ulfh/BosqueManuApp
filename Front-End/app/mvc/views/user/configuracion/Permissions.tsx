import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Permissions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu información y permisos</Text>
      <Text style={styles.item}>• Permiso de ubicación</Text>
      <Text style={styles.item}>• Permiso de notificaciones</Text>
      <Text style={styles.item}>• Datos recopilados por la app</Text>
      <Text style={styles.item}>• Control de privacidad</Text>
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
    marginBottom: 25,
    textAlign: "center"
  },
  item: {
    fontSize: 18,
    marginVertical: 10
  }
});
