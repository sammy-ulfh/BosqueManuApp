import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SavedRoute } from '../models/ActivityModel';
import RouteService from '../services/RouteService';

interface SessionHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSession: (route: SavedRoute) => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({ visible, onClose, onSelectSession }) => {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga las rutas cada vez que se abre el modal
  useEffect(() => {
    if (visible) {
      loadRoutes();
    }
  }, [visible]);

  const loadRoutes = async () => {
    setLoading(true);
    const saved = await RouteService.getAllRoutes();
    // Ordena por fecha
    const sorted = saved.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRoutes(sorted);
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert("Borrar Historial", "¿Estás seguro? Esto no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar Todo", style: "destructive", onPress: async () => {
          setRoutes([]);
      }}
    ]);
  };

  const renderItem = ({ item }: { item: SavedRoute }) => {
    const date = new Date(item.date);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectSession(item)}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="map-marked-alt" size={24} color="#3B82F6" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.cardTitle}>Sesión del {dateStr}</Text>
          <Text style={styles.cardSubtitle}>{timeStr} • {item.stats.distanceMeters.toFixed(0)}m • {(item.stats.durationSeconds / 60).toFixed(0)} min</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historial de Rutas</Text>
          <TouchableOpacity onPress={handleDelete}>
             <MaterialCommunityIcons name="trash-can-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={routes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="map-clock-outline" size={64} color="#E2E8F0" />
              <Text style={styles.emptyText}>No hay sesiones guardadas.</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  listContent: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontSize: 16 },
});
