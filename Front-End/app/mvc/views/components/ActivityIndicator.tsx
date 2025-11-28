import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ActivityType } from '../../models/ActivityModel.ts';

interface ActivityIndicatorProps {
  activity: ActivityType;
  confidence: number;
  speed: number;       // m/s
  acceleration: number; // m/s²
  distance: number;     // metros
  history: number[];
}

const ACTIVITY_CONFIG = {
  [ActivityType.Idle]: { label: 'Quieto', color: '#94A3B8', emoji: '🧍', graphColor: '#CBD5E1' },
  [ActivityType.Walking]: { label: 'Caminando', color: '#3B82F6', emoji: '🚶', graphColor: '#60A5FA' },
  [ActivityType.Running]: { label: 'Corriendo', color: '#F59E0B', emoji: '🏃', graphColor: '#FBBF24' },
  [ActivityType.Vehicle]: { label: 'En Vehículo', color: '#EF4444', emoji: '🚗', graphColor: '#F87171' },
  [ActivityType.Unknown]: { label: 'Desconocido', color: '#64748B', emoji: '❓', graphColor: '#94A3B8' },
};

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ 
  activity, 
  confidence, 
  speed, 
  acceleration,
  distance,
  history = [] 
}) => {
  const config = ACTIVITY_CONFIG[activity] || ACTIVITY_CONFIG[ActivityType.Unknown];
  
  // Conversiones
  const speedKmh = (speed * 3.6).toFixed(1);
  const confPercent = Math.round(confidence * 100);
  const distDisplay = distance > 1000 
    ? `${(distance / 1000).toFixed(2)} km` 
    : `${Math.floor(distance)} m`;

  const MAX_GRAPH_VAL = 25; 

  return (
    <View style={[styles.card, { backgroundColor: '#1E293B' }]}>
      
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{config.emoji}</Text>
        <View>
          <Text style={styles.labelTitle}>DETECTANDO ACTIVIDAD</Text>
          <Text style={[styles.statusTitle, { color: config.color }]}>
            {config.label.toUpperCase()}
          </Text>
        </View>
        <View style={styles.confBadge}>
          <Text style={styles.confText}>{confPercent}% Prob.</Text>
        </View>
      </View>

      <View style={styles.graphContainer}>
        <Text style={styles.graphLabel}>SENSOR DE ACELERACIÓN (G-FORCE)</Text>
        <View style={styles.graphTrack}>
          {history.slice(-30).map((val, index) => {
            const heightPercent = Math.min((val / MAX_GRAPH_VAL) * 100, 100);
            return (
              <View 
                key={index} 
                style={[
                  styles.graphBar, 
                  { 
                    height: `${Math.max(heightPercent, 5)}%`,
                    backgroundColor: config.graphColor,
                    opacity: (index / 30)
                  }
                ]} 
              />
            );
          })}
        </View>
      </View>

      <View style={styles.statsGrid}>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>VELOCIDAD</Text>
          <Text style={styles.statValue}>{speedKmh} <Text style={styles.unit}>km/h</Text></Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACELERACIÓN</Text>
          <Text style={styles.statValue}>{acceleration.toFixed(1)} <Text style={styles.unit}>m/s²</Text></Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>DISTANCIA</Text>
          <Text style={styles.statValue}>{distDisplay}</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 36,
    marginRight: 15,
  },
  labelTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 0.5,
  },
  confBadge: {
    marginLeft: 'auto',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  graphContainer: {
    height: 80,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'flex-end',
  },
  graphLabel: {
    position: 'absolute',
    top: 6,
    left: 8,
    color: '#475569',
    fontSize: 8,
    fontWeight: 'bold',
  },
  graphTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '80%',
    gap: 2,
  },
  graphBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 'normal',
  },
});
