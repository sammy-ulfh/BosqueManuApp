import { useState } from 'react';
import { Alert } from 'react-native';
import { CoursesModel } from '../models/CoursesModel';

export function useAddCourseController(navigation) {
  const [loading, setLoading] = useState(false);
  
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(''); // Formato esperado: 2025-11-20 10:00
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

    const { success, error } = await CoursesModel.createCourse({
      description,
      date,
      limit
    });

    setLoading(false);

    if (success) {
      Alert.alert("¡Éxito!", "Capacitación creada correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", "No se pudo crear el curso: " + error);
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
