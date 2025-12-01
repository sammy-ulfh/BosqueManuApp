import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useActivityClassifier } from '@/mvc/hooks/useActivityClassifier';
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { SessionStatsCard } from '../../components/SessionStatsCard';
import { SessionHistoryModal } from '../../components/SessionHistoryModal';
import { SessionDetailModal } from '../../components/SessionDetailModal';
import { SavedRoute } from '@/mvc/models/ActivityModel';

export default function ActivityTrackerScreen() {
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

  const [historyVisible, setHistoryVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);

  const handleToggleTracking = async () => {
    if (isActive) {
      // DETENER
      const route = stopTracking(); 
      
      if (route) {
        Alert.alert(
          "¡Sesión Guardada!", 
          `Has recorrido ${route.stats.distanceMeters.toFixed(0)} metros en ${(route.stats.durationSeconds/60).toFixed(1)} min.`,
          [
            { 
              text: "Ver Mapa y Detalles", 
              onPress: () => handleSelectSession(route) 
            },
            { text: "Cerrar" }
          ]
        );
      }
    } else {
      await startTracking();
    }
  };

  const handleSelectSession = (route: SavedRoute) => {
    setSelectedRoute(route);
    setHistoryVisible(false);
    setDetailVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        
        {/* Encabezado GPS */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#DC2626" />
            <Text style={styles.locationTitle}>Rastreo Activo</Text>
            {hasPermission && <View style={styles.liveBadge}><Text style={styles.liveText}>GPS ON</Text></View>}
          </View>
          {currentLocation ? (
            <Text style={styles.coords}>
              {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}
            </Text>
          ) : (
            <Text style={styles.waitingText}>
              {hasPermission ? 'Buscando satélites...' : 'Sin permisos GPS'}
            </Text>
          )}
        </View>

        <ActivityIndicator 
          activity={currentActivity}
          confidence={confidence}
          speed={currentLocation?.speed || 0}
          acceleration={currentAccel ? Math.sqrt(currentAccel.x**2 + currentAccel.y**2 + currentAccel.z**2) : 0}
          distance={sessionStats.distanceMeters}
          history={accelHistory}
        />

        {/* Estadisticas actuales */}
        <SessionStatsCard stats={sessionStats} />

        {/* Start/Stop */}
        <TouchableOpacity 
          style={[styles.actionBtn, isActive ? styles.stopBtn : styles.startBtn]}
          onPress={handleToggleTracking}
        >
          <FontAwesome5 name={isActive ? "stop" : "play"} size={22} color="white" />
          <View>
            <Text style={styles.actionBtnText}>
              {isActive ? "FINALIZAR SESIÓN" : "INICIAR RASTREO"}
            </Text>
            <Text style={styles.actionBtnSubtext}>
              {isActive ? "Guardar ruta y estadísticas" : "Detectar movimiento y GPS"}
            </Text>
          </View>
        </TouchableOpacity>

        {!isActive && (
          <TouchableOpacity style={styles.historyBtn} onPress={() => setHistoryVisible(true)}>
            <MaterialCommunityIcons name="history" size={24} color="#475569" />
            <Text style={styles.historyBtnText}>Ver Historial de Sesiones</Text>
          </TouchableOpacity>
        )}

      </View>

      <SessionHistoryModal 
        visible={historyVisible} 
        onClose={() => setHistoryVisible(false)}
        onSelectSession={handleSelectSession}
      />

      <SessionDetailModal 
        visible={detailVisible} 
        route={selectedRoute}
        onClose={() => setDetailVisible(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F1F5F9' 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 40 
  }, 
  locationCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  locationHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 8 
  },
  locationTitle: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    color: '#0F172A' 
  },
  liveBadge: { 
    backgroundColor: '#DCFCE7', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  liveText: { 
    fontSize: 10, 
    color: '#166534', 
    fontWeight: 'bold'
  },
  coords: { 
    fontSize: 12, 
    color: '#64748B', 
    fontFamily: 'monospace'
  },
  waitingText: { 
    fontSize: 12, 
    color: '#94A3B8', 
    fontStyle: 'italic' 
  },
  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 18, 
    borderRadius: 20, 
    marginVertical: 15, 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    gap: 15 
  },
  startBtn: { 
    backgroundColor: '#2563EB' 
  },
  stopBtn: { 
    backgroundColor: '#EF4444' 
  },
  actionBtnText: { 
    color: 'white', 
    fontWeight: '900', 
    fontSize: 18, 
    letterSpacing: 0.5 
  },
  actionBtnSubtext: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 12 
  },
  historyBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    gap: 10, 
    marginBottom: 20
  },
  historyBtnText: { 
    color: '#475569', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
