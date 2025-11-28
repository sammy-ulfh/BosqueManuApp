import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SavedRoute } from '../../../models/ActivityModel';
import RouteService from '../../../services/RouteService';
import { SessionDetailModal } from '../../components/SessionDetailModal';

export default function StatisticsScreen() {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar rutas
  const loadRoutes = async () => {
    setRefreshing(true);
    const saved = await RouteService.getAllRoutes();
    setRoutes(saved.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, [])
  );

  const handleOpenRoute = (route: SavedRoute) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: SavedRoute }) => {
    const date = new Date(item.date);
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleOpenRoute(item)}>
        <View style={styles.iconBox}>
           <FontAwesome5 name="map-marked-alt" size={24} color="#3B82F6" />
        </View>
        <View style={styles.info}>
          <Text style={styles.dateText}>{date.toLocaleDateString()} - {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}><FontAwesome5 name="road" /> {item.stats.distanceMeters.toFixed(0)}m</Text>
            <Text style={styles.stat}><FontAwesome5 name="clock" /> {(item.stats.durationSeconds / 60).toFixed(0)} min</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Estadísticas</Text>
        <Text style={styles.subtitle}>{routes.length} sesiones registradas</Text>
      </View>

      <FlatList 
        data={routes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRoutes} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tienes rutas guardadas aún.</Text>
          </View>
        }
      />

      {/* Modal para ver la ruta seleccionada */}
      <SessionDetailModal 
        visible={modalVisible}
        route={selectedRoute}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { color: '#64748B', marginTop: 5 },
  list: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  iconBox: { width: 50, height: 50, backgroundColor: '#EFF6FF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  info: { flex: 1 },
  dateText: { fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
  statsRow: { flexDirection: 'row', gap: 15 },
  stat: { color: '#64748B', fontSize: 12 },
  empty: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94A3B8' }
});
