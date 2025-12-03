import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Font from "expo-font";
import { ClientCapacitacionesModel } from '../models/ClientCapacitacionesModel';

export function useCapacitacionesFormController(navigation) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null); // ID de la tabla users

  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Font.loadAsync({
            TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
            Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
        });
      } catch (e) { console.warn("Fonts error", e); }

      const userData = await ClientCapacitacionesModel.getPublicUserId();
      if (userData) {
        setUserId(userData.publicId);
        const firstName = userData.authName.split(" ")[0];
        setUserName(firstName);
      }

      await fetchCourses();

      setIsLoaded(true);
    };
    init();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    const { data } = await ClientCapacitacionesModel.getAvailableCourses();
    setAvailableCourses(data);
    setLoadingCourses(false);
  };

  const validatePhone = () => /^\d{10}$/.test(phone);

  const handleSubmit = async () => {
    if (!validatePhone()) {
      Alert.alert("Error", "El número telefónico debe tener 10 dígitos.");
      return;
    }
    if (!selectedCourse) {
      Alert.alert("Error", "Por favor selecciona una fecha de capacitación.");
      return;
    }
    if (!userName.trim()) {
        Alert.alert("Error", "Por favor ingresa tu nombre.");
        return;
    }
    if (!userId) {
        Alert.alert("Error", "No se encontró tu usuario. Intenta reiniciar sesión.");
        return;
    }

    const { success, error } = await ClientCapacitacionesModel.registerUserToCourse({
      userId,
      courseId: selectedCourse.id,
      userName,
      phone
    });

    if (success) {
      Alert.alert("¡Inscripción exitosa!", "Te has registrado correctamente.", [
        { text: "OK", onPress: () => navigation.navigate("ClientHome") }
      ]);
    } else {
      Alert.alert("Error en inscripción", error);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-MX', { 
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' 
    });
  };

  return {
    isLoaded,
    loadingCourses,
    userName, setUserName,
    phone, setPhone,
    availableCourses,
    selectedCourse, setSelectedCourse,
    showModal, setShowModal,
    handleSubmit,
    formatDate
  };
}
