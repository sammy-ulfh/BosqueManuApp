import { Image } from "expo-image";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { WebView } from 'react-native-webview';

/* Components */
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import Singup from "../Singup";

export default function Routes({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const latitude = -12.0464;
  const longitude = -77.0428;
  const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;

  const Info = {
    name: "Jose"
  }

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("../../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("../../../assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("../../../assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setIsLoaded(true);
  };

  React.useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../../assets/main/background2.png")}
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
            {
              height: "80%",
              marginTop: "2%",
              justifyContent: "center",
              alignItems: "center"
            },
          ]}
        >
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

          {/* MAP VIEW */}
          <View style={styles.mapContainer}>
            <Image
              source={require("../../../assets/images/mapa.jpg")}
              style={styles.mapImage}
              contentFit="cover"
            />
          </View>

          {/* Buttons */}
          <View style={{ width: "80%", height: "40%", justifyContent: "flex-start", alignItems: "center", marginTop: "3%" }}>
            <MainButton
              text="Rutas faciles"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "20%", width: "80%", marginBottom: "5%" }}
            />
            <MainButton
              text="Rutas intermedias"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "20%", width: "80%", marginBottom: "5%" }}
            />
            <MainButton
              text="Rutas dificiles"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "20%", width: "80%", marginBottom: "5%" }}
            />
          </View>
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
  whiteText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "TenorSans",
  },
  totalWidth: {
    width: "100%",
  },
  totalHeight: {
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // llena toda la superficie
    backgroundColor: "rgba(0, 0, 0, 0.5)", // negro con opacidad 50%
  },
  imagen: {
    resizeMode: "contain", // 'contain', 'stretch', etc.
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
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
  mapImage: {
    width: "100%",
    height: "100%",
  },
  map: { flex: 1 },
});
