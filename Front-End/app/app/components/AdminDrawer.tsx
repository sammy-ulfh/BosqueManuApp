import React, { useEffect, useRef } from "react";
import { startSosListener } from "../services/sosListener";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(520, SCREEN_WIDTH * 0.78);

type Props = {
  visible: boolean;
  onClose: () => void;
  navigation: any;
};

export default function AdminDrawer({ visible, onClose, navigation }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 260,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  useEffect(() => {
    // start global SOS listener so admin receives notifications even when not on the SOS screen
    startSosListener().catch(err => console.error('Error starting global SOS listener', err));
  }, []);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  });

  const overlayOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.52],
  });

  const closeAndNavigate = (route?: string) => {
    onClose();
    if (route) {
      setTimeout(() => navigation?.navigate?.(route), 220);
    }
  };

  return (
    <>
      <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH, transform: [{ translateX }] }]} pointerEvents={visible ? "auto" : "none"}>
        <View style={styles.inner}>
          <Text style={styles.header}>Panel de Administración</Text>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate("Info")}>
            <Text style={styles.itemText}>Usuarios registrados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate("CapacitacionesAdmin")}>
            <Text style={styles.itemText}>Capacitaciones registradas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate("VoluntariosAdmin")}>
            <Text style={styles.itemText}>Voluntarios registrados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate("DonativosAdmin")}>
            <Text style={styles.itemText}>Donativos MBM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate()}>
            <Text style={styles.itemText}>Rutas usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => closeAndNavigate("SOSAlertsAdmin")}>
            <Text style={styles.itemText}>Notificaciones SOS</Text>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  overlayTouchable: { flex: 1 },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  inner: {
    backgroundColor: "transparent",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: "flex-start",
  },
  header: {
    color: "#fff",
    fontSize: 18,
    textAlign: "right",
    marginBottom: 18,
    fontWeight: "700",
  },
  item: { paddingVertical: 14 },
  itemText: { color: "#fff", fontSize: 18, textAlign: "right" },
});
