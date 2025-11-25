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

type Donativo = {
  id: string;
  donor: string;
  amount: number;
  date: string;
  method: string;
};

const MOCK: Donativo[] = [
  { id: "d1", donor: "María López", amount: 500, date: "2025-11-12", method: "Tarjeta" },
  { id: "d2", donor: "Carlos Pérez", amount: 1000, date: "2025-11-15", method: "Transferencia" },
  { id: "d3", donor: "Ana Gómez", amount: 900, date: "2025-11-20", method: "Efectivo" },
];

export default function DonativosAdmin({ navigation }: any) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [items] = useState<Donativo[]>(MOCK);

  const renderItem = ({ item }: { item: Donativo }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.donor}>{item.donor}</Text>
          <Text style={styles.meta}>{item.method} • {item.date}</Text>
        </View>
        <View style={styles.amountWrap}>
          <Text style={styles.amount}>${item.amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Donativos MBM</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.hamburger} accessibilityLabel="Abrir menú">
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Registros de donaciones recibidas.</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{height:12}} />}
      />

      <AdminDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 80, backgroundColor: '#2E7D57', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' , paddingHorizontal:16},
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  hamburger: { position: 'absolute', right: 18, top: 24 },
  hamburgerText: { color: '#fff', fontSize: 26 },
  subHeader: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#F6F7F6' },
  subHeaderText: { color: '#4a4a4a' },
  list: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation:2, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6, shadowOffset:{width:0,height:2} },
  cardBody: { flex: 1 },
  donor: { fontSize: 16, fontWeight: '700', color: '#222' },
  meta: { marginTop: 4, fontSize: 13, color: '#666' },
  amountWrap: { marginLeft: 12 },
  amount: { fontSize: 18, fontWeight: '800', color: '#2E7D57' },
});