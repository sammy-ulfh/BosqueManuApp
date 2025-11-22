import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { supabase } from "../../models/supabase/supabaseClient.js";

/* Components */
import { Input } from "@/mvc/views/components/Input.js";
import { MainButton } from "@/mvc/views/components/MainButton.js";
import Singup from "./Singup.js";
import { loginUser } from "../../../scripts/auth.js";

export default function Login({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mailInput, setMailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const { data, error } = await loginUser(mailInput, passwordInput);

    if (error) {
      console.log("Error de login:", error.message);
      setErrorMessage(error.message);
      Alert.alert("Error de login", error.message);
      return;
    }

    if (!data?.user) {
      setErrorMessage("Usuario no encontrado.");
      Alert.alert("Error de login", "Usuario no encontrado.");
      return;
    }

    console.log("Usuario logueado:", data.user);
    setSuccessMessage(`Bienvenido ${data.user.email}`);
    Alert.alert("Éxito", `Bienvenido ${data.user.email}`);
    navigation.replace("ClientHome");
  };

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
          {/* Logo */}
          <View style={[styles.totalWidth, { height: "20%" }]}>
            <Image
              source={require("../../../assets/main/logo.png")}
              style={[styles.imagen, { height: "100%" }]}
            />
          </View>

          {/* Título y campos */}
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
                Bienvenido
              </Text>
            </View>

            <View
              style={[
                styles.totalWidth,
                {
                  height: "60%",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Input
                placeholder="Correo electrónico"
                value={mailInput}
                color="white"
                onChangeText={setMailInput}
                style={{ height: "40%" }}
                testID="email-input"
              />
              <Input
                placeholder="Contraseña"
                color="white"
                secure={true}
                value={passwordInput}
                onChangeText={setPasswordInput}
                style={{ marginTop: "5%", height: "40%" }}
                testID="password-input"
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
              text="INICIAR SESION"
              onPress={handleLogin}
              style={{ height: "30%" }}
              testID="login-button"
            />

            {/* Mensajes visibles para Detox */}
            {errorMessage !== "" && (
              <Text
                testID="login-error"
                style={{ color: "red", marginTop: 10, fontSize: 16 }}
              >
                {errorMessage}
              </Text>
            )}
            {successMessage !== "" && (
              <Text
                testID="login-success"
                style={{ color: "green", marginTop: 10, fontSize: 16 }}
              >
                {successMessage}
              </Text>
            )}

            <View
              style={{
                marginTop: "3%",
                width: "80%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={[styles.whiteText, { fontSize: 19 }]}>
                ¿Aún no tienes una cuenta?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Singup")}
                testID="go-to-signup"
              >
                <Text
                  style={[
                    styles.whiteText,
                    styles.link,
                    {
                      fontSize: 18,
                      color: "white",
                    },
                  ]}
                >
                  Regístrate ahora
                </Text>
              </TouchableOpacity>
            </View>
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
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

