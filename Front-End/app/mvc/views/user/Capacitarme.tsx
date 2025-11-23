import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";
import { getCurrentUser } from "@/mvc/models/auth/auth";

export default function CapacitacionesForm({ navigation }) {
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

      <ScrollView style={styles.card}>
        <Text style={styles.title}>Registro de Capacitaciones</Text>

        {/* Nombre prellenado */}
        <Text style={styles.label}>Nombre</Text>
        <Input
          placeholder="Tu nombre"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          color="gray"
        />

        <Text style={styles.label}>Apellido</Text>
        <Input
          placeholder="Tu apellido"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          color="gray"
        />

        <Text style={styles.label}>Teléfono</Text>
        <Input
          placeholder="10 dígitos"
          value={phone}
          keyboardType="number-pad"
          onChangeText={setPhone}
          style={styles.input}
        />

        <Text style={styles.label}>Fecha para capacitación</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}
          </Text>
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
    backgroundColor: "#ffffff",
    paddingTop: 70,
  },
  card: {
    marginHorizontal: "8%",
  },
  title: {
    fontFamily: "Gloock",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: "TenorSans",
    marginBottom: 5,
    marginTop: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "#e4e4e4",
    borderRadius: 10,
    paddingLeft: 15,
    height: 45,
    width: "100%",
    borderWidth: 0,
  },
  dateButton: {
    backgroundColor: "#e4e4e4",
    padding: 12,
    borderRadius: 10,
  },
  dateText: {
    fontFamily: "TenorSans",
  },
  finishButton: {
    marginTop: 30,
    backgroundColor: "#695D45",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  backArrow: {
    fontSize: 28,
  },
});
