import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/mvc/views/components/MainButton";

const { width } = Dimensions.get("window");

export default function Voluntariado({ navigation }: any) {
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
          source={require("@/assets/images/Voluntarios.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Card inferior estilo uniforme */}
      <View style={styles.card}>
        <Text style={styles.title}>Súmate como voluntario</Text>

        <Text style={styles.subtitle}>
          Tu apoyo como voluntario paramédico es vital para mantener la seguridad
          y bienestar dentro del Bosque La Primavera.
        </Text>

        <MainButton
          text="QUIERO SER VOLUNTARIO"
          onPress={() => navigation.navigate("Voluntario")}
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
    height: 560,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  card: {
    backgroundColor: "#68777aff",
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
    fontSize: 28,
    fontFamily: "Gloock",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 22,
    fontFamily: "TenorSans",
    color: "#eaeaea",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    width: "90%",
  },

  button: {
    backgroundColor: "#354a64ff",
    borderRadius: 20,
    width: "80%",
    height: 60,
    justifyContent: "center",
    top: 30,
  },

  buttonText: {
    color: "#100f0fff",
    fontFamily: "TenorSans",
    fontSize: 18,
  },
});
