import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/mvc/views/components/MainButton";

export default function Voluntariado({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

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
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/main/background2.png")}
        style={styles.background}
        resizeMode="cover"
      >

        <View style={[styles.bottomBox, { justifyContent: "flex-start", alignItems: "center", paddingTop: "15%" }]}>
          <Text style={{ color: "white", fontFamily: "Glook", fontSize: 36, textAlign: "center" }}>Súmate como voluntario</Text>
          <Text style={{ color: "white", fontFamily: "Glook", fontSize: 20, marginTop: "5%", textAlign: "center", width: "90%" }}>
            Tu apoyo como voluntario paramédico es vital para mantener la seguridad y bienestar dentro del Bosque La Primavera.
          </Text>
          <MainButton
            text="QUIERO SER VOLUNTARIADO"
            onPress={() => navigation.navigate("Voluntario")}
            style={{ height: "30%", marginTop: "8%", backgroundColor: "#FDF9F9" }}
            color="black"
          />
        </View>
      </ImageBackground>
    </View>
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
  contentContainer: {
    flex: 1,
  },
  bottomBox: {
    height: "45%",
    width: '100%',
    backgroundColor: '#514C34',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
  },
});

