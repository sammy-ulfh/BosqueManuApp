import React from "react";
import {
  View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView
} from "react-native";
import { MainButton } from "@/components/MainButton"; 
import { Input } from "@/components/Input";
import { useAddEventController } from "../../controllers/useAddEventController";

export default function AddEventAdmin({ navigation }) {
  const {
    description, setDescription,
    date, setDate,
    limit, setLimit,
    loading,
    handleSubmit
  } = useAddEventController(navigation);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../../assets/main/background2.png")}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Nuevo Evento</Text>
            <Text style={styles.subtitleText}>Voluntariado</Text>
          </View>

          <View style={styles.cardContainer}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              
              <Text style={styles.label}>Título del Evento</Text>
              <Input
                placeholder="Ej: Limpieza del Río"
                value={description}
                onChangeText={setDescription}
                style={styles.inputStyle}
                color="black"
              />

              <Text style={styles.label}>Fecha (YYYY-MM-DD HH:MM)</Text>
              <Input
                placeholder="Ej: 2025-12-05 08:00"
                value={date}
                onChangeText={setDate}
                style={styles.inputStyle}
                color="black"
              />

              <Text style={styles.label}>Límite de Voluntarios</Text>
              <Input
                placeholder="Ej: 50"
                value={limit}
                onChangeText={setLimit}
                keyboardType="numeric"
                style={styles.inputStyle}
                color="black"
              />
            </ScrollView>
          </View>

          <View style={styles.footerContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
            ) : (
                <MainButton
                text="CREAR EVENTO"
                onPress={handleSubmit}
                style={styles.mainButton}
                />
            )}
            <Text onPress={() => navigation.goBack()} style={styles.cancelLink}>Cancelar</Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  mainContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  headerContainer: { height: "15%", justifyContent: "flex-end", marginBottom: 10, alignItems: 'center' },
  titleText: { color: "#ffffff", fontSize: 32, fontFamily: "Gloock", textAlign: "center" },
  subtitleText: { color: "#E67E22", fontSize: 20, fontFamily: "TenorSans", textAlign: "center", marginTop: 5 },
  
  cardContainer: {
    width: "85%",
    height: "50%",
    backgroundColor: "rgba(38, 36, 36, 0.8)",
    borderRadius: 20,
    overflow: "hidden", 
    marginBottom: 20,
  },
  
  label: { color: "white", marginBottom: 8, marginTop: 10, fontFamily: "TenorSans", fontSize: 16 },
  inputStyle: { width: "100%", height: 50, backgroundColor: "#D9D9D9", borderRadius: 10, paddingHorizontal: 15, borderWidth: 0, color: "black" },
  
  footerContainer: { height: "20%", width: "100%", alignItems: "center", justifyContent: "flex-start" },
  mainButton: { width: "80%", height: 50, alignItems: "center", justifyContent: "center" },
  cancelLink: { color: "white", marginTop: 15, textDecorationLine: "underline", fontSize: 16 }
});
