import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/mvc/views/components/MainButton";

const { width } = Dimensions.get("window");

export default function Capacitacion({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);

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

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>

      {/* Imagen superior */}
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/botiquin.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      {/* CARD inferior estilo JoinCommunityScreen */}
      <View style={styles.card}>
        <Text style={styles.title}>Únete a la comunidad</Text>

        <Text style={styles.subtitle}>
          Tu participación dentro de los cursos y talleres de primeros auxilios es
          fundamental dentro del Bosque La Primavera.
        </Text>

        <MainButton
          text="QUIERO CAPACITARME"
          onPress={() => navigation.navigate("Capacitarme")}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  imageContainer: {
    width: width,
    height: 590,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  card: {
    backgroundColor: "#4B4A33",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingVertical: 55,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 8,
  },

  title: {
    fontSize: 32,
    fontFamily: "Gloock",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 20,
    fontFamily: "TenorSans",
    color: "#ddd",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    width: "90%",
  },

  button: {
    backgroundColor: "#1B4D3E",
    borderRadius: 25,
    width: "80%",
    height: 60,
    justifyContent: "center",
  },

  buttonText: {
    color: "black",
    fontFamily: "TenorSans",
    fontSize: 18,
  },
});
