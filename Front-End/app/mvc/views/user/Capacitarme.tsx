import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator
  , ImageBackground
} from "react-native";
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";
import { getCurrentUser } from "@/mvc/models/auth/auth";
import { supabase } from "@/mvc/models/supabase/supabaseClient.js"; 

export default function CapacitacionesForm({ navigation }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
        Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
      });
    } catch (err) {
      console.warn('Failed to load fonts', err);
    }
  };

  const loadUserData = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      const fullName = user.user_metadata.full_name || "";
      const [first] = fullName.split(" ");
      setUserName(first || "");
    }
  };

  const fetchAvailableCourses = async () => {
    setLoadingCourses(true);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, date, description, registros, limite') 
        .gte('date', todayISO)
        .order('date', { ascending: true });

      if (error) throw error;

      const validCourses = (data || []).filter(course => {
        const occupied = course.registros || 0;
        const limit = course.limite || 0;
        return occupied < limit;
      });

      setAvailableCourses(validCourses);

    } catch (err) {
      console.error("Error cargando capacitaciones:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadFonts();
      await loadUserData();
      await fetchAvailableCourses();
      setIsLoaded(true);
    };
    init();
  }, []);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4C4635' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const validatePhone = () => /^\d{10}$/.test(phone);

  const handleSubmit = async () => {
    if (!validatePhone()) {
      alert("El número telefónico debe tener 10 dígitos.");
      return;
    }
    if (!selectedCourse) {
      alert("Por favor selecciona una fecha de capacitación.");
      return;
    }

    try {
      const { user: authUser } = await getCurrentUser();
      if (!authUser) throw new Error('Usuario no autenticado');
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (!userData) throw new Error("Usuario no encontrado en base de datos");

      await supabase
        .from('users')
        .update({ number: phone, nombre: userName })
        .eq('id', userData.id);

      const { error: joinError } = await supabase
        .from('user_course')
        .insert({
          user_id: userData.id,
          course_id: selectedCourse.id
        });

      if (joinError) throw joinError;

      const { error: rpcError } = await supabase.rpc('increment_course_registros', {
        course_id: selectedCourse.id
      });

      if (rpcError) {
         throw new Error("El cupo se llenó justo ahora. Intenta con otra fecha.");
      }

      alert("Inscripción exitosa");
      navigation.navigate("ClientHome");

    } catch (err: any) {
      if (err && err.code === '23505') {
        alert("Ya estás inscrito en esta capacitación.");
      } else {
        alert("Error: " + (err?.message || String(err)));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/Donaciones.png")}
      style={styles.container}
      imageStyle={{ resizeMode: 'cover' }}
    >


      <ScrollView contentContainerStyle={{ alignItems: "center", width: "100%" }}>
        <Text style={styles.title}>¡Yo quiero{"\n"}capacitarme!</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <Input
            placeholder="Nombre"
            value={userName}
            onChangeText={setUserName}
            style={[styles.input, styles.singleLineInput]}
            color="black"
          />

          <Text style={styles.label}>Teléfono</Text>
          <Input
            placeholder="10 dígitos"
            value={phone}
            keyboardType="number-pad"
            onChangeText={setPhone}
            style={[styles.input, styles.singleLineInput]}
            color="black"
          />

          <Text style={styles.label}>Fecha de capacitación</Text>

          <TouchableOpacity style={styles.dateRow} onPress={() => setShowModal(true)}>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>
                {selectedCourse ? formatDate(selectedCourse.date) : "Seleccionar fecha"}
              </Text>
            </View>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          <Text style={{color: 'white', fontSize: 11, marginBottom: 15, opacity: 0.8}}>
             * Solo se muestran capacitaciones con cupo disponible.
          </Text>

          <Modal
            visible={showModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Capacitaciones Disponibles</Text>
                
                {loadingCourses ? (
                  <ActivityIndicator size="large" color="#2E8B57" />
                ) : availableCourses.length === 0 ? (
                  <Text style={styles.noEventsText}>No hay capacitaciones con cupo.</Text>
                ) : (
                  <FlatList
                    data={availableCourses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                      const limit = item.limite || 0;
                      const occupied = item.registros || 0;
                      const available = limit - occupied;

                      return (
                        <TouchableOpacity 
                          style={styles.eventItem}
                          onPress={() => {
                            setSelectedCourse(item);
                            setShowModal(false);
                          }}
                        >
                          <Text style={styles.eventDateText}>{formatDate(item.date)}</Text>
                          <Text style={styles.eventSlotsText}>
                             {item.description}
                          </Text>
                          <Text style={{fontSize: 12, color: '#555', marginTop: 2}}>
                             Cupos disponibles: <Text style={{fontWeight:'bold', color: available < 5 ? 'orange' : 'green'}}>{available}</Text>
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
                
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Para más información acerca de{"\n"}
              las capacitaciones haz click <Text style={styles.link}>aquí</Text>
            </Text>
            <Text style={styles.terms}>Términos de uso | Política de privacidad</Text>
          </View>
        </View>

        <MainButton
          text="FINALIZAR"
          onPress={handleSubmit}
          style={styles.finishButton}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#4C4635", 
    paddingTop: 60 
  },
  backButton: { 
    position: "absolute",
    top: 25,
    left: 20, zIndex: 10 
  },
  backArrow: { 
    fontSize: 28,
    color: "white" 
  },
  title: { 
    fontFamily: "Gloock", 
    fontSize: 32, 
    color: "white", 
    textAlign: "center", 
    marginBottom: 10, 
    marginTop: 5 
  },
  card: { 
    width: "85%", 
    backgroundColor:"#1B4D3E", 
    padding: 18, 
    borderRadius: 20, 
    paddingBottom: 50, 
    minHeight: 500, 
    marginBottom: 30 
  },
  label: { 
    fontFamily: "TenorSans", 
    color: "white", 
    marginBottom: 5 
  },
  input: { 
    backgroundColor: "#D9D9D9", 
    height: 45, 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    marginBottom: 15 
  },
  singleLineInput: {
    height: 45,
    paddingVertical: 0,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 5,
  },
  dateRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#D9D9D9", 
    borderRadius: 20, 
    height: 45, 
    paddingHorizontal: 10, 
    marginBottom: 5 
  },
  dateInput: { 
    flex: 1 
  },
  dateText: { 
    fontFamily: "TenorSans", 
    color: "#333" 
  },
  calendarIcon: { 
    fontSize: 22 
  },
  infoBox: { 
    backgroundColor: "#D9D9D9", 
    padding: 12, 
    borderRadius: 15, 
    marginTop: 20 
  },
  infoText: { 
    fontFamily: "TenorSans", 
    fontSize: 14, 
    color: "#333", 
    marginBottom: 15 
  },
  link: { 
    color: "#1B4D3E", 
    textDecorationLine: "underline" 
  },
  terms: { 
    fontSize: 11, 
    textAlign: "center", 
    fontFamily: "TenorSans", 
    color: "#6B6B6B" 
  },
  finishButton: {
    width: "80%", 
    backgroundColor: "#791306d7", 
    height: 60, 
    borderRadius: 25, 
    marginTop: -10, 
    alignSelf: "center", 
    marginBottom: 30 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.6)" 
  },
  modalContent: { 
    width: "85%", 
    maxHeight: "70%", 
    backgroundColor: "white", 
    borderRadius: 20, 
    padding: 20, 
    elevation: 5 
  },
  modalTitle: { 
    fontSize: 22, 
    fontFamily: "Gloock", 
    color: "#2E8B57", 
    textAlign: "center", 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee", 
    paddingBottom: 10 
  },
  eventItem: { 
    paddingVertical: 15, 
    paddingHorizontal: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#f0f0f0" 
  },
  eventDateText: { 
    fontSize: 18, 
    fontFamily: "TenorSans", 
    color: "#333", 
    marginBottom: 4, 
    textTransform: 'capitalize' 
  },
  eventSlotsText: { 
    fontSize: 14, 
    color: "#2e7d32", 
    fontWeight: "bold" 
  },
  noEventsText: { 
    textAlign: "center", 
    color: "#666", 
    fontSize: 16, 
    marginVertical: 30, 
    fontFamily: "TenorSans" 
  },
  closeButton: { 
    marginTop: 20, 
    backgroundColor: "#f5f5f5", 
    padding: 12, 
    borderRadius: 15, 
    alignItems: "center" 
  },
  closeButtonText: { 
    color: "#d32f2fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});
