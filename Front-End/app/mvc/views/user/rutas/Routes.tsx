import { Image } from "expo-image";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";

/* Components */
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";

/* Importar imagenes */
const biciVerde = require("@/assets/main/biciVerde.png");
const biciAmarilla = require("@/assets/main/biciAmarilla.png");
const biciRoja = require("@/assets/main/biciRoja.png");

export default function Routes({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setIsLoaded(true);
  };

  React.useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/main/background2.png")}
    >
      <View
        style={[
          styles.totalWidth,
          styles.totalHeight,
          styles.container,
          styles.overlay,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View
          style={[
            styles.totalWidth,
            { height: "80%", marginTop: "2%", justifyContent: "center", alignItems: "center" },
          ]}
        >
          {/* BUSCADOR */}
          <View style={[styles.totalWidth, { height: "20%", justifyContent: "center", alignItems: "center" }]}>
            <View style={{ width: "80%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <Input
                placeholder="Buscar ruta"
                value={searchInput}
                onChangeText={setSearchInput}
                style={{ backgroundColor: "#FFFFFF", width: "80%", height: "40%", color: "black", marginTop: "-18%" }}
                color="#000000"
              />
            </View>
          </View>

          {/* MAPA */}
          <View style={styles.mapContainer}>
            <Image
              source={require("@/assets/images/mapa.jpg")}
              style={styles.mapImage}
              contentFit="cover"
            />
          </View>

          {/* BOTONES DE RUTAS */}
          <View style={{ width: "80%", height: "40%", justifyContent: "flex-start", alignItems: "center", marginTop: "3%" }}>
            <MainButton
              onPress={() => navigation.navigate("RoutesList", { difficulty: "easy" })}
              style={styles.routeButton}
            >
              <Image source={biciVerde} style={styles.bikeIcon} contentFit="contain" />
              <Text style={styles.buttonText}>Rutas fáciles</Text>
            </MainButton>

            <MainButton
              onPress={() => navigation.navigate("RoutesList", { difficulty: "medium" })}
              style={styles.routeButton}
            >
              <Image source={biciAmarilla} style={styles.bikeIcon} contentFit="contain" />
              <Text style={styles.buttonText}>Rutas intermedias</Text>
            </MainButton>

            <MainButton
              onPress={() => navigation.navigate("RoutesList", { difficulty: "hard" })}
              style={styles.routeButton}
            >
              <Image source={biciRoja} style={styles.bikeIcon} contentFit="contain" />
              <Text style={styles.buttonText}>Rutas difíciles</Text>
            </MainButton>
          </View>
        </View>

        {/* BARRA INFERIOR CON BOTONES ACTUALIZADOS */}
        <View style={styles.footer}>
          <MainButton
            onPress={() => navigation.navigate("Statistics")} 
            style={styles.footerButton}
          >
            <Text style={styles.footerText}>Estadísticas</Text>
          </MainButton>

          <MainButton
            onPress={() => navigation.navigate("ActiveRoute")} 
            style={styles.footerButton}
          >
            <Text style={styles.footerText}>Ruta</Text>
          </MainButton>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", width: "100%", height: "100%" },
  totalWidth: { width: "100%" },
  totalHeight: { height: "100%" },
  container: { flex: 1, justifyContent: "flex-end" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)" },

  mapContainer: {
    width: "80%",
    height: "40%",
    marginTop: "-10%",
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "rgba(93, 95, 57, 0.8)",
    overflow: "hidden",
  },
  mapImage: { width: "100%", height: "100%" },

  routeButton: {
    height: "20%",
    width: "80%",
    marginBottom: "5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 20,
  },
  bikeIcon: { width: 35, height: 35, marginRight: 15 },
  buttonText: { color: "#fff", fontSize: 18 },

  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50,150,50,0.8)",
  },
  footerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
