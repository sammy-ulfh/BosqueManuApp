
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
      const LOCAL_API = Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://127.0.0.1:3001";

      console.log('[Donar] Creating payment intent, amount (cents):', amountNum, 'using', LOCAL_API);
      const response = await fetch(`${LOCAL_API}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNum }),
      });

      console.log('[Donar] /create-payment-intent response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${text}`);
      }

      const body = await response.json();
      console.log('[Donar] /create-payment-intent response body:', body);
      const { clientSecret } = body;
      if (!clientSecret) throw new Error("No se recibió clientSecret del servidor.");

      console.log('[Donar] Initializing PaymentSheet with clientSecret');
      let init;
      try {
        init = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Bosque Manu",
          
        });
        console.log('[Donar] initPaymentSheet result:', init);
      } catch (initErr) {
        console.log('[Donar] initPaymentSheet threw:', initErr);
        Alert.alert('Error inicializando pago', String(initErr));
        return;
      }

      if (init?.error) {
        console.log('[Donar] initPaymentSheet returned error:', init.error);
        Alert.alert("Error inicializando pago", init.error.message || String(init.error));
        return;
      }

      console.log('[Donar] Presenting PaymentSheet');
      let paymentResult;
      try {
        paymentResult = await presentPaymentSheet();
        console.log('[Donar] presentPaymentSheet result:', paymentResult);
      } catch (presentErr) {
        console.log('[Donar] presentPaymentSheet threw:', presentErr);
        Alert.alert('Error en PaymentSheet', String(presentErr));
        return;
      }

      if (paymentResult?.error) {
        console.log('[Donar] paymentResult error:', paymentResult.error);
        Alert.alert("Pago cancelado", paymentResult.error.localizedMessage || paymentResult.error.message || String(paymentResult.error));
      } else {
        try {

          const amountPesos = Number(amount.replace(/,/g, "."));

          const { user } = await getCurrentUser();
          const userId = user?.id ?? null;

          const { data, error } = await insertDonation(amountPesos, email, userId, 'succeeded');
          if (error) {
            console.log('[Donar] insertDonation error:', error);
          } else {
            console.log('[Donar] donation recorded:', data);
          }
        } catch (err) {
          console.log('[Donar] donation logging failed:', err);
        }

        Alert.alert("¡Gracias por donar! ❤️", "Tu apoyo hace la diferencia", [
          { text: "OK", onPress: () => navigation.navigate("ClientHome") },
        ]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || String(err));
    } finally {
      setProcessing(false);
      setShowConfirm(false);
    }
  };

  return (
    <ImageBackground source={require("@/assets/images/donacionesfondo.png")} style={styles.mainContainer} resizeMode="cover">
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
          {/* Tarjeta eliminada: usamos PaymentSheet, no campo de tarjeta in-app */}
        </ScrollView>
      </View>

      <MainButton
        text="DONAR"
        onPress={() => {
          if (!validate()) return;
          confirmDonation();
        }}
        style={styles.finishButton}
      />

      <Modal visible={showConfirm} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar donación</Text>
            <Text>{name}</Text>
            <Text>{email}</Text>
            <Text>${amount} MXN</Text>

            {processing ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <MainButton text="CONFIRMAR" onPress={confirmDonation} />
                <TouchableOpacity onPress={() => setShowConfirm(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
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
  header: { fontSize: 30, fontFamily: "Gloock", color: "white", textAlign: "center", marginBottom: 12 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.95)', textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
  cardMessage: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginBottom: 12, fontFamily: 'TenorSans', fontWeight: '600' },
  formCard: {
    width: "86%",
    backgroundColor: "#9c9510a5",
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
  checkboxRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  checkboxText: { color: "#fff", fontSize: 14, marginLeft: 8 },
  finishButton: { width: "80%", backgroundColor: "#ac1b0ed8", height: 60, borderRadius: 30, alignSelf: "center", marginTop: 18, marginBottom: 20 },
  error: { color: "#FFD2D2", fontSize: 12, marginTop: 4, marginLeft: 6 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "86%", backgroundColor: "white", borderRadius: 14, padding: 16, alignItems: "center" },
  modalTitle: { fontSize: 20, fontFamily: "Gloock", color: "#8c150aff", marginBottom: 8 },
  cancelText: { color: "#cc0000", fontWeight: "600" },
  webContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  webTitle: { fontSize: 20, textAlign: "center" },
});
