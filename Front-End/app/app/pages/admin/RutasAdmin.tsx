import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Font from 'expo-font';
import AdminDrawer from '../../../app/components/AdminDrawer';
import { supabase } from '../../../scripts/supabaseClient';

type UserRoute = {
  id: string;
  user_id: string;
  route_id: string;
  status: 'in_progress' | 'completed' | string;
  start_time?: string | null;
  end_time?: string | null;
};

export default function RutasAdmin({ navigation }: any) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [items, setItems] = useState<UserRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require('../../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf'),
      Gloock: require('../../../assets/fonts/Gloock/Gloock-Regular.ttf'),
      Raleway: require('../../../assets/fonts/Raleway/static/Raleway-Black.ttf'),
    });
    setIsLoaded(true);
  };

  useEffect(() => {
    loadFonts();

    let mounted = true;
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_routes')
          .select('id, user_id, route_id, status, start_time, end_time')
          .order('start_time', { ascending: false });

        if (error) {
          console.error('Error fetching user_routes:', error);
          if (mounted) setItems([]);
        } else {
          const mapped = (data || []).map((r: any) => ({
            id: String(r.id),
            user_id: r.user_id,
            route_id: r.route_id,
            status: r.status,
            start_time: r.start_time,
            end_time: r.end_time,
          }));
          if (mounted) setItems(mapped);
        }
      } catch (err) {
        console.error('Fetch error', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRoutes();
    return () => { mounted = false };
  }, []);

  const renderItem = ({ item }: { item: UserRoute }) => {
    const start = item.start_time ? new Date(item.start_time).toLocaleString() : '—';
    const end = item.end_time ? new Date(item.end_time).toLocaleString() : '—';
    const statusColor = item.status === 'completed' ? '#2E7D57' : '#E67E22';

    return (
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={[styles.routeTitle, { fontFamily: 'Gloock' }]}>{item.route_id}</Text>
          <Text style={[styles.meta, { fontFamily: 'TenorSans' }]}>Inició: {start}</Text>
          {item.end_time ? <Text style={[styles.meta, { fontFamily: 'TenorSans' }]}>Terminó: {end}</Text> : null}
        </View>

        <View style={styles.cardRight}>
          <Text style={[styles.status, { color: statusColor, fontFamily: 'TenorSans' }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E7D57" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: 'Gloock' }]}>Rutas Usuario</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.hamburger} accessibilityLabel="Abrir menú">
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={[styles.subHeaderText, { fontFamily: 'TenorSans' }]}>Rutas iniciadas por usuarios (registros guardados).</Text>
      </View>

      {loading ? (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { fontFamily: 'TenorSans' }]}>No hay rutas registradas aún.</Text>
            </View>
          )}
        />
      )}

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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation:2, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6, shadowOffset:{width:0,height:2} },
  cardBody: { flex: 1 },
  routeTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
  meta: { marginTop: 4, fontSize: 13, color: '#666' },
  cardRight: { alignItems: 'flex-end', minWidth: 90 },
  status: { fontSize: 13, fontWeight: '800' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', fontStyle: 'italic' }
});
