import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Linking from 'expo-linking';
import { startRouteTracking, finishRouteTracking } from '../../../models/ruta/routeTracking';

export default function RouteMap() {
  const navigation = useNavigation<any>();
  const { routeInfo } = useRoute<any>().params;

  const initialRegion = {
    latitude: routeInfo.coordinates[0].latitude,
    longitude: routeInfo.coordinates[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const botiquines = [
    { latitude: 20.6235, longitude: -103.56127 },
    { latitude: 20.62059, longitude: -103.5457 },
    { latitude: 20.62157, longitude: -103.53549 },
    { latitude: 20.61328, longitude: -103.54106 },
    { latitude: 20.60782, longitude: -103.53087 },
    { latitude: 20.61443, longitude: -103.52027 },
  ];

  const [tracking, setTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [distanceToEnd, setDistanceToEnd] = useState<number | null>(null);
  const locationSub = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (locationSub.current) {
        locationSub.current.remove();
        locationSub.current = null;
      }
    };
  }, []);

  function haversine(a: any, b: any) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const aa = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  }

  async function downloadPdfWeb(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la red');
      const blob = await response.blob();
      const downloadUrl = (window as any).URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'PrimerosAuxilios.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      (window as any).URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('Falló la descarga web', e);
      Alert.alert('Error', 'No se pudo descargar el PDF en web.');
    }
  }

  async function downloadPdfNative(url: string) {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error('Falló abrir enlace', e);
      Alert.alert('Error', 'No se pudo abrir el enlace para descargar el PDF.');
    }
  }

  const startTrackingInternal = async (doDownload: boolean) => {
    const url = 'https://sammy-ulfh.dev/PrimerosAuxilios.pdf';
    if (doDownload) {
      if (Platform.OS === 'web') {
        await downloadPdfWeb(url);
      } else {
        await downloadPdfNative(url);
      }
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso', 'Permiso de ubicación denegado');
      return;
    }

    // Start server-side tracking record first
    try {
      setTrackingLoading(true);
      const { data, error } = await startRouteTracking(routeInfo?.id || routeInfo?.routeId || routeInfo?._id);
      if (error) {
        console.error('startRouteTracking error', error);
        Alert.alert('Error', 'No se pudo iniciar el seguimiento en el servidor. Intenta de nuevo.');
        setTrackingLoading(false);
        return;
      }

      // store tracking id and begin local geolocation
      setTrackingId(data?.id ?? null);
      setTracking(true);
      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 5, timeInterval: 2000 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          const user = { latitude, longitude };
          setUserLocation(user);
          const end = routeInfo.coordinates[routeInfo.coordinates.length - 1];
          const dist = haversine(user, end);
          setDistanceToEnd(Math.round(dist));
        }
      );
    } catch (err) {
      console.error('Error starting tracking', err);
      Alert.alert('Error', 'Ocurrió un problema al iniciar el seguimiento.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const startTracking = () => {
    // First show helmet reminder before offering the PDF download option
    Alert.alert(
      'Recuerda',
      'Si vas a conducir una bicicleta o realizar ciclismo en la ruta, usa casco y equipo de protección.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert(
              'Descarga de PDF',
              'Se descargará un PDF con rutas offline y primeros auxilios para usar en caso de falta de internet. ¿Deseas descargarlo ahora?',
              [
                { text: 'No, continuar', onPress: () => startTrackingInternal(false) },
                { text: 'Descargar y continuar', onPress: () => startTrackingInternal(true) },
              ]
            );
          },
        },
      ]
    );
  };

  const stopTracking = () => {
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }
    setTracking(false);
    setDistanceToEnd(null);

    // finish server-side tracking if we have an id
    (async () => {
      if (!trackingId) return;
      try {
        setTrackingLoading(true);
        const { data, error } = await finishRouteTracking(trackingId);
        if (error) {
          console.error('finishRouteTracking error', error);
          Alert.alert('Aviso', 'No se pudo registrar el fin de ruta en el servidor.');
        } else {
          // optionally notify user
          // Alert.alert('Listo', 'Seguimiento finalizado');
        }
      } catch (err) {
        console.error('Error finishing tracking', err);
      } finally {
        setTrackingLoading(false);
        setTrackingId(null);
      }
    })();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routeInfo.name}</Text>
      <Text style={styles.subtitle}>Distancia: {routeInfo.distance}</Text>

      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* Only show start and end markers */}
        {routeInfo.coordinates.length > 0 && (
          <Marker coordinate={routeInfo.coordinates[0]} title="Inicio" pinColor="#2ecc71">
            <View>
              <Text style={styles.markerLabel}>Inicio</Text>
            </View>
          </Marker>
        )}

        {routeInfo.coordinates.length > 1 && (
          <Marker coordinate={routeInfo.coordinates[routeInfo.coordinates.length - 1]} title="Final" pinColor="#e74c3c">
            <View>
              <Text style={styles.markerLabel}>Final</Text>
            </View>
          </Marker>
        )}

        <Polyline
          coordinates={routeInfo.coordinates}
          strokeWidth={5}
          strokeColor="#27ae60"
        />

        {/* Route name label positioned at midpoint */}
        {routeInfo.coordinates.length > 1 && (() => {
          const midIndex = Math.floor(routeInfo.coordinates.length / 2);
          const mid = routeInfo.coordinates[midIndex];
          return (
            <Marker coordinate={mid} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.routeNameBubble} pointerEvents="none">
                <Text style={styles.routeNameText}>{routeInfo.name}</Text>
              </View>
            </Marker>
          );
        })()}

        {/* show user marker while tracking */}
        {userLocation && (
          <Marker coordinate={userLocation} title="Tú" pinColor="#3498db" />
        )}

        {botiquines.map((b, i) => (
          <Marker key={i} coordinate={b} title="Botiquín" pinColor="red" />
        ))}
      </MapView>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
          <Text style={styles.controlButtonText}>Regresar</Text>
        </TouchableOpacity>

        {!tracking ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={startTracking}
            disabled={trackingLoading}
          >
            <Text style={styles.controlButtonText}>{trackingLoading ? 'Iniciando...' : 'Iniciar'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={stopTracking}
            disabled={trackingLoading}
          >
            <Text style={styles.controlButtonText}>{trackingLoading ? 'Finalizando...' : 'Detener'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {tracking && distanceToEnd !== null && (
        <View style={styles.guideBox} pointerEvents="none">
          <Text style={styles.guideText}>Te faltan {distanceToEnd} m para el final</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#312605ff" },
  title: { fontSize: 24, color: "#fff", textAlign: "center", marginTop: 24, fontFamily: "Gloock" },
  subtitle: { fontSize: 16, color: "#ccc", textAlign: "center", marginBottom: 10, fontFamily: "TenorSans" },
  map: { width: "90%", height: "65%", alignSelf: "center", borderRadius: 15 },
  markerLabel: { color: "#fff", fontWeight: "700", fontFamily: "TenorSans" },
  routeNameBubble: { backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  routeNameText: { color: "#fff", fontSize: 14, fontFamily: "Gloock" },
  buttonsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  controlButton: { backgroundColor: "#565c35ff", padding: 12, borderRadius: 10, minWidth: 120, alignItems: "center" },
  controlButtonText: { color: "#fff", fontSize: 16, fontFamily: "TenorSans", fontWeight: "600" },
  startButton: { backgroundColor: "#209339ff" },
  stopButton: { backgroundColor: "#EF4444" },
  guideBox: { position: "absolute", bottom: 20, left: 20, right: 20, backgroundColor: "rgba(0,0,0,0.6)", padding: 12, borderRadius: 8, alignItems: "center" },
  guideText: { color: "#fff", fontSize: 16, fontFamily: "TenorSans" },
});
