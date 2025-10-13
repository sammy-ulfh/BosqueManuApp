import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/components/MainButton";

export default function Tenth({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

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
            {
              width: "80%",
              height: "16%",
              justifyContent: "flex-end",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              styles.whiteText,
              {
                fontSize: 40,
                textAlign: "center",
              },
            ]}
          >
            Formulario de registro
          </Text>
        </View>
        {/* < = View para el texto principal */}
        {/* View para el formulario */}
        <View
          style={{
            width: "80%",
            height: "70%",
            backgroundColor: "rgba(245, 73, 39, 1)",
          }}
        >
          <Text>HOLA, JOSE</Text>
        </View>
        {/* View para el boton */}
        <View
          style={[
            {
              width: "100%",
              height: "14%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <MainButton
            text="QUIENES SOMOS?"
            onPress={() => navigation.navigate("Eleventh"))}
            style={{
              width: "80%",
              minHeight: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
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
});
