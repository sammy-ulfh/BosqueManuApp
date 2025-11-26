import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "@/mvc/models/supabase/supabaseClient";

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

export default function PersonalData() {
  const [userData, setUserData] = useState<UserData | null>(null);

  async function cargarDatos() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) {
        console.error("Error getting user session:", sessionError);
        return;
      }

      const user = sessionData?.user;
      if (!user) {
        console.warn("No authenticated user found");
        return;
      }

      const { data: fetchedData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching user data:", fetchError);
        return;
      }

      setUserData(fetchedData || null);
    } catch (err) {
      console.error("Unexpected error loading personal data:", err);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  if (!userData) return <Text style={{ marginTop: 80, textAlign: "center" }}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos personales</Text>

      <Text style={styles.item}>Nombre: {userData.nombre ?? "-"} {userData.apellido ?? ""}</Text>
      <Text style={styles.item}>Email: {userData.email ?? "Dato no especificado"}</Text>
      <Text style={styles.item}>Teléfono: {userData.number ?? "Dato no especificado"}</Text>
      <Text style={styles.item}>Grupo sanguíneo: {userData.blood ?? "Dato no especificado"}</Text>
      <Text style={styles.item}>Alergias: {userData.allergies ?? "Dato no especificado"}</Text>
      <Text style={styles.item}>Medicamentos: {userData.medicines ?? "Dato no especificado"}</Text>
      <Text style={styles.item}>Contacto emergencia: {userData.contact ?? "Dato no especificado"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 25
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center"
  },
  item: {
    fontSize: 18,
    marginVertical: 8
  }
});
