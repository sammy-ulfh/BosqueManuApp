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
import { getCurrentUser } from "@/app/auth";

export default function VoluntariosForm({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");

  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("../../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("../../../assets/fonts/Gloock/Gloock-Regular.ttf"),
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
    <View style={styles.container}>
      {/* Flecha regresar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.card}>
        <Text style={styles.title}>Registro de Voluntariado</Text>

        <Text style={styles.label}>Nombre</Text>
        <Input
          placeholder="Tu nombre"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />

        <Text style={styles.label}>Apellido</Text>
        <Input
          placeholder="Tu apellido"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono</Text>
        <Input
          placeholder="10 dígitos"
          value={phone}
          keyboardType="number-pad"
          onChangeText={setPhone}
          style={styles.input}
        />

        <Text style={styles.label}>Fecha para participar</Text>

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

        <TouchableOpacity
          onPress={() => navigation.navigate("Capacitacion")}
        >
          <Text style={styles.moreInfo}>
            Ver capacitaciones →
          </Text>
        </TouchableOpacity>

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
  ... SAME_STYLES AS ABOVE, solo cambia `title` y colores si quieres :)
});
