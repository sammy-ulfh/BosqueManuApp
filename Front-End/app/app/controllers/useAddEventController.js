import { useState } from 'react';
import { Alert } from 'react-native';
import { EventsModel } from '../models/EventsModel';

export function useAddEventController(navigation) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = async () => {
    if (!description.trim() || !date.trim() || !limit.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa toda la información.");
      return;
    }
    if (isNaN(limit) || parseInt(limit) <= 0) {
      Alert.alert("Error", "El límite debe ser un número positivo.");
      return;
    }

    setLoading(true);

    const { success, error } = await EventsModel.createEvent({
      description,
      date,
      limit
    });

    setLoading(false);

    if (success) {
      Alert.alert("¡Éxito!", "Evento de voluntariado creado.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", "No se pudo crear el evento: " + error);
    }
  };

  return {
    description, setDescription,
    date, setDate,
    limit, setLimit,
    loading,
    handleSubmit
  };
}
