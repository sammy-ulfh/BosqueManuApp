import React, { useEffect, useRef } from "react";
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

export default function CustomDrawer({ visible, onClose, navigation }: Props) {
  const anim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, anim]);

  // translateX from drawerWidth -> 0
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  });

  const overlayOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.72],
  });

  const handleNavigate = (routeName: string) => {
    onClose();
    // small delay to allow drawer to close animation before navigating
    setTimeout(() => navigation?.navigate?.(routeName), 220);
  };

  if (!visible) {
    // keep rendering to allow animation to run to closed; but if anim value is 0 and not visible, we still render overlay with pointerEvents none
  }

  return (
    <React.Fragment>
      {/* Overlay */}
      <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
          },
        ]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => handleNavigate("Capacitacion")} style={styles.item}>
            <Text style={styles.itemText}>Capacitaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigate("Nineth")} style={styles.item}>
            <Text style={styles.itemText}>Reto MANU</Text>
          </TouchableOpacity>

 
          <TouchableOpacity onPress={() => handleNavigate("Routes")} style={styles.item}>
            <Text style={styles.itemText}>Rutas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleNavigate("Voluntariado")} style={styles.item}>
            <Text style={styles.itemText}>Voluntarios</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigate("Community")} style={styles.item}>
            <Text style={styles.itemText}>Donar</Text>
          </TouchableOpacity>



          {/* Mi Perfil ahora va a configuration.tsx */}
          <TouchableOpacity onPress={() => handleNavigate("Configuration")} style={styles.item}>
            <Text style={styles.itemText}>Mi Perfil</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </React.Fragment>
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
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  inner: {
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: "flex-start",
  },
  item: {
    paddingVertical: 16,
  },
  itemText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "right",
    fontFamily: 'TenorSans',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#fff',
  },
  itemSpacing: {
    height: 8,
  },
  ovalButtonWrapper: {
    alignItems: "flex-end",
  },
  ovalButton: {
    backgroundColor: "#fff",
    borderWidth: 0.6,
    borderColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ovalButtonText: {
    color: "#7a7a7a",
    fontWeight: "700",
    textAlign: "center",
    fontFamily: 'TenorSans',
  },
});
