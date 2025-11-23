import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/mvc/views/components/MainButton";
import { Login } from "@/mvc/views/user/Login";
import { Input } from "@/mvc/views/components/Input";

import { setUser } from "@/mvc/models/user/setUser.js";


export default function Singup({ navigation }) {
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

  const cardInfo = {
    name: [name, setName, "Nombre", false],
    lastName: [lastName, setLastName, "Apellido", false],
    email: [email, setEmail, "Correo electronico", false],
    password: [password, setPassword, "Contrasena", true],
    confirmedPassword: [confirmedPassword, setConfirmedPassword, "Confirmar contrasena", true],
    number: [number, setNumber, "Telefono", false],
    groupName: [groupName, setGroupName, "Nombre de grupo (Opcional)", false],
    bloodType: [bloodType, setBloodType, "Grupo sanguineo", false],
    allergies: [allergies, setAllergies, "Alergias", false],
    medicine: [medicine, setMedicine, "Medicamentos", false],
    emergencyContact: [emergencyContact, setEmergencyContact, "Contacto de emergencia", false]
  }


  const insertUser = async () => {
    // Validación mínima
    if (password !== confirmedPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
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

      if (error) throw error;

      alert("¡Registro exitoso!");
      navigation.navigate("Login");
    } catch (err) {
      alert("Error al registrar usuario: " + err.message);
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
              height: "16%",
              justifyContent: "flex-end",
              alignItems: "center",
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

        <ScrollView
          style={{
            width: "80%",
            height: "70%",
            backgroundColor: "rgba(38, 36, 36, 0.7)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          {
            Object.entries(cardInfo).map(([key, value]) => {
              const fieldValue = value[0];
              const setField = value[1];
              const label = value[2];
              const sec = value[3];

              return (
                <View style={{ width: "95%", height: "20%", justifyContent: "flex-start", alignItems: "center", marginTop: "1%" }}>
                  <Text style={{
                    height: "20%",
                    width: "100%",
                    color: "white",
                    paddingLeft: "8%",
                    padingTop: "3%",
                    marginBottom: "3%",
                  }}>{label}</Text>
                  <Input
                    color="black"
                    key={key}
                    placeholder={label}
                    value={fieldValue}
                    secure={sec}
                    onChangeText={(text) => setField(text)}
                    style={{
                      width: "95%",
                      minHeight: "10%",
                      height: "50%",
                      paddingLeft: 0,
                      backgroundColor: '#D9D9D9',
                      color: "black",
                      borderWidth: 0,
                      paddingLeft: "5%",
                    }}
                  />
                </View>
              );
            })
          }

          <View
            style={{
              marginTop: "3%",
              width: "90%",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: "3%",
              marginBottom: "5%"
            }}
          >
            <Text style={[styles.whiteText, { fontSize: 19 }]}>
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
            onPress={() => insertUser({
              name,
              lastName,
              email,
              password,
              number,
              groupName,
              bloodType,
              allergies,
              medicines: medicine,
              emergencyContact
            })}
            style={{
              width: "80%",
              minHeight: "10%",
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
    ...StyleSheet.absoluteFillObject, // llena toda la superficie
    backgroundColor: "rgba(0, 0, 0, 0.5)", // negro con opacidad 50%
  },
});
