import { Platform } from "react-native";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert, ActivityIndicator, ImageBackground
} from "react-native";
import * as Font from "expo-font";
import * as React from "react";
import { MainButton } from "@/mvc/views/components/MainButton";
import { Input } from "@/mvc/views/components/Input";
import { useStripe } from "@stripe/stripe-react-native";
import { insertDonation } from '@/mvc/models/supabase/donations';
import { getCurrentUser } from '@/mvc/models/auth/auth';
import { getUserProfileByAuthId } from '@/mvc/models/supabase/profile';

export default function Donar({ navigation }: any) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [errors, setErrors] = React.useState<any>({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await Font.loadAsync({
        TenorSans: require("@/assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
        Gloock: require("@/assets/fonts/Gloock/Gloock-Regular.ttf"),
        Raleway: require("@/assets/fonts/Raleway/static/Raleway-Black.ttf"),
      });
      
      try {
        const { user } = await getCurrentUser();
        if (user) {
          const profile = await getUserProfileByAuthId(user.id);
          if (profile) {
            const nombre = profile.nombre ?? '';
            const apellido = profile.apellido ?? '';
            const combined = `${nombre}${apellido ? ' ' + apellido : ''}`.trim();
            if (combined) setName(combined);
            if (profile.email) setEmail(profile.email);
          } else {
            const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
            setName(userName);
            if (user.email) setEmail(user.email);
          }
        }
      } catch (err) {
        console.log('[Donar] getCurrentUser failed:', err);
      }

      setIsLoaded(true);
    })();
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>Las donaciones solo están disponibles en Android y iOS 📱</Text>
      </View>
    );
  }

  if (!isLoaded) return null;

  const validate = () => {
    const e: any = {};
    if (!name.trim()) e.name = "El nombre es requerido.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = "Correo inválido.";
    const amt = parseFloat(amount.replace(/,/g, "."));
    if (isNaN(amt) || amt <= 0) e.amount = "Cantidad inválida.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDonate = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const confirmDonation = async () => {
    try {
      setProcessing(true);
      const amountNum = Math.round(Number(amount.replace(/,/g, ".")) * 100);
      
      // LOCAL O VPS API SI CORREMOS EL SERVIDOR EN LA VPS
      const LOCAL_API = "http://144.126.142.241:3001";

      console.log('[Donar] Conectando a:', LOCAL_API);
      
      const response = await fetch(`${LOCAL_API}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNum }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const body = await response.json();
      const { clientSecret } = body;
      
      if (!clientSecret) throw new Error("No se recibió clientSecret.");

      const init = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Bosque Manu",
        returnURL: 'stripe-example://stripe-redirect',
      });

      if (init.error) {
        Alert.alert("Error", init.error.message);
        setProcessing(false);
        return;
      }
      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        Alert.alert("Pago cancelado", paymentResult.error.message);
      } else {
        try {
          const amountPesos = Number(amount.replace(/,/g, "."));
          const { user } = await getCurrentUser();
          const userId = user?.id ?? null;

          await insertDonation(amountPesos, email, userId, 'succeeded');
        } catch (err) {
          console.log('[Donar] Error guardando en BD:', err);
        }

        setShowConfirm(false);
        Alert.alert("¡Gracias por donar! ❤️", "Tu apoyo hace la diferencia", [
          { text: "OK", onPress: () => navigation.navigate("ClientHome") },
        ]);
      }
    } catch (err: any) {
      console.log('Error general:', err);
      Alert.alert("Error", "No se pudo conectar con el servidor de pagos. Revisa tu conexión.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ImageBackground source={require("@/assets/images/formularios.jpg")} style={styles.mainContainer} resizeMode="cover">
      <Text style={styles.header}>¡Yo quiero donar!</Text>
      <View style={styles.formCard}>
        <ScrollView>
          <Text style={styles.cardMessage}>Donar a Más Bosque Manu, es donar para salvar una vida</Text>
          <Text style={styles.label}>Nombre</Text>
          <Input placeholder="Tu nombre" value={name} onChangeText={setName} style={styles.input} />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <Text style={styles.label}>Correo electrónico</Text>
          <Input placeholder="correo@ejemplo.com" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <Text style={styles.label}>Cantidad (MXN)</Text>
          <Input placeholder="0.00" value={amount} keyboardType="numeric" onChangeText={(t) => setAmount(t.replace(/[^0-9.,]/g, ""))} style={styles.input} />
          {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
        </ScrollView>
      </View>

      <MainButton
        text="DONAR"
        onPress={handleDonate}
        style={styles.finishButton}
      />

      {/* MODAL COMPACTA CORREGIDA */}
      <Modal visible={showConfirm} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { marginBottom: 8 }]}>Confirmar donación</Text>
            
            <Text style={{ marginBottom: 2, color: '#333' }}>{name}</Text>
            <Text style={{ marginBottom: 2, color: '#555', fontSize: 12 }}>{email}</Text>
            
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#791306' }}>
              ${amount} MXN
            </Text>

            {processing ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <ActivityIndicator size="large" color="#791306" />
                <Text style={{ marginTop: 8, fontSize: 12 }}>Procesando...</Text>
              </View>
            ) : (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <MainButton 
                   text="CONFIRMAR" 
                   onPress={confirmDonation} 
                   style={{ width: '100%', height: 45, borderRadius: 12, marginTop: 5 }} 
                />
                
                <TouchableOpacity onPress={() => setShowConfirm(false)} style={{ marginTop: 12, padding: 5 }}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#5F3714",
    alignItems: "center",
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  header: { fontSize: 37, fontFamily: "Gloock", color: "white", textAlign: "center", marginBottom: 12 },
  cardMessage: { fontSize: 19, color: '#FFFFFF', textAlign: 'center', marginBottom: 12, fontFamily: 'TenorSans', fontWeight: '600' },
  formCard: {
    width: "86%",
    backgroundColor: "#4c4635df",
    borderRadius: 20,
    padding: 20,
    minHeight: 420,
    marginBottom: 18,
    alignSelf: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  label: { color: "white", fontFamily: "TenorSans", marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 12 },
  finishButton: { width: "80%", backgroundColor: "#791306d7", height: 60, borderRadius: 30, alignSelf: "center", marginTop: 18, marginBottom: 20 },
  error: { color: "#FFD2D2", fontSize: 12, marginTop: 4, marginLeft: 6 },
  

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { 
    width: "86%", 
    backgroundColor: "white", 
    borderRadius: 14, 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    alignItems: "center" 
  },
  modalTitle: { fontSize: 20, fontFamily: "Gloock", color: "#8c150aff" },
  cancelText: { color: "#cc0000", fontWeight: "600", fontSize: 16 },
  webContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  webTitle: { fontSize: 20, textAlign: "center" },
});