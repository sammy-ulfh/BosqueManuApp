import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AdminDrawer from "@/components/AdminDrawer";
type Registro = {
  id: string;
  name: string;
  email: string;
  joined: string;
};

const MOCK: Registro[] = [
  { id: "1", name: "Lucía Fernández", email: "lucia.f@example.com", joined: "2025-10-02" },
  { id: "2", name: "Pedro Martínez", email: "pedro.m@example.com", joined: "2025-09-15" },
  { id: "3", name: "Sara Díaz", email: "sara.d@example.com", joined: "2025-11-01" },
];

export default function VoluntariosAdmin({ navigation }: any) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [items] = useState<Registro[]>(MOCK);

  const renderItem = ({ item }: { item: Registro }) => {
    const initials = (item.name || "").split(" ").map(n => n[0]).slice(0,2).join("");
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.date}>{item.joined}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={() => {}}>
            <Text style={styles.viewButtonText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voluntarios registrados</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.hamburger} accessibilityLabel="Abrir menú">
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Lista de personas registradas como voluntarios.</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{height:12}} />}
      />

      <AdminDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 80, backgroundColor: "#2E7D57", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  hamburger: { position: "absolute", right: 18, top: 24 },
  hamburgerText: { color: "#fff", fontSize: 26 },
  subHeader: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#F6F7F6" },
  subHeaderText: { color: "#4a4a4a" },
  list: { padding: 16 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#EAF6FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#0B6D8A", fontWeight: "800" },
  cardBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  email: { fontSize: 13, color: "#666", marginTop: 4 },
  cardRight: { alignItems: "flex-end" },
  date: { fontSize: 12, color: "#888" },
  viewButton: { marginTop: 8, backgroundColor: "#0B6D8A", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  viewButtonText: { color: "#fff", fontWeight: "700" },
});
