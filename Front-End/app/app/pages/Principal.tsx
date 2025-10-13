import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";

/* Components */
import { MainButton } from "@/components/MainButton";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("../../assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("../../assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setFontsLoaded(true);
  };

  React.useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/main/background2.png")}
      style={styles.background}
    >
      <View
        style={[
          styles.totalWidth,
          styles.totalHeight,
          styles.container,
          styles.overlay,
        ]}
      >
        <View style={[{ width: "95%" }, styles.content]}>
          <View style={[styles.totalWidth, styles.right, { height: "20%" }]}>
            <View style={[{ width: "80%", height: "100%" }]}>
              <Text
                style={[
                  styles.totalWidth,
                  styles.totalHeight,
                  styles.whiteText,
                ]}
              >
                Donar a Más Bosque Manu, es donar para salvar una vida
              </Text>
            </View>
          </View>
          <View style={[styles.totalWidth, { height: "60%" }]}>
            <View
              style={[
                {
                  width: "100%",
                  height: "60%",
                  padding: "5%",
                  paddingTop: "0%",
                },
              ]}
            >
              <Text style={[styles.whiteText, { fontSize: 42, width: "100%" }]}>
                MÁS BOSQUE
              </Text>
              <Text
                style={[
                  styles.whiteText,
                  {
                    fontSize: 76,
                    width: "100%",
                    alignContent: "flex-start",
                    marginTop: "-3%",
                    marginLeft: "-1%",
                  },
                ]}
              >
                MANU
              </Text>
            </View>
            <View
              style={[
                {
                  width: "100%",
                  height: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <MainButton
                text="INICIAR SESION"
                onPress={() => navigation.navigate("Login")}
              />
            </View>
          </View>
          <View
            style={[
              {
                height: "20%",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                padding: "5%",
                paddingTop: "1%",
              },
              styles.totalWidth,
            ]}
          >
            <Text style={[styles.whiteText, { fontSize: 19 }]}>
              ¿Aún no tienes una cuenta?
            </Text>
            <TouchableOpacity
              style={[{ paddingLeft: "6%" }]}
              onPress={() => navigation.navigate("Singup")}
            >
              <Text
                style={[
                  styles.whiteText,
                  styles.link,
                  { fontSize: 18, color: "white" },
                ]}
              >
                Regístrate ahora
              </Text>
            </TouchableOpacity>
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
  content: {
    height: "50%",
  },
  whiteText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "TenorSans",
  },
  right: {
    alignItems: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // llena toda la superficie
    backgroundColor: "rgba(0, 0, 0, 0.5)", // negro con opacidad 50%
  },
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(166, 166, 166, 0.2)",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
