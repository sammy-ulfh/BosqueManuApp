import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import * as Font from "expo-font";
import React, { useState } from "react";
import { MainButton } from "@/components/MainButton";
import { Input } from "@/components/Input";
import { setUser } from "../../../scripts/setUser.js";

export default function Singup({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);

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
    email: [email, setEmail, "Correo electrónico", false],
    password: [password, setPassword, "Contraseña", true],
    confirmedPassword: [confirmedPassword, setConfirmedPassword, "Confirmar contraseña", true],
    number: [number, setNumber, "Teléfono", false],
  };
  const formFields = Object.keys(cardInfo).map((key) => {
    const data = cardInfo[key];
    return {
      id: key,
      value: data[0],
      setValue: data[1],
      label: data[2],
      secure: data[3]
    };
  });

  const insertUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
       Alert.alert("Campos vacíos", "Por favor revisa los campos obligatorios.");
       return;
    }
    if (password !== confirmedPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    
    try {
      const { data, error } = await setUser({
        nombre: name, apellido: lastName, email, password,
        number, group_name: groupName, blood: bloodType,
        allergies, medicines: medicine, contact: emergencyContact
      });

      if (error) throw error;
      Alert.alert("¡Registro exitoso!", "Inicia sesión ahora.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
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

  const renderInputItem = ({ item }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{item.label}</Text>
      <Input
        color="black"
        placeholder={item.label}
        value={item.value}
        secure={item.secure}
        onChangeText={item.setValue}
        style={styles.inputStyle}
      />
    </View>
  );

  if (!isLoaded) return null;

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../../assets/main/background2.png")}
    >
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContainer}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Crea tu cuenta</Text>
          </View>

          <View style={styles.cardContainer}>
            
            <FlatList
              data={formFields}
              renderItem={renderInputItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingVertical: 20 }}
            />
          </View>

          <View style={styles.footerContainer}>
            <MainButton
              text="REGISTRAR"
              onPress={insertUser}
              style={styles.mainButton}
            />
          </View>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  
  // Header
  headerContainer: {
    height: "10%",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 40,
    fontFamily: "Gloock",
    textAlign: "center",
  },

  cardContainer: {
    width: "85%",
    height: "70%",
    backgroundColor: "rgba(38, 36, 36, 0.8)",
    borderRadius: 20,
    overflow: "hidden", 
    marginBottom: 10,
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    width: "90%",
    color: "white",
    marginBottom: 5,
    paddingLeft: 5,
    fontFamily: "TenorSans",
  },
  inputStyle: {
    width: "90%",
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 0,
    color: "black"
  },

  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10
  },
  whiteText: {
    color: "white",
    fontSize: 16,
    fontFamily: "TenorSans",
  },
  linkText: {
    color: "white",
    fontSize: 16,
    fontFamily: "TenorSans",
    textDecorationLine: "underline",
    fontWeight: "bold"
  },
  footerContainer: {
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
