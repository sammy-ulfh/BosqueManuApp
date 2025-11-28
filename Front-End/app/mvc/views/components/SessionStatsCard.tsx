import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SessionStats } from '../models/ActivityModel';

interface SessionStatsCardProps {
  stats: SessionStats;
}

export const SessionStatsCard: React.FC<SessionStatsCardProps> = ({ stats }) => {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDist = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
    return `${Math.round(meters)} m`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="bar-chart" size={24} color="#0F172A" />
          <Text style={styles.cardTitle}>Estadísticas de Sesión</Text>
        </View>
        {stats.status === 'active' && (
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>En vivo</Text>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        {/* Duración */}
        <View style={styles.gridItem}>
          <Ionicons name="timer-outline" size={24} color="#64748B" />
          <Text style={styles.value}>{formatTime(stats.durationSeconds)}</Text>
          <Text style={styles.label}>Duración</Text>
        </View>

        {/* Distancia */}
        <View style={styles.gridItem}>
          <MaterialIcons name="straighten" size={24} color="#3B82F6" />
          <Text style={styles.value}>{formatDist(stats.distanceMeters)}</Text>
          <Text style={styles.label}>Distancia</Text>
        </View>

        {/* Calorías */}
        <View style={styles.gridItem}>
          <FontAwesome5 name="fire" size={24} color="#F97316" />
          <Text style={styles.value}>{stats.caloriesBurned.toFixed(0)}</Text>
          <Text style={styles.label}>Calorías</Text>
        </View>

        {/* Velocidad Promedio */}
        <View style={styles.gridItem}>
          <FontAwesome5 name="bolt" size={24} color="#EAB308" />
          <Text style={styles.value}>{stats.averageSpeedKmh.toFixed(1)} km/h</Text>
          <Text style={styles.label}>Promedio</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  badgeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '43%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
});
