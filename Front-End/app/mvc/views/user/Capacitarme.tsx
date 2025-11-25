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
import { getCurrentUser } from "@/mvc/models/auth/auth";
  
export default function CapacitacionesForm({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [userName, setUserName] = useState("");
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
      const [first] = fullName.split(" ");
      setUserName(first || "");
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

    alert("Formulario enviado con éxito");
    navigation.navigate("ClientHome");
  };

  return (
    <View style={styles.container}>
      {/* Flecha regresar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {/* Título */}
        <Text style={styles.title}>¡Yo quiero{"\n"}capacitarme!</Text>

        {/* TARJETA VERDE */}
        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <Input
            placeholder="Nombre"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
            color="gray"
          />

          <Text style={styles.label}>Telefono</Text>
          <Input
            placeholder="10 dígitos"
            value={phone}
            keyboardType="number-pad"
            onChangeText={setPhone}
            style={styles.input}
          />

          <Text style={styles.label}>Fecha de capacitacion</Text>

          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setShowPicker(true)}
          >
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </View>
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
              Para más información acerca de{"\n"}
              las capacitaciones haz click <Text style={styles.link}>aqui</Text>
            </Text>

            <Text style={styles.terms}>
              Términos de uso | Política de privacidad
            </Text>
          </View>
        </View>

        <MainButton
          text="FINALIZAR"
          onPress={handleSubmit}
          style={styles.finishButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C4635", // Fondo café
    paddingTop: 60,
  },

  backButton: {
    position: "absolute",
    top: 25,
    left: 20,
  },
  backArrow: {
    fontSize: 28,
    color: "white",
  },

  title: {
    fontFamily: "Gloock",
    fontSize: 32,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },

  card: {
    width: "85%",
    backgroundColor: "#2E8B57", // Verde igual a la imagen
    padding: 20,
    borderRadius: 20,
    paddingBottom: 50,
    minHeight: 500,  // 🔥 más alto
    marginBottom: 50,
  },

  label: {
    fontFamily: "TenorSans",
    color: "white",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#D9D9D9",
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  dateInput: {
    flex: 1,
  },

  dateText: {
    fontFamily: "TenorSans",
  },

  calendarIcon: {
    fontSize: 22,
  },

  infoBox: {
    backgroundColor: "#D9D9D9",
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
  },

  infoText: {
    fontFamily: "TenorSans",
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
  },

  link: {
    color: "#1B4D3E",
    textDecorationLine: "underline",
  },

  terms: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "TenorSans",
    color: "#6B6B6B",
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
