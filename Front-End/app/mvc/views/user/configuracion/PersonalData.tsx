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
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";

type UserData = {
  id?: number | string;
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

  // Campos editables
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) return console.error(sessionError);

      const user = sessionData?.user;
      if (!user) return;

      const { data: fetchedData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (fetchError) return console.error(fetchError);

      setUserData(fetchedData || null);

      // Inicializar campos editables
      setNombre(fetchedData?.nombre ?? "");
      setApellido(fetchedData?.apellido ?? "");
      setNumber(fetchedData?.number ?? "");
      setBlood(fetchedData?.blood ?? "");
      setContact(fetchedData?.contact ?? "");
      setGroupName(fetchedData?.group_name ?? "");
      setHasChanges(false);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function guardarCambios() {
    if (!userData) return;

    const updates = { nombre, apellido, number, blood, contact, group_name };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_id", userData.id);

    if (error) return Alert.alert("Error", "No se pudo actualizar tus datos");

    Alert.alert("Éxito", "Datos actualizados correctamente");
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
          {/* Contenedor de título y botón */}
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

          {/* Campos editables */}
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={nombre}
            onChangeText={(val) => handleChange("nombre", val)}
            editable={editMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#ccc"
            value={apellido}
            onChangeText={(val) => handleChange("apellido", val)}
            editable={editMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            value={number}
            onChangeText={(val) => handleChange("number", val)}
            editable={editMode}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Grupo sanguíneo"
            placeholderTextColor="#ccc"
            value={blood}
            onChangeText={(val) => handleChange("blood", val)}
            editable={editMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Contacto de emergencia"
            placeholderTextColor="#ccc"
            value={contact}
            onChangeText={(val) => handleChange("contact", val)}
            editable={editMode}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre de grupo"
            placeholderTextColor="#ccc"
            value={group_name}
            onChangeText={(val) => handleChange("group_name", val)}
            editable={editMode}
          />

          {/* Campos no editables */}
          <Text style={styles.disabledInput}>
            Email: {userData.email ?? "No especificado"}
          </Text>
          <Text style={styles.disabledInput}>
            Alergias: {userData.allergies ?? "No especificado"}
          </Text>
          <Text style={styles.disabledInput}>
            Medicamentos: {userData.medicines ?? "No especificado"}
          </Text>

          {/* Botón guardar solo si hay cambios */}
          {editMode && hasChanges && (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <MainButton
                text="Guardar cambios"
                onPress={guardarCambios}
                style={styles.button}
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
  button: {
    width: "60%",
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(120,200,150,0.85)",
  },
  editButton: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
