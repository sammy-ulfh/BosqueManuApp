import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import * as Font from 'expo-font';

import AdminDrawer from "../../components/AdminDrawer";

import { useHomeAdminController } from "../../controllers/useHomeAdminController";

export default function HomeAdmin({ navigation }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            TenorSans: require("../../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf"),
            Gloock: require("../../../assets/fonts/Gloock/Gloock-Regular.ttf"),
            Raleway: require("../../../assets/fonts/Raleway/static/Raleway-Black.ttf"),
        });
        setIsLoaded(true);
    };

    useEffect(() => { loadFonts(); }, []);
    const { 
        drawerVisible, 
        setDrawerVisible, 
        loading, 
        refreshing, 
        stats, 
        onRefresh, 
        formatCurrency 
    } = useHomeAdminController();

    if (!isLoaded) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#2E7D57" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2E7D57"]} />
                }
            >
                <ImageBackground
                    source={require("../../../assets/images/bosquehome.png")}
                    style={styles.hero}
                    imageStyle={{ resizeMode: "cover" }}
                >
                    <TouchableOpacity
                        onPress={() => setDrawerVisible(true)}
                        style={styles.menuButton}
                    >
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>

                    <View style={styles.heroContent}>
                        <Text style={[styles.heroTitle, { fontFamily: 'Gloock' }]}>Panel de Administración</Text>
                        <Text style={[styles.subtitle, { fontFamily: 'TenorSans' }]}>Resumen rápido — Más Bosque MANU</Text>
                    </View>
                </ImageBackground>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#2E7D57" />
                        <Text style={{ marginTop: 10, color: "#666" }}>Cargando estadísticas...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.summaryRow}>
                            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("Info")}>
                                <Text style={[styles.cardNumber, { fontFamily: 'TenorSans' }]}>{stats.users}</Text>
                                <Text style={[styles.cardLabel, { fontFamily: 'TenorSans' }]}>Usuarios registrados</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("CapacitacionesAdmin")}>
                                <Text style={[styles.cardNumber, { fontFamily: 'TenorSans' }]}>{stats.courses}</Text>
                                <Text style={[styles.cardLabel, { fontFamily: 'TenorSans' }]}>Capacitaciones</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.summaryRow}>
                            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("VoluntariosAdmin")}>
                                <Text style={[styles.cardNumber, { fontFamily: 'TenorSans' }]}>{stats.volunteers}</Text>
                                <Text style={[styles.cardLabel, { fontFamily: 'TenorSans' }]}>Voluntarios inscritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("DonativosAdmin")}>
                                <Text style={[styles.cardNumber, { fontFamily: 'TenorSans' }]}>{formatCurrency(stats.money)}</Text>
                                <Text style={[styles.cardLabel, { fontFamily: 'TenorSans' }]}>Donativos MBM</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={styles.actionContainer}>
                    <Text style={[styles.sectionTitle, { fontFamily: 'TenorSans' }]}>Acciones rápidas</Text>
                    
                    {/* Botón 1: Registrar Usuario */}
                    <TouchableOpacity
                        style={[styles.mainButton, { backgroundColor: '#2E7D57' }]} 
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={[styles.mainButtonText, { fontFamily: 'TenorSans' }]}>+ Registrar Nuevo Usuario</Text>
                    </TouchableOpacity>

                    {/* Botón 2: Crear Capacitación (Azul) */}
                    <TouchableOpacity
                        style={[styles.mainButton, { backgroundColor: '#0B6D8A' }]} 
                        onPress={() => navigation.navigate("AddCourseAdmin")}
                    >
                        <Text style={[styles.mainButtonText, { fontFamily: 'TenorSans' }]}>+ Crear Capacitación</Text>
                    </TouchableOpacity>

                    {/* Botón 3: Crear Evento Voluntariado (Naranja) */}
                    <TouchableOpacity
                        style={[styles.mainButton, { backgroundColor: '#E67E22' }]} 
                        onPress={() => navigation.navigate("AddEventAdmin")}
                    >
                        <Text style={[styles.mainButtonText, { fontFamily: 'TenorSans' }]}>+ Crear Evento Voluntariado</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Menú Lateral */}
            <AdminDrawer 
                visible={drawerVisible} 
                onClose={() => setDrawerVisible(false)} 
                navigation={navigation} 
            />
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
    cardNumber: { fontSize: 24, fontWeight: "800", color: "#2E7D57" },
    cardLabel: { marginTop: 6, fontSize: 13, color: "#444" },
    loaderContainer: { marginTop: 50, alignItems: 'center' },
    actionContainer: {
        marginTop: 30,
        paddingHorizontal: 16,
        width: "100%",
        alignItems: "center"
    },
    sectionTitle: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    mainButton: {
        width: "100%",
        height: 55,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15, // Espacio entre botones
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    mainButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    }
});
