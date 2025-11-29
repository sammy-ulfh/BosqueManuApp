import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert 
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useActivityClassifier } from '@/mvc/hooks/useActivityClassifier';
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { SessionStatsCard } from '../../components/SessionStatsCard';
import { SessionDetailModal } from '../../components/SessionDetailModal';
import { SavedRoute } from '../../../models/ActivityModel';

export default function ActiveRouteScreen() {
  const {
    isActive,
    currentActivity,
    confidence,
    sessionStats,
    currentLocation,
    currentAccel,
    accelHistory,
    startTracking,
    stopTracking,
    hasPermission
  } = useActivityClassifier();

  const [detailVisible, setDetailVisible] = useState(false);
  const [lastRoute, setLastRoute] = useState<SavedRoute | null>(null);

  const handleToggleTracking = async () => {
    if (isActive) {
      // DETENER
      const route = stopTracking(); 
      if (route) {
        setLastRoute(route);
        Alert.alert(
          "¡Ruta Finalizada!", 
          `Distancia total: ${route.stats.distanceMeters.toFixed(0)}m`,
          [
            { text: "Ver Mapa", onPress: () => setDetailVisible(true) },
            { text: "Cerrar" }
          ]
        );
      }
    } else {
      // INICIAR
      await startTracking();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Monitor de Actividad</Text>
          <View style={[styles.badge, hasPermission ? styles.badgeOk : styles.badgeErr]}>
             <Text style={styles.badgeText}>{hasPermission ? "GPS ACTIVO" : "SIN SEÑAL"}</Text>
          </View>
        </View>

        <View style={styles.gpsCard}>
          <MaterialCommunityIcons name="satellite-uplink" size={24} color="#475569" />
          <View>
             <Text style={styles.gpsLabel}>Latitud / Longitud</Text>
             <Text style={styles.gpsValue}>
               {currentLocation ? `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}` : "Esperando ubicación..."}
             </Text>
          </View>
        </View>

        <ActivityIndicator 
          activity={currentActivity}
          confidence={confidence}
          speed={currentLocation?.speed || 0}
          acceleration={currentAccel ? Math.sqrt(currentAccel.x**2 + currentAccel.y**2 + currentAccel.z**2) : 0}
          distance={sessionStats.distanceMeters}
          history={accelHistory}
        />

        <SessionStatsCard stats={sessionStats} />

        <TouchableOpacity 
          style={[styles.actionBtn, isActive ? styles.stopBtn : styles.startBtn]}
          onPress={handleToggleTracking}
        >
          <FontAwesome5 name={isActive ? "stop" : "play"} size={24} color="white" />
          <Text style={styles.actionBtnText}>
            {isActive ? "TERMINAR RUTA" : "INICIAR RUTA"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <SessionDetailModal 
        visible={detailVisible} 
        route={lastRoute}
        onClose={() => setDetailVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeOk: { backgroundColor: '#DCFCE7' },
  badgeErr: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#334155' },
  
  gpsCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, gap: 15 },
  gpsLabel: { fontSize: 12, color: '#64748B' },
  gpsValue: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', fontFamily: 'monospace' },

  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: 16, marginTop: 20, gap: 10, elevation: 5 },
  startBtn: { backgroundColor: '#2563EB' },
  stopBtn: { backgroundColor: '#EF4444' },
  actionBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
