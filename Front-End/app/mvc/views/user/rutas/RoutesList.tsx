import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MainButton } from "@/mvc/views/components/MainButton";
import { rutas } from "@/mvc/models/data/routesData";

export default function RoutesList({ navigation }: any) {
  const { difficulty } = useRoute<any>().params;

  const labels: any = {
    easy: "principiantes",
    medium: "intermedias",
    hard: "avanzadas",
  };

  const filtered = rutas.filter(r => r.difficulty === difficulty);

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/main/background2.png")}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Rutas {labels[difficulty]}</Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("RouteMap", { routeInfo: item })}
            >
              <Text style={styles.routeName}>{item.name}</Text>
              <Text style={styles.routeDetails}>Distancia: {item.distance}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <MainButton style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Cancelar</Text>
      </MainButton>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: { fontSize: 28, color: "#fff", marginBottom: 28, fontWeight: "700", fontFamily: "Gloock", textAlign: "center" },
  card: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    backgroundColor: "#244F29",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 24,
    minHeight: 88,
    justifyContent: "center",
  },
  routeName: { fontSize: 20, color: "#fff", fontWeight: "700", fontFamily: "TenorSans", marginBottom: 6 },
  routeDetails: { color: "#ddd", fontFamily: "TenorSans", fontSize: 14 },
  backButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: 150,
    height: 50,
  },
  backText: { color: "#fff", fontWeight: "700", fontFamily: "TenorSans", fontSize: 16 },
});
