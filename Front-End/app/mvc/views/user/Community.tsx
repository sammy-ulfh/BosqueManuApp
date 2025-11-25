import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "../components/MainButton";

const { width } = Dimensions.get("window");

export default function Community({ navigation } : any) {
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
          source={require("../../../assets/images/Donaciones.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Card inferior ― estilo Capacitaciones */}
      <View style={styles.card}>
        <Text style={styles.title}>Únete a la comunidad</Text>

        <Text style={styles.subtitle}>
          Tu donación fortalece nuestros programas de primeros auxilios,
          rescate y conservación en el Bosque La Primavera.
          Cada aporte cuenta para seguir cuidando vidas y naturaleza.
        </Text>

        <MainButton
          text="QUIERO DONAR"
          onPress={() => navigation.navigate("Donar")}
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

  /* Imagen arriba */
  imageContainer: {
    width: width,
    height: 590,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  /* Card inferior */
  card: {
    backgroundColor: "#9C9510",
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
    fontSize: 17,
    fontFamily: "TenorSans",
    color: "#f3f3f3",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    width: "90%",
  },

  button: {
    backgroundColor: "#716d1994",
    borderRadius: 25,
    width: "80%",
    height: 55,
    justifyContent: "center",
  },

  buttonText: {
    color: "black",
    fontFamily: "TenorSans",
    fontSize: 18,
  },
});
