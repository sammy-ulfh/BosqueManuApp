import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
} from "react-native";
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import * as Font from "expo-font";
import { getCurrentUser } from "@/mvc/models/auth/auth.js";
import { supabase } from "@/mvc/models/supabase/supabaseClient.js";

export default function VoluntariosForm({ navigation }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const loadInitialData = async () => {
    await Font.loadAsync({
      TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
      Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
    });
    
    const { user } = await getCurrentUser();
    if (user) {
      const fullName = user.user_metadata.full_name || "";
      const [first] = fullName.split(" ");
      setUserName(first || "");
    }
    
    fetchAvailableEvents();
    setIsLoaded(true);
  };

  const fetchAvailableEvents = async () => {
    setLoadingEvents(true);
    const now = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, date, description, registros')
        .gt('date', now)
        .lt('registros', 14)
        .order('date', { ascending: true });

        console.log("\n\n[+] Datos obtenidos...\n")
        console.log(data)

      if (error) throw error;
      setAvailableEvents(data || []);
    } catch (error) {
      console.error("Error cargando eventos:", error.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  if (!isLoaded) return null;

  const validatePhone = () => /^\d{10}$/.test(phone);

  const handleSubmit = async () => {
    if (!validatePhone()) {
      alert("El número telefónico debe tener 10 dígitos.");
      return;
    }
    if (!selectedEvent) {
      alert("Por favor selecciona una fecha disponible.");
      return;
    }

    try {
      const { user: authUser } = await getCurrentUser();
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (!userData) throw new Error("Usuario no encontrado");

      await supabase
        .from('users')
        .update({ number: phone, nombre: userName })
        .eq('id', userData.id);

      const { error: joinError } = await supabase
        .from('user_events')
        .insert({
          user_id: userData.id,
          event_id: selectedEvent.id 
        });

      if (joinError) throw joinError;

      const { error: rpcError } = await supabase.rpc('increment_event_registros', { 
        event_id: selectedEvent.id 
      });

      if (rpcError) {
        console.error("Error incrementando contador:", rpcError);
      }

      alert("Registro exitoso");
      navigation.navigate("ClientHome");

    } catch (error) {
      if (error.code === '23505') {
        alert("Ya estás registrado en este evento.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' });
  };

  const EXTRA_TOP_OFFSET = 40; 
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 + EXTRA_TOP_OFFSET : 80 + EXTRA_TOP_OFFSET;

  return (
    <ImageBackground
      source={require("@/assets/images/Voluntarios.png")}
      style={[styles.mainContainer, { paddingTop: topPadding }]}
      imageStyle={{ resizeMode: "cover", transform: [{ translateY: 30 }, { scale: 1.2 }] }}
    >
      <Text style={styles.header}>¡Yo quiero ser voluntario!</Text>

      <View style={styles.formCard}>
        <FlatList
          data={[]}
          keyExtractor={() => 'form'}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.label}>Nombre</Text>
              <Input
                placeholder="Tu nombre"
                value={userName}
                onChangeText={setUserName}
                style={[styles.input, { color: '#000' }]}
              />

              <Text style={styles.label}>Teléfono</Text>
              <Input
                placeholder="10 dígitos"
                value={phone}
                keyboardType="number-pad"
                onChangeText={setPhone}
                style={[styles.input, { color: '#000' }]}
              />

              <Text style={styles.label}>Fecha de voluntariado</Text>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowModal(true)}
              >
                <Text style={styles.dateText}>
                  {selectedEvent ? formatDate(selectedEvent.date) : "Seleccionar fecha disponible"}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>

              <Text style={{color: 'white', fontSize: 12, marginTop: 5, marginLeft: 10, fontStyle: 'italic'}}>
                * Solo mostramos fechas con cupo disponible.
              </Text>

              <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Fechas Disponibles</Text>

                    {loadingEvents ? (
                      <ActivityIndicator size="large" color="#0A6A8C" />
                    ) : availableEvents.length === 0 ? (
                      <Text style={styles.noEventsText}>No hay fechas disponibles por el momento.</Text>
                    ) : (
                      <FlatList
                        data={availableEvents}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity 
                            style={styles.eventItem}
                            onPress={() => {
                              setSelectedEvent(item);
                              setShowModal(false);
                            }}
                          >
                            <Text style={styles.eventDateText}>{formatDate(item.date)}</Text>
                            <Text style={styles.eventSlotsText}>
                              Cupos: {14 - (item.registros || 0)} disponibles
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}

                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={() => setShowModal(false)}
                    >
                      <Text style={styles.closeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Para más información acerca de las capacitaciones haz click aquí
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Capacitacion")}>
                  <Text style={styles.infoLink}>Términos de uso | Política de privacidad</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </View>

      <MainButton
        text="FINALIZAR"
        onPress={handleSubmit}
        style={styles.finishButton}
        color="black"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#5F3714", // fondo café igual al de la imagen
    alignItems: "center",
    paddingTop: 0,
  },
  header: {
    fontSize: 28,
    fontFamily: "Gloock",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  formCard: {
    width: "80%",
    backgroundColor: "#0A6A8C", // azul de la imagen
    borderRadius: 20,
    padding: 20,
    paddingBottom: 50,
    minHeight: 500, 
    marginBottom: 80,
  },

  label: {
    color: "white",
    fontFamily: "TenorSans",
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    color: "#000",
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateText: {
    fontFamily: "TenorSans",
    color: "#333",
    fontSize: 16,
  },

  calendarIcon: {
    fontSize: 20,
  },

  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginTop: 40,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "TenorSans",
  },

  infoLink: {
    fontSize: 12,
    marginTop: 10,
    color: "#333",
    textDecorationLine: "underline",
  },
  finishButton: {
    width: "80%",
    backgroundColor: "#661b1bec",
    height: 60,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center", 
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "#5F3714",
    alignItems: "center",
    paddingTop: 0,
  },
  header: {
    fontSize: 28,
    fontFamily: "Gloock",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  formCard: {
    width: "80%",
    backgroundColor: "#0A6A8C", 
    borderRadius: 20,
    padding: 20,
    paddingBottom: 50,
    minHeight: 500, 
    marginBottom: 80,
  },
  label: {
    color: "white",
    fontFamily: "TenorSans",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  dateText: {
    fontFamily: "TenorSans",
    fontSize: 16,
    color: "#333",
  },
  calendarIcon: {
    fontSize: 20,
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginTop: 40,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "TenorSans",
  },
  infoLink: {
    fontSize: 12,
    marginTop: 10,
    color: "#333",
    textDecorationLine: "underline",
  },
  finishButton: {
    width: "80%",
    backgroundColor: "#9c1414b8",
    height: 60,
    borderRadius: 25,
    marginTop: -40,
    alignSelf: "center", 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Gloock",
    marginBottom: 15,
    textAlign: "center",
    color: "#0A6A8C",
  },
  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  eventDateText: {
    fontSize: 16,
    fontFamily: "TenorSans",
    color: "#333",
  },
  eventSlotsText: {
    fontSize: 12,
    color: "green",
    marginTop: 4,
  },
  noEventsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666'
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#0A6A8C",
    padding: 12,
    borderRadius: 15,
  },
  closeText: {
    color: "white",
    textAlign: "center",
    fontFamily: "TenorSans",
  },
});
