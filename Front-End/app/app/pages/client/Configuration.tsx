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

/* Components */
import { Input } from "@/components/Input";
import { MainButton } from "@/components/MainButton";
import Singup from "./Singup";

export default function Configuration({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mailInput, setMailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

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
              marginTop: "5%",
            },
          ]}
        >
          <View style={[styles.totalWidth, { height: "20%" }]}>
            <Image
              source={require("../../../assets/main/logo.png")}
              style={[styles.imagen, { height: "100%" }]}
            />
          </View>
          <View
            style={[
              styles.totalWidth,
              {
                height: "40%",
                justifyContent: "flex-start",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.totalWidth,
                {
                  height: "30%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.whiteText,
                  { fontFamily: "Gloock", fontSize: 40 },
                ]}
              >
                Bienvenido, {Info.name}
              </Text>
            </View>
            <View
              style={[
                styles.totalWidth,
                {
                  height: "60%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10%"
                },
              ]}
            >
            <MainButton
              text="Contraseñas y seguridad"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "35%", width: "70%" , borderRadius: 0, 
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    backgroundColor: "rgba(72, 65, 50, 0.8)"
               }}
            />
            <MainButton
              text="Datos personales"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "35%", borderRadius: 0, width: "70%", backgroundColor: "rgba(72, 65, 50, 0.8)" }}
            />
            <MainButton
              text="Tu información y permisos"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "35%", borderRadius: 0, backgroundColor: "rgba(72, 65, 50, 0.8)", width: "70%" }}
            />
            <MainButton
              text="Ayuda"
              onPress={() => navigation.navigate("Community")}
              style={{ height: "35%", borderRadius: 0,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    backgroundColor: "rgba(72, 65, 50, 0.8)", 
                    width: "70%"
               }}
            />
            </View>
          </View>
          <View
            style={[
              styles.totalWidth,
              {
                height: "40%",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "15%",
              },
            ]}
          >
            <MainButton
              text="CERRAR SESION"
              onPress={() => navigation.navigate("Home")}
              style={{ height: "30%", width: "70%" ,marginTop: "8%", backgroundColor: "rgba(152, 33, 33, 0.7)" }}
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
});