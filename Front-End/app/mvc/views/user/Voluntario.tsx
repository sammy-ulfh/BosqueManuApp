import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";
import { getCurrentUser } from "@/mvc/models/auth/auth.js";

export default function VoluntariosForm({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");

  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
    });
    setIsLoaded(true);
  };

  const loadUserData = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      const fullName = user.user_metadata.full_name || "";
      const [first, last] = fullName.split(" ");
      setUserName(first || "");
      setLastName(last || "");
    }
  };

  useEffect(() => {
    loadFonts();
    loadUserData();
  }, []);

  if (!isLoaded) return null;

  const validatePhone = () => /^\d{10}$/.test(phone);

  const handleSubmit = () => {
    if (!validatePhone()) {
      alert("El número telefónico debe tener 10 dígitos.");
      return;
    }

    alert("Registro enviado correctamente");
    navigation.navigate("ClientHome");
  };

  return (
    <View style={styles.mainContainer}>
      {/* Título */}
      <Text style={styles.header}>¡Yo quiero ser voluntario!</Text>

      {/* Contenedor azul */}
      <View style={styles.formCard}>
        <ScrollView>

          <Text style={styles.label}>Nombre</Text>
          <Input
            placeholder="Tu nombre"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />

          <Text style={styles.label}>Telefono</Text>
          <Input
            placeholder="10 dígitos"
            value={phone}
            keyboardType="number-pad"
            onChangeText={setPhone}
            style={styles.input}
          />

          <Text style={styles.label}>Fecha de voluntariado</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Para más información acerca de las capacitaciones haz click aquí
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Capacitacion")}>
              <Text style={styles.infoLink}>Términos de uso | Política de privacidad</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>

      {/* Botón FINALIZAR */}
      <MainButton
        text="FINALIZAR"
        onPress={handleSubmit}
        style={styles.finishButton}
        color="black"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#5F3714", // fondo café igual al de la imagen
    alignItems: "center",
    paddingTop: 50,
  },

  header: {
    fontSize: 28,
    fontFamily: "Gloock",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  formCard: {
    width: "80%",
    backgroundColor: "#0A6A8C", // azul de la imagen
    borderRadius: 20,
    padding: 20,
    paddingBottom: 50,
    minHeight: 500,  // 🔥 más alto
    marginBottom: 50,
  },

  label: {
    color: "white",
    fontFamily: "TenorSans",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },

  dateText: {
    fontFamily: "TenorSans",
    
    fontSize: 16,
  },

  calendarIcon: {
    fontSize: 20,
  },

  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginTop: 20,
  },

  infoText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "TenorSans",
  },

  infoLink: {
    fontSize: 12,
    marginTop: 10,
    color: "#333",
    textDecorationLine: "underline",
  },

  finishButton: {
    width: "80%",
    backgroundColor: "#655f4c8d",
    height: 60,
    borderRadius: 25,
    marginTop: -10,
    alignSelf: "center", 
  },
});
