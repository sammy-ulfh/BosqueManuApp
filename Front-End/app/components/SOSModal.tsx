import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";

import LocationService from "@/mvc/services/LocationService";
import { supabase } from "@/mvc/models/supabase/supabaseClient";
import { getCurrentSession } from "@/mvc/models/auth/auth";

type Props = {
  visible: boolean;
  onClose: () => void;
  imageSource?: ImageSourcePropType;
  size?: number;
  navigation?: any;
};

export default function SOSModal({ visible, onClose, imageSource, size = 190, navigation }: Props) {
  const img = imageSource ?? require("@/assets/images/SOSboton.png");
  const [sending, setSending] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  async function handleSendSOS() {
    if (sending) return;
    setSending(true);

    try {
      const permitted = await LocationService.requestPermissions();
      if (!permitted) {
        Alert.alert('Permisos de ubicación', 'No se pudieron obtener los permisos de ubicación.');
        setSending(false);
        return;
      }

      // Get current session/user
      const { session, error: sessionError } = await getCurrentSession();
      if (sessionError) console.log('[SOS] getCurrentSession error:', sessionError);

      // Wait for first location update using the existing startTracking function
      const locationPromise = new Promise<any>((resolve, reject) => {
        let resolved = false;

        const cb = (loc: any) => {
          if (resolved) return;
          resolved = true;
          resolve(loc);
        };

        LocationService.startTracking(cb).catch((err: any) => {
          if (!resolved) {
            resolved = true;
            reject(err);
          }
        });

        // Safety timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            reject(new Error('timeout waiting for location'));
          }
        }, 10000);
      });

      const loc = await locationPromise;

      // Stop tracking immediately after we got a single location
      LocationService.stopTracking();

      // Normalize to an object with coords to match expected shape
      const locationObj = { coords: { latitude: loc.latitude, longitude: loc.longitude } };

      const userId = session?.user?.id;

      if (!userId) {
        console.log("[SOS] Error: No authenticated user");
        Alert.alert("Error", "Debes iniciar sesión para enviar una alerta.");
        setSending(false);
        return;
      }

      const { data, error } = await supabase.from('sos_alerts').insert({
        user_id: userId,
        email: session?.user?.email ?? null,
        lat: locationObj.coords.latitude,
        lng: locationObj.coords.longitude,
        status: 'active',
      }).select();

      if (error) {
        console.error(error?.message || error);
      } else {
        console.log('SOS enviado a la base de datos');
        setShowBanner(true);
      }

      console.log('[SOS] location sent:', { lat: locationObj.coords.latitude, lng: locationObj.coords.longitude });

      Alert.alert('Alerta enviada', 'No te muevas del área, la ayuda va en camino');
    } catch (err) {
      console.log('[SOS] unexpected error:', err);
      Alert.alert('Error', 'No se pudo enviar la alerta SOS. Intenta nuevamente.');
    } finally {
      setSending(false);
    }
  }

  function confirmAndSend() {
    Alert.alert(
      'Confirmar',
      'Se notificará que esta en una emergencia y vendra la ayuda en camino. ¿Estás seguro?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: () => handleSendSOS() },
      ],
      { cancelable: true }
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
          <View style={[styles.modalContainer, { width: size + 80 }]}>
            <View style={{ width: size + 56, height: size + 56, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Text style={[styles.sosLabel, { position: 'absolute', top: -28, fontSize: 18 }]}>Botón de ayuda en caso de emergencia</Text>
              <View style={[styles.whiteCircle, { width: size, height: size, borderRadius: size / 2 }]} />
              <TouchableOpacity onPress={confirmAndSend} accessible accessibilityRole="button" activeOpacity={0.8} style={{ position: 'absolute' }}>
                <Image
                  source={img}
                  style={[
                    styles.sosImage,
                    { width: size + 36, height: size + 36, borderRadius: (size + 36) / 2 },
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>


            <TouchableOpacity accessibilityRole="button" style={[styles.cancelButton, { marginTop: 36 }]} onPress={() => { setShowBanner(false); onClose(); }}>
              <Text style={styles.cancelText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
      </View>
      {showBanner && (
        <View style={styles.topBanner} pointerEvents="box-none">
          <Text style={styles.topBannerText}>la ayuda va en camino</Text>
        </View>
      )}

    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  whiteCircle: {
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.95)",
  },
  sosImage: {

  },
  cancelButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 34,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 12,
  },
  cancelText: {
    color: "#2D2A24",
    fontWeight: "700",
    fontSize: 16,
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: '#cc0000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
    paddingTop: 6,
  },
  topBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  sosLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'TenorSans',
    marginBottom: 8,
    textAlign: 'center',
  },
  
});
