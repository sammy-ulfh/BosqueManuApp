import { Image } from "expo-image";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { supabase } from '../../../scripts/supabaseClient.js'

/* Components */
import { Input } from "@/components/Input";
import { MainButton } from "@/components/MainButton";
import Singup from "./Singup";
import { loginUser } from "../../../scripts/auth.js";

export default function Login({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mailInput, setMailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");



  const handleLogin = async () => {
    const { data, error } = await loginUser(mailInput, passwordInput);

    if (error) {
      console.log('Error de login:', error.message);
      Alert.alert('Error de login', error.message);
      return;
    }

    if (!data.user) {
      Alert.alert('Error de login', 'Usuario no encontrado.');
      return;
    }

    console.log('Usuario logueado:', data.user);
    Alert.alert('Éxito', `Bienvenido ${data.user.email}`);
    navigation.replace('Community');
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
              />
              <Input
                placeholder="Contraseña"
                color="white"
                secure={true}
                value={passwordInput}
                onChangeText={setPasswordInput}
                style={{ marginTop: "5%", height: "40%" }}
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
              onPress={() => handleLogin()}
              style={{ height: "30%" }}
            />

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
              <TouchableOpacity onPress={() => navigation.navigate('Singup')}>
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
