import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/mvc/models/supabase/supabaseClient";
import { actualizarUsuario } from "@/mvc/models/auth/configuracion/authDatos";
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";

type UserData = {
  id?: number | string;
  auth_id?: string;
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  number?: string | null;
  blood?: string | null;
  allergies?: string | null;
  medicines?: string | null;
  contact?: string | null;
  group_name?: string | null;
};

export default function PersonalData({ navigation }: any) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [number, setNumber] = useState("");
  const [blood, setBlood] = useState("");
  const [contact, setContact] = useState("");
  const [group_name, setGroupName] = useState("");

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
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const user = sessionData?.user;
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      setUserData(data);
      setNombre(data?.nombre ?? "");
      setApellido(data?.apellido ?? "");
      setNumber(data?.number ?? "");
      setBlood(data?.blood ?? "");
      setContact(data?.contact ?? "");
      setGroupName(data?.group_name ?? "");

      setHasChanges(false);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function guardarCambios() {
    if (!userData?.auth_id) return;

    const updates = { nombre, apellido, number, blood, contact, group_name };

    const { success, error } = await actualizarUsuario(userData.auth_id, updates);

    if (!success) {
      Alert.alert("Error", "Hubo un problema actualizando tus datos.");
      return;
    }

    Alert.alert("Éxito", "Tus datos han sido actualizados correctamente");
    cargarDatos();
  }

  function handleChange(field: string, value: string) {
    setHasChanges(true);

    switch (field) {
      case "nombre":
        setNombre(value);
        break;
      case "apellido":
        setApellido(value);
        break;
      case "number":
        setNumber(value);
        break;
      case "blood":
        setBlood(value);
        break;
      case "contact":
        setContact(value);
        break;
      case "group_name":
        setGroupName(value);
        break;
    }
  }

  if (!isLoaded || !userData)
    return <Text style={{ marginTop: 80, textAlign: "center" }}>Cargando...</Text>;

  return (
    <ImageBackground
      source={require("@/assets/main/cascada.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { fontFamily: "Gloock" }]}>Mis datos</Text>

            {!editMode && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Inputs editables */}
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={nombre}
            editable={editMode}
            onChangeText={(v) => handleChange("nombre", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#ccc"
            value={apellido}
            editable={editMode}
            onChangeText={(v) => handleChange("apellido", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            value={number}
            editable={editMode}
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("number", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Grupo sanguíneo"
            placeholderTextColor="#ccc"
            value={blood}
            editable={editMode}
            onChangeText={(v) => handleChange("blood", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Contacto de emergencia"
            placeholderTextColor="#ccc"
            value={contact}
            editable={editMode}
            onChangeText={(v) => handleChange("contact", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Nombre de grupo"
            placeholderTextColor="#ccc"
            value={group_name}
            editable={editMode}
            onChangeText={(v) => handleChange("group_name", v)}
          />

          {/* Datos no editables */}
          <Text style={styles.disabledInput}>Email: {userData.email}</Text>
          <Text style={styles.disabledInput}>Alergias: {userData.allergies}</Text>
          <Text style={styles.disabledInput}>Medicamentos: {userData.medicines}</Text>

          {/* Botones en modo edición */}
          {editMode && (
            <View style={{ marginTop: 20, alignItems: "center", width: "100%" }}>
              
              {/* BOTÓN GUARDAR */}
              <MainButton
                text="Guardar cambios"
                onPress={guardarCambios}
                style={{
                  width: "60%",
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: hasChanges
                    ? "rgba(63, 196, 114, 0.94)"
                    : "rgba(180,180,180,0.5)",
                }}
                disabled={!hasChanges}
              />

              {/* BOTÓN CANCELAR */}
              <MainButton
                text="Cancelar"
                onPress={() => {
                  setNombre(userData?.nombre ?? "");
                  setApellido(userData?.apellido ?? "");
                  setNumber(userData?.number ?? "");
                  setBlood(userData?.blood ?? "");
                  setContact(userData?.contact ?? "");
                  setGroupName(userData?.group_name ?? "");
                  setHasChanges(false);
                  setEditMode(false);
                }}
                style={{
                  width: "40%",
                  height: 40,
                  borderRadius: 12,
                  marginTop: 10,
                  backgroundColor: "rgba(180, 180, 180, 0.7)",
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(72, 65, 50, 0.8)",
    borderRadius: 20,
    padding: 25,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 32, color: "#fff" },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
  },
  disabledInput: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#ccc",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "rgba(195, 176, 174, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
