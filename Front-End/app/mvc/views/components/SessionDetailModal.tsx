import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SavedRoute } from '../../models/ActivityModel';
import { SessionStatsCard } from './SessionStatsCard';
import RouteService from '../../services/RouteService';

interface SessionDetailModalProps {
  visible: boolean;
  route: SavedRoute | null;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ visible, route, onClose }) => {
  if (!route) return null;

  const mapHtml = RouteService.generateMapHTML(route);

  const dateStr = new Date(route.date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Detalle de Sesión</Text>
            <Text style={styles.headerDate}>{dateStr}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Mapa (WebView) */}
        <View style={styles.mapContainer}>
          <WebView 
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.map}
            nestedScrollEnabled
          />
        </View>

        {/* Estadísticas Resumen */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen de Rendimiento</Text>
          <SessionStatsCard stats={route.stats} />
        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerDate: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  mapContainer: {
    height: 350,
    width: '100%',
    backgroundColor: '#E2E8F0',
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
});
