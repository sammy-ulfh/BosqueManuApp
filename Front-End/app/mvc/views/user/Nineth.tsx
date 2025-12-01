// Pagina con informacion sobre mas bosque MANU
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";

/* Botón principal */
import { MainButton } from "@/mvc/views/components/MainButton";

/* Importar imágenes */
const senor = require("@/assets/main/sobreNosotros/hombre.webp");
const logo = require("@/assets/main/logo.png");

const logos = [
  require("@/assets/main/sobreNosotros/logo1.webp"),
  require("@/assets/main/sobreNosotros/logo2.webp"),
  require("@/assets/main/sobreNosotros/logo3.webp"),
  require("@/assets/main/sobreNosotros/logo4.webp"),
  require("@/assets/main/sobreNosotros/logo5.webp"),
  require("@/assets/main/sobreNosotros/logo6.webp"),
  require("@/assets/main/sobreNosotros/logo7.webp"),
  require("@/assets/main/sobreNosotros/logo8.webp"),
  require("@/assets/main/sobreNosotros/logo9.webp"),
  require("@/assets/main/sobreNosotros/logo10.webp"),
];

const instagram = require("@/assets/main/sobreNosotros/instagram.png");
const facebook = require("@/assets/main/sobreNosotros/facebook.png");

export default function Nineth({ navigation }: any) {
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

  /* Función para abrir enlaces externos */
  const openExternal = (url: string) => {
    Alert.alert(
      "¿Deseas salir?",
      "Serás dirigido a un sitio externo.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, continuar", onPress: () => Linking.openURL(url) },
      ]
    );
  };

  const renderHeader = () => (
    <View style={{ width: '100%' }}>
      {/* IMAGEN "SEÑOR" */}
      <Image source={senor} style={styles.senorImage} resizeMode="cover" />

      {/* CUADRO AZUL VERDOSO ENCIMA */}
      <View style={styles.topCard}>
        <Text style={styles.cardTitle}>¿Quiénes Somos?</Text>

        <Text style={styles.cardText}>
          ¡Iremos al grano! Buscamos ayudar al bosque La Primavera, apoyar a
          los brigadistas y a todas aquellas personas dispuestas a mejorar la
          flora y fauna de nuestro amado bosque.
        </Text>

        <Text style={styles.cardText}>
          Nuestra meta es tener botiquines, señalamientos, capacitación para
          primeros auxilios. Es un proyecto que necesita ayuda para que sea
          gratuito y permanente.
        </Text>

        <Text style={styles.cardText}>
          Estaremos compartiendo nuestros logros en redes sociales.
        </Text>

        <Text style={styles.cardSubtitle}>Únete a la comunidad</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Capacitacion")}>
          <Image source={logo} style={styles.logoMain} resizeMode="contain" />
        </TouchableOpacity>

      </View>

      {/* SECCIÓN BEIGE */}
      <View style={styles.beigeSection}>
        <Text style={styles.beigeText}>Gracias a todos los que son parte</Text>

        {/* Logos en cuadrícula (convertidos a View para evitar FlatList anidado) */}
        <View style={styles.logosGrid}>
          {logos.map((item, idx) => (
            <Image key={idx} source={item} style={styles.logoItem} resizeMode="contain" />
          ))}
        </View>
      </View>

      {/* SEGUNDO CUADRO AZUL */}
      <View style={[styles.topCard, { marginTop: -20, marginBottom: -50 }]}>
        <Text style={styles.cardTitle}>
          Aprende más sobre los nuevos proyectos y logros
        </Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={() =>
              openExternal("https://www.instagram.com/masbosquemanu/")
            }
          >
            <Image source={instagram} style={styles.instaIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              openExternal("https://www.facebook.com/MasBosqueManu")
            }
          >
            <Image source={facebook} style={styles.facebookIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[] as any[]}
        keyExtractor={() => 'empty'}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        style={{ width: '100%' }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#144e52", 
  },

  scrollContainer: {
    paddingBottom: 50,
  },

  /* BOTÓN FLOTANTE */
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1000,
  },

  /* IMAGEN SEÑOR */
  senorImage: {
    width: "100%",
    height: 420,
  },

  /* CUADRO PRINCIPAL */
  topCard: {
    width: "100%",
    backgroundColor: "#144e52",
    marginTop: -40,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },

  cardTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  cardText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },

  cardSubtitle: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  logoMain: {
    width: 120,
    height: 120,
    marginTop: 10,
    marginBottom: 15,
  },

  /* SECCIÓN BEIGE */
  beigeSection: {
    backgroundColor: "#e6ddc6",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 60,
    marginTop: -25,
    alignItems: "center",
  },

  beigeText: {
    fontSize: 24,
    marginBottom: 34,
    marginTop: 34,
    fontWeight: "bold",
  },

  logosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },

  logoItem: {
    width: 90,
    height: 90,
    margin: 5,
  },

  /* REDES SOCIALES */
  socialContainer: {
    flexDirection: "row",
    gap: 30,
    marginTop: 30,
    marginBottom: 34,
  },

  instaIcon: {
    width: 68,
    height: 68,
    marginTop: -3,
  },

    facebookIcon: {
    width: 60,
    height: 60,
  },
});
