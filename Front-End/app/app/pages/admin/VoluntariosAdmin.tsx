import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import AdminDrawer from "../../../app/components/AdminDrawer";
import { useVoluntariosController } from "../../controllers/useVoluntariosController";

export default function VoluntariosAdmin({ navigation }: any) {
  const { 
    drawerVisible, 
    setDrawerVisible, 
    items, 
    loading, 
    refreshing, 
    onRefresh 
  } = useVoluntariosController();

  const renderItem = ({ item }: { item: any }) => {
    const initials = (item.name || "?").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
    
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
          <TouchableOpacity style={styles.viewButton} onPress={() => { /* Perfil */ }}>
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
        <TouchableOpacity 
          onPress={() => setDrawerVisible(true)} 
          style={styles.hamburger} 
          accessibilityLabel="Abrir menú"
        >
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Lista de personas registradas en eventos de voluntariado.</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
           <ActivityIndicator size="large" color="#0B6D8A" />
           <Text style={{marginTop: 10, color: '#666'}}>Cargando voluntarios...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0B6D8A"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay voluntarios registrados aún.</Text>
            </View>
          }
        />
      )}

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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#EAF6FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#0B6D8A", fontWeight: "800", fontSize: 18 },
  cardBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  email: { fontSize: 13, color: "#666", marginTop: 4 },
  cardRight: { alignItems: "flex-end", minWidth: 70 },
  date: { fontSize: 12, color: "#888", marginBottom: 5 },
  viewButton: { marginTop: 8, backgroundColor: "#0B6D8A", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  viewButtonText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', fontStyle: 'italic' }
});
