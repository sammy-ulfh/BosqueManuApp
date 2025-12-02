import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Alert } from "react-native";
import * as Sentry from "@sentry/react-native";
import { MainButton } from "@/mvc/views/components/MainButton";
import { Input } from "@/mvc/views/components/Input";

import { setUser } from "@/mvc/models/user/setUser.js";

export default function Singup({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [number, setNumber] = useState('');
  const [groupName, setGroupName] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicine, setMedicine] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  type CardField = {
    key: string;
    value: string;
    setter: (v: string) => void;
    label: string;
    secure?: boolean;
  };

  const cardInfo: CardField[] = [
    { key: "name", value: name, setter: setName, label: "Nombre" },
    { key: "lastName", value: lastName, setter: setLastName, label: "Apellido" },
    { key: "email", value: email, setter: setEmail, label: "Correo electronico" },
    { key: "password", value: password, setter: setPassword, label: "Contrasena", secure: true },
    { key: "confirmedPassword", value: confirmedPassword, setter: setConfirmedPassword, label: "Confirmar contrasena", secure: true },
    { key: "number", value: number, setter: setNumber, label: "Telefono" },
    { key: "groupName", value: groupName, setter: setGroupName, label: "Nombre de grupo (Opcional)" },
    { key: "bloodType", value: bloodType, setter: setBloodType, label: "Grupo sanguineo" },
    { key: "allergies", value: allergies, setter: setAllergies, label: "Alergias" },
    { key: "medicine", value: medicine, setter: setMedicine, label: "Medicamentos" },
    { key: "emergencyContact", value: emergencyContact, setter: setEmergencyContact, label: "Contacto de emergencia" },
  ];

  // added password validation function
  const validatePassword = (pwd: string) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const special = /[^A-Za-z0-9]/;

    return (
      minLength.test(pwd) &&
      upper.test(pwd) &&
      lower.test(pwd) &&
      number.test(pwd) &&
      special.test(pwd)
    );
  };
  // end added section

const insertUser = async () => {
  try {
    if (!validatePassword(password)) {
      Alert.alert("Contraseña inválida");
      return;
    }

    if (password !== confirmedPassword) {
      Alert.alert("Las contraseñas no coinciden");
      return;
    }

    const { data, error } = await setUser({
      nombre: name,
      apellido: lastName,
      email,
      password,
      number,
      group_name: groupName,
      blood: bloodType,
      allergies,
      medicines: medicine,
      contact: emergencyContact
    });

    if (error) {
      Sentry.captureException(error, {
        tags: { module: "auth", screen: "Signup" },
        extra: { email },
      });

      Alert.alert("Error al registrar usuario", (error as any)?.message ?? String(error));
      return;
    }

    alert("¡Registro exitoso!");
    navigation.navigate("Login");

  } catch (err) {
    Sentry.captureException(err, {
      tags: { module: "auth", screen: "Signup", type: "unexpected_error" },
    });
    Alert.alert("Error inesperado", (err as any)?.message ?? String(err));
  }
};


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
            {
              width: "80%",
              height: "15%",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 60,
            },
          ]}
        >
          <Text
            style={[
              styles.whiteText,
              {
                fontSize: 40,
                textAlign: "center",
              },
            ]}
          >
            Crea tu cuenta
          </Text>
        </View>

        <FlatList
          data={cardInfo}
          keyExtractor={(item) => item.key}
          style={{
            width: "80%",
            height: "70%",
            backgroundColor: "rgba(38, 36, 36, 0.7)",
            borderRadius: 20,
          }}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                width: "95%",
                height: 80,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "center",
                marginTop: "1%"
              }}
            >
              <Text
                style={{
                  height: 20,
                  width: "100%",
                  color: "white",
                  paddingLeft: "8%",
                  marginBottom: "2%",
                  textAlign: "left",
                }}
              >
                {item.label}
              </Text>

              <Input
                color="black"
                placeholder={item.label}
                value={item.value}
                secure={!!item.secure}
                onChangeText={(text) => item.setter(text)}
                style={{
                  width: "95%",
                  minHeight: 40,
                  height: 40,
                  backgroundColor: '#D9D9D9',
                  color: "black",
                  borderWidth: 0,
                  paddingLeft: "5%",
                }}
              />
            </View>
          )}
          ListFooterComponent={() => (
            <View
              style={{
                marginTop: "3%",
                width: "90%",
                justifyContent: "center",
                alignItems: "flex-start",
                alignSelf: "center",
                paddingLeft: "3%",
                marginBottom: "5%"
              }}
            >
              <Text style={[styles.whiteText, { fontSize: 17, textAlign: "left" }]}>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={[
                    styles.whiteText,
                    styles.link,
                    {
                      fontSize: 15,
                      color: "white",
                      textAlign: "left",
                    },
                  ]}
                >
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View
          style={[
            {
              width: "100%",
              height: "14%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <MainButton
            text="REGISTRARSE"
            onPress={insertUser}
            style={{
              width: "80%",
              height: 65,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
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
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
