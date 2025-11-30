import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { obtenerUsuarios } from "@/mvc/models/user/getUsers.js";

/* Components */
import { Input } from "@/mvc/views/components/Input.js";
import { MainButton } from "@/mvc/views/components/MainButton.js";
import Singup from "../Singup.js";

type User = {
  id: number | string;
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  group_name?: string | null;
  blood?: string | null;
  allergies?: string | null;
  medicines?: string | null;
  contact?: string | null;
  number?: string | null;
};

export default function Info({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setIsLoaded(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await loadFonts();
      const data = await obtenerUsuarios();
      setUsers(data || []);
    };
    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.whiteText}>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/main/background2.png")}
    >
      <View
        style={[
          styles.totalWidth,
          styles.totalHeight,
          styles.container,
          styles.overlay,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View
          style={[
            styles.totalWidth,
            {
              height: "80%",
              marginTop: "5%",
            },
          ]}
        >
          {/* Logo */}
          <View style={[styles.totalWidth, { height: "20%" }]}>
            <Image
              source={require("@/assets/main/logo.png")}
              style={[styles.imagen, { height: "100%" }]}
            />
          </View>

          {/* Título */}
          <View
            style={[
              styles.totalWidth,
              {
                height: "90%",
                justifyContent: "flex-start",
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={[
                styles.whiteText,
                { fontFamily: "Gloock", fontSize: 40 },
              ]}
            >
              DB DATA
            </Text>


            <View style={{ flex: 1, width: "100%", marginTop: 20 }}>
              <FlatList
                data={users}
                keyExtractor={(item, index) => (item?.id ? String(item.id) : index.toString())}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                      {item.nombre} {item.apellido}
                    </Text>
                    <Text style={styles.cardText}>Email: {item.email ? item.email : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Número: {item.number ? item.number : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Tipo de sangre: {item.blood ? item.blood : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Nombre de grupo: {item.group_name ? item.group_name : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Alergias: {item.allergies ? item.allergies : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Medicinas: {item.medicines ? item.medicines : "Dato no especificado"}</Text>
                    <Text style={styles.cardText}>Contacto de emergencia: {item.contact ? item.contact : "Dato no especificado"}</Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.whiteText}>Cargando usuarios...</Text>
                )}
              />
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  whiteText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "TenorSans",
  },
  totalWidth: {
    width: "100%",
  },
  totalHeight: {
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imagen: {
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Gloock",
    marginBottom: 10,
  },
  cardText: {
    color: "#ddd",
    fontSize: 16,
    fontFamily: "TenorSans",
    marginBottom: 4,
  },
});

