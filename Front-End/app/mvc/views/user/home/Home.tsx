import React, { useState } from "react";
import * as Font from "expo-font";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import SOSModal from "@/components/SOSModal";
import CustomDrawer from "@/components/CustomDrawer";

export default function Home({ navigation }: any) {
  const [sosVisible, setSosVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setFontsLoaded(true);
  };

  React.useEffect(() => {
    loadFonts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* CONTENIDO SCROLLEABLE */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO COMPLETO */}
        <ImageBackground
          source={require("@/assets/images/bosquehome.png")}
          style={styles.hero}
          imageStyle={{ resizeMode: "cover" }}
        >
          {/* Menú hamburguesa (abre CustomDrawer) */}
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            style={styles.menuButton}
            accessibilityLabel="Abrir menú"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          {/* Texto y botón */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>MÁS BOSQUE{"\n"}MANU</Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate("Routes")}
            >
              <Text style={styles.startButtonText}>Iniciar Ruta →</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* SECCIÓN 1 */}
        <Text style={styles.sectionHeader}>CONOCE MÁS SOBRE NOSOTROS</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Nineth")}
          style={styles.cardWrapper}
        >
          <Image
            source={require("@/assets/images/montañashome.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardButtonContainer}>
            <Text style={styles.cardButton}>Click aquí →</Text>
          </View>
        </TouchableOpacity>

        {/* SECCIÓN 2 */}
        <Text style={styles.sectionHeader}>QUIERO DONAR</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Donar")}
          style={styles.cardWrapper}
        >
          <Image
            source={require("@/assets/images/voluntarioshome.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardButtonContainer}>
            <Text style={styles.cardButton}>Click aquí →</Text>
          </View>
        </TouchableOpacity>

        {/* ESPACIO PARA QUE EL SCROLL NO CHOQUE CON LA BARRA SOS */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- BARRA SOS FIJA --- */}
      <View style={styles.sosBar}>
        <View style={styles.sosLine} />
        <TouchableOpacity onPress={() => setSosVisible(true)} accessibilityLabel="Abrir SOS">
          <Image
            source={require("@/assets/images/sos.png")}
            style={styles.sosImage}
          />
        </TouchableOpacity>
      </View>

      <SOSModal
        visible={sosVisible}
        onClose={() => setSosVisible(false)}
        imageSource={require("@/assets/images/SOSboton.png")}
      />

      {/* Custom drawer overlay */}
      <CustomDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* HERO */
  hero: {
    width: "100%",
    height: 370,
    justifyContent: "flex-start",
  },

  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },

  menuIcon: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "TenorSans",
  },

  heroContent: {
    marginTop: 140,
    marginLeft: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 55,
    fontWeight: "800",
    fontFamily: "Gloock",
  },

  startButton: {
    backgroundColor: "#5d5f39c5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ffffff",
  },

  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "TenorSans",
  },

  /* TITULOS */
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginLeft: 12,
    marginBottom: 8,
    color: "#222",
    fontFamily: "TenorSans",
  },

  /* CARDS */
  cardWrapper: {
    width: "92%",
    marginLeft: "4%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  cardImage: {
    width: "100%",
    height: 190,
    borderRadius: 16,
  },

  cardButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  cardButton: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    fontFamily: "TenorSans",
  },

  /* BARRA SOS FIJA */
  sosBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 5,
    zIndex: 200,
    elevation: 20,
  },

  /* Línea negra delgada arriba */
  sosLine: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 1,
    backgroundColor: "#000",
  },

  /* Imagen del botón SOS */
  sosImage: {
    width: 130,
    height: 55,
    resizeMode: "contain",
  },
});
