import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";

export default function Help() {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
    });
    setIsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!isLoaded) {
    return (
      <Text style={{ marginTop: 80, textAlign: "center", color: "#FFF" }}>
        Cargando...
      </Text>
    );
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/main/background2.png")}
    >
      <View style={[styles.container, styles.overlay]}>

        <Text style={styles.title}>Ayuda y Guía del Usuario</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "90%" }}
        >

          {/* Card 1 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inicio de la Aplicación</Text>
            <Text style={styles.item}>• Toca el ícono de MBM para abrir la app.</Text>
            <Text style={styles.item}>• Verás una pantalla con el logo durante 3 segundos.</Text>
            <Text style={styles.item}>• Desde la página de Inicio puedes iniciar sesión, registrarte o ver información general.</Text>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cuenta de Usuario</Text>
            <Text style={styles.subtitle}>Iniciar Sesión</Text>
            <Text style={styles.item}>• Ingresa tu correo y contraseña.</Text>

            <Text style={styles.subtitle}>Registrarse</Text>
            <Text style={styles.item}>• Llena tu nombre, correo, contraseña y teléfono.</Text>
            <Text style={styles.item}>• Puedes agregar información médica opcional.</Text>
          </View>

          {/* Card 3 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pantalla Principal</Text>
            <Text style={styles.item}>• Ver información de MBM.</Text>
            <Text style={styles.item}>• Iniciar rutas seguras.</Text>
            <Text style={styles.item}>• Hacerte voluntario.</Text>
            <Text style={styles.item}>• Donar.</Text>
            <Text style={styles.item}>• Ver tu perfil o capacitaciones.</Text>
            <Text style={styles.itemBold}>• Botón SOS al centro: envía alerta tras 5 segundos.</Text>
          </View>

          {/* Card 4 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rutas Seguras</Text>
            <Text style={styles.item}>• Mapa con rutas disponibles.</Text>
            <Text style={styles.item}>• Ubicación de botiquines.</Text>
            <Text style={styles.item}>• Avisos de zonas con poca señal.</Text>
            <Text style={styles.item}>• Descarga mapa PDF y primeros auxilios.</Text>
          </View>

          {/* Card 5 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Capacitaciones</Text>
            <Text style={styles.item}>• Consulta cursos disponibles.</Text>
            <Text style={styles.item}>• Regístrate eligiendo fecha y datos.</Text>
          </View>

          {/* Card 6 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Voluntariado</Text>
            <Text style={styles.item}>• Conoce el programa de voluntarios.</Text>
            <Text style={styles.item}>• Inscríbete con tus datos y fecha deseada.</Text>
          </View>

          {/* Card 7 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Donaciones</Text>
            <Text style={styles.item}>• Conoce el propósito de las donaciones.</Text>
            <Text style={styles.item}>• Realiza pagos seguros con Stripe.</Text>
          </View>

          {/* Card 8 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Perfil y Configuración</Text>
            <Text style={styles.item}>• Cambiar contraseña.</Text>
            <Text style={styles.item}>• Editar información personal.</Text>
            <Text style={styles.item}>• Ver permisos activos.</Text>
            <Text style={styles.item}>• Leer FAQs y contactar soporte.</Text>
          </View>

        </ScrollView>
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
  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "Gloock",
    marginBottom: 20,
    textAlign: "center",
    width: "90%",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Raleway",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Raleway",
    marginTop: 10,
  },
  item: {
    fontSize: 14.5,
    color: "#fff",
    fontFamily: "TenorSans",
    lineHeight: 21,
    marginTop: 6,
  },
  itemBold: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Raleway",
    marginTop: 8,
  },
});
