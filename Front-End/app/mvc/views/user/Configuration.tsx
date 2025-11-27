import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import { MainButton } from "@/mvc/views/components/MainButton";
import { supabase } from "@/mvc/models/supabase/supabaseClient";

export default function Configuration({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("");

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
    obtenerNombreUsuario();
  }, []);

  async function obtenerNombreUsuario() {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const user = sessionData?.user;

      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("nombre")
        .eq("auth_id", user.id)
        .single();

      if (error) {
        console.log("Error:", error);
        return;
      }

      setUserName(data?.nombre || "Usuario");
    } catch (err) {
      console.error(err);
    }
  }

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
          {/* Logo */}
          <View style={[styles.totalWidth, { height: "20%" }]}>
            <Image
              source={require("../../../assets/main/logo.png")}
              style={[styles.imagen, { height: "100%" }]}
            />
          </View>

          {/* Texto Bienvenida */}
          <View
            style={[
              styles.totalWidth,
              {
                height: "40%",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.totalWidth,
                {
                  height: "30%",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.whiteText,
                  {
                    fontFamily: "Gloock",
                    fontSize: 40,
                    textAlign: "center",   // <-- CENTRAR TEXTO
                  },
                ]}
              >
                Bienvenido, {userName}
              </Text>
            </View>

            {/* Botones */}
            <View
              style={[
                styles.totalWidth,
                {
                  height: "60%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10%",
                },
              ]}
            >
              <MainButton
                text="Contraseñas y seguridad"
                onPress={() => navigation.navigate("Security")}
                style={{
                  height: "35%",
                  width: "70%",
                  borderRadius: 0,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  backgroundColor: "rgba(72, 65, 50, 0.8)",
                }}
              />

              <MainButton
                text="Datos personales"
                onPress={() => navigation.navigate("PersonalData")}
                style={{
                  height: "35%",
                  width: "70%",
                  borderRadius: 0,
                  backgroundColor: "rgba(72, 65, 50, 0.8)",
                }}
              />

              <MainButton
                text="Tu información y permisos"
                onPress={() => navigation.navigate("Permissions")}
                style={{
                  height: "35%",
                  width: "70%",
                  borderRadius: 0,
                  backgroundColor: "rgba(72, 65, 50, 0.8)",
                }}
              />

              <MainButton
                text="Ayuda"
                onPress={() => navigation.navigate("Help")}
                style={{
                  height: "35%",
                  width: "70%",
                  borderRadius: 0,
                  borderBottomLeftRadius: 30,
                  borderBottomRightRadius: 30,
                  backgroundColor: "rgba(72, 65, 50, 0.8)",
                }}
              />
            </View>
          </View>

          {/* Cerrar Sesión */}
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
              style={{
                height: "30%",
                width: "70%",
                marginTop: "8%",
                backgroundColor: "rgba(152, 33, 33, 0.7)",
              }}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imagen: {
    resizeMode: "contain",
  },
});
