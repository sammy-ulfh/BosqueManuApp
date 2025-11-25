import React, { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	ScrollView,
} from "react-native";
import AdminDrawer from "@/components/AdminDrawer";

export default function HomeAdmin({ navigation }: any) {
	const [drawerVisible, setDrawerVisible] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<ImageBackground
					source={require("../../../assets/images/bosquehome.png")}
					style={styles.hero}
					imageStyle={{ resizeMode: "cover" }}
				>
					<TouchableOpacity
						onPress={() => setDrawerVisible(true)}
						style={styles.menuButton}
						accessibilityLabel="Abrir menú"
					>
						<Text style={styles.menuIcon}>☰</Text>
					</TouchableOpacity>

					<View style={styles.heroContent}>
						<Text style={styles.heroTitle}>Panel de Administración</Text>
						<Text style={styles.subtitle}>Resumen rápido — Más Bosque MANU</Text>
					</View>
				</ImageBackground>

				<View style={styles.summaryRow}>
					<TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("Info")}>
						<Text style={styles.cardNumber}>120</Text>
						<Text style={styles.cardLabel}>Usuarios registrados</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.summaryCard} onPress={() => {}}>
						<Text style={styles.cardNumber}>8</Text>
						<Text style={styles.cardLabel}>Capacitaciones</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.summaryRow}>
					<TouchableOpacity style={styles.summaryCard} onPress={() => {}}>
						<Text style={styles.cardNumber}>34</Text>
						<Text style={styles.cardLabel}>Voluntarios</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.summaryCard} onPress={() => {}}>
						<Text style={styles.cardNumber}>$2,400</Text>
						<Text style={styles.cardLabel}>Donativos MBM</Text>
					</TouchableOpacity>
				</View>

				<View style={{ height: 60 }} />
			</ScrollView>

			<AdminDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} navigation={navigation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff" },
	hero: { width: "100%", height: 280, justifyContent: "flex-start" },
	menuButton: { position: "absolute", top: 20, right: 20, padding: 10 },
	menuIcon: { fontSize: 34, color: "#fff", fontWeight: "600" },
	heroContent: { marginTop: 110, marginLeft: 20 },
	heroTitle: { color: "#fff", fontSize: 34, fontWeight: "800" },
	subtitle: { color: "#fff", marginTop: 6, opacity: 0.92 },
	summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 20 },
	summaryCard: { width: "48%", backgroundColor: "#F3F5F4", borderRadius: 12, padding: 16, alignItems: "flex-start" },
	cardNumber: { fontSize: 28, fontWeight: "800", color: "#2E7D57" },
	cardLabel: { marginTop: 6, fontSize: 14, color: "#444" },
});
