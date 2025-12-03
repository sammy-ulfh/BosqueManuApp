import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Font from "expo-font";
import { ClientVoluntariosModel } from '../models/ClientVoluntariosModel';

export function useVoluntariosFormController(navigation) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null);

  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Font.loadAsync({
            TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
            Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
        });
      } catch (e) { console.warn("Fonts error", e); }

      const userData = await ClientVoluntariosModel.getPublicUserId();
      if (userData) {
        setUserId(userData.publicId);
        const firstName = userData.authName.split(" ")[0];
        setUserName(firstName);
      }

      await fetchEvents();

      setIsLoaded(true);
    };
    init();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data } = await ClientVoluntariosModel.getAvailableEvents();
    setAvailableEvents(data);
    setLoadingEvents(false);
  };

  const validatePhone = () => /^\d{10}$/.test(phone);

  const handleSubmit = async () => {
    if (!validatePhone()) {
      Alert.alert("Error", "El número telefónico debe tener 10 dígitos.");
      return;
    }
    if (!selectedEvent) {
      Alert.alert("Error", "Por favor selecciona una fecha disponible.");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "Usuario no identificado. Reinicia la sesión.");
      return;
    }

    const { success, error } = await ClientVoluntariosModel.registerUserToEvent({
      userId,
      eventId: selectedEvent.id,
      userName,
      phone
    });

    if (success) {
      Alert.alert("¡Registro exitoso!", "Te has unido al voluntariado.", [
        { text: "OK", onPress: () => navigation.navigate("ClientHome") }
      ]);
    } else {
      Alert.alert("Error", error);
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
    loadingEvents,
    userName, setUserName,
    phone, setPhone,
    availableEvents,
    selectedEvent, setSelectedEvent,
    showModal, setShowModal,
    handleSubmit,
    formatDate
  };
}
