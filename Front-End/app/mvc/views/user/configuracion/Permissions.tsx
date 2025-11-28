import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Switch,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import * as Location from "expo-location";

export default function Permissions() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Switch States
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dataEnabled, setDataEnabled] = useState(false);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  // Load Fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });

    setIsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  // -----------------------
  // LOCATION PERMISSION LOGIC
  // -----------------------

  const requestLocation = async () => {
    Alert.alert(
      "Permiso de ubicación",
      "¿Permites que la aplicación acceda a tu ubicación?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
              setLocationEnabled(true);
            } else {
              setLocationEnabled(false);
              Alert.alert(
                "Permiso denegado",
                "No se concedió el acceso a la ubicación."
              );
            }
          },
        },
      ]
    );
  };

  const handleLocationToggle = () => {
    if (!locationEnabled) {
      requestLocation();
    } else {
      setLocationEnabled(false);
    }
  };

  if (!isLoaded) {
    return (
      <Text style={{ marginTop: 80, textAlign: "center", color: "#FFF" }}>
        Cargando...
      </Text>
    );
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/main/background2.png")}
    >
      <View style={[styles.container, styles.overlay]}>
        <Text style={styles.title}>Tu información y permisos</Text>

        {/* OPTION BOXES */}

        {/* Location */}
        <View style={styles.box}>
          <Text style={styles.item}>Permiso de ubicación</Text>
          <Switch
            value={locationEnabled}
            onValueChange={handleLocationToggle}
            trackColor={{ false: "#666", true: "#4cd964" }}
            thumbColor="#fff"
          />
        </View>

        {/* Notifications */}
        <View style={styles.box}>
          <Text style={styles.item}>Permiso de notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#666", true: "#4cd964" }}
            thumbColor="#fff"
          />
        </View>

        {/* App Data */}
        <View style={styles.box}>
          <Text style={styles.item}>Datos recopilados por la app</Text>
          <Switch
            value={dataEnabled}
            onValueChange={setDataEnabled}
            trackColor={{ false: "#666", true: "#4cd964" }}
            thumbColor="#fff"
          />
        </View>

        {/* Privacy */}
        <View style={styles.box}>
          <Text style={styles.item}>Control de privacidad</Text>
          <Switch
            value={privacyEnabled}
            onValueChange={setPrivacyEnabled}
            trackColor={{ false: "#666", true: "#4cd964" }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  title: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "Gloock",
    marginBottom: 40,
    textAlign: "center",
    width: "85%",
  },

  box: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 15,
    paddingHorizontal: 20,

    backgroundColor: "rgba(255, 255, 255, 0.12)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)", 
    borderRadius: 20,

    marginVertical: 12,
  },

  item: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "TenorSans",
  },
});
