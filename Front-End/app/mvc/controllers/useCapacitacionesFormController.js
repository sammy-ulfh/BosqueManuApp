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
    try {
      if (!validatePhone()) {
        Alert.alert("Error", "El número telefónico debe tener 10 dígitos.");
        return;
      }

      if (!selectedCourse) {
        Alert.alert("Error", "Selecciona una fecha.");
        return;
      }

      if (!userId) {
        Sentry.captureMessage("UserId no disponible en capacitaciones", {
          level: "warning",
          tags: { module: "capacitaciones" },
        });
        Alert.alert("Error", "Usuario no identificado.");
        return;
      }

      const { success, error } =
        await ClientCapacitacionesModel.registerUserToCourse({
          userId,
          courseId: selectedCourse.id,
          userName,
          phone,
        });

      if (!success) {
        Sentry.captureException(error, {
          tags: { module: "capacitaciones", action: "registerUserToCourse" },
          extra: { userId, courseId: selectedCourse.id },
        });

        Alert.alert("Error al registrarse", error);
        return;
      }

      Alert.alert("¡Registro exitoso!", "Tu inscripción ha sido registrada", [
        { text: "OK", onPress: () => navigation.navigate("ClientHome") },
      ]);

    } catch (err) {
      Sentry.captureException(err, {
        tags: { module: "capacitaciones", type: "unexpected_error" },
      });
      Alert.alert("Error inesperado", String(err));
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
