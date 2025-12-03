import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
} from "react-native";
import { Input } from "@/mvc/views/components/Input";
import { MainButton } from "@/mvc/views/components/MainButton";
import { useVoluntariosFormController } from "@/mvc/controllers/useVoluntariosFormController";

export default function VoluntariosForm({ navigation }: { navigation: any }) {
  const {
    isLoaded,
    loadingEvents,
    userName, setUserName,
    phone, setPhone,
    availableEvents,
    selectedEvent, setSelectedEvent,
    showModal, setShowModal,
    handleSubmit,
    formatDate
  } = useVoluntariosFormController(navigation) as {
    isLoaded: boolean;
    loadingEvents: boolean;
    userName: string;
    setUserName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    availableEvents: any[];
    selectedEvent: any | null;
    setSelectedEvent: (e: any) => void;
    showModal: boolean;
    setShowModal: (b: boolean) => void;
    handleSubmit: () => void;
    formatDate: (d: any) => string;
  };

  if (!isLoaded) return null;

  const EXTRA_TOP_OFFSET = 40;
  const topPadding =
    Platform.OS === "android"
      ? (StatusBar.currentHeight || 0) + 20 + EXTRA_TOP_OFFSET
      : 80 + EXTRA_TOP_OFFSET;

  const formContent = (
    <>
      <Text style={styles.label}>Nombre</Text>
      <Input
        placeholder="Tu nombre"
        value={userName}
        onChangeText={setUserName}
        style={[styles.input, { color: "#000" }]}
      />

      <Text style={styles.label}>Teléfono</Text>
      <Input
        placeholder="10 dígitos"
        value={phone}
        keyboardType="number-pad"
        onChangeText={setPhone}
        style={[styles.input, { color: "#000" }]}
      />

      <Text style={styles.label}>Fecha de voluntariado</Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowModal(true)}>
        <Text style={styles.dateText}>
          {selectedEvent ? formatDate(selectedEvent.date) : "Seleccionar fecha disponible"}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      <Text style={styles.noteText}>
        * Solo mostramos fechas con cupo disponible.
      </Text>

      {/* --- MODAL --- */}
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
                keyExtractor={(item: any, index) =>
                  item && item.id ? String(item.id) : String(index)
                }
                renderItem={({ item }: { item: any }) => (
                  <TouchableOpacity
                    style={styles.eventItem}
                    onPress={() => {
                      setSelectedEvent(item);
                      setShowModal(false);
                    }}
                  >
                    <Text style={styles.eventDateText}>{formatDate(item?.date)}</Text>
                    <Text style={styles.eventSlotsText}>
                      Cupos: {14 - ((item && item.registros) || 0)} disponibles
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Info Box --- */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Para más información acerca de las actividades haz click aquí
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.infoLink}>Términos de uso | Política de privacidad</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/formularios.jpg")}
      style={[styles.mainContainer, { paddingTop: topPadding }]}
      imageStyle={{ resizeMode: "cover", transform: [{ translateY: 30 }, { scale: 1.2 }] }}
    >
      <View style={styles.formCard}>
        <Text style={styles.headerInside}>¡Yo quiero ser voluntario!</Text>

        <FlatList
          data={[] as any[]}
          keyExtractor={() => "form"}
          ListHeaderComponent={formContent}
          ListFooterComponent={<View style={{ height: 40 }} />} 
          renderItem={() => null}
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
    backgroundColor: "#5F3714",
    alignItems: "center",
  },

  headerInside: {
    fontSize: 30,
    fontFamily: "Gloock",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },

  formCard: {
    width: "80%",
    backgroundColor: "#5a55517d",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 20,
    minHeight: 550,
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
    marginBottom: 7,
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

  noteText: {
    color: "white",
    fontSize: 12,
    marginTop: -7,
    marginLeft: 10,
    fontStyle: "italic",
  },

  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginTop: 40,
    marginBottom: 20,
  },

  infoText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "TenorSans",
  },

  infoLink: {
    fontSize: 12,
    marginTop: 5,
    color: "#333",
    textDecorationLine: "underline",
  },

  finishButton: {
    width: "80%",
    backgroundColor: "#661b1bec",
    height: 60,
    borderRadius: 25,
    marginTop: -50,
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
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#364950ff",
    padding: 12,
    borderRadius: 15,
  },

  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "TenorSans",
  },
});
