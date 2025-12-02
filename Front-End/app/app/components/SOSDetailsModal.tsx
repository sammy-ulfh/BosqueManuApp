import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SOSAlertItem } from './SOSAlertCard';
import { supabase } from '../../scripts/supabaseClient';

type Props = {
  visible: boolean;
  onClose: () => void;
  alert?: SOSAlertItem | null;
  onResolved?: (id: string) => void;
};

export default function SOSDetailsModal({ visible, onClose, alert, onResolved }: Props) {
  if (!alert) return null;

  const profile = alert.users;
  const fullName = profile?.nombre ? `${profile.nombre} ${profile.apellido || ''}`.trim() : (alert.email || 'Usuario');

  const openMaps = () => {
    const lat = alert.lat ?? 0;
    const lng = alert.lng ?? 0;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Error opening maps', err));
  };

  const handleResolve = async () => {
    try {
      console.log('Attempting to resolve alert id=', alert.id);

      const res = await supabase
        .from('sos_alerts')
        .update({ status: 'resolved' })
        .eq('id', alert.id)
        .select();

      const { data, error } = res as any;

      if (error) {
        console.error('Error updating alert:', error);
        Alert.alert('Error', 'No se pudo marcar como resuelto. ' + (error.message || ''));
        return;
      }

      // Supabase may return an empty array if no row was updated
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.error('Update returned 0 rows', res);
        Alert.alert(
          'No actualizado',
          'La actualización no afectó ninguna fila. Esto puede deberse a que la alerta ya no existe o a reglas RLS en la base de datos que impiden la actualización con las credenciales actuales.'
        );
        return;
      }

      // If array returned, take first row
      const updated = Array.isArray(data) ? data[0] : data;
      if (!updated || updated.status !== 'resolved') {
        console.error('Update did not result in resolved status', updated);
        Alert.alert('Error', 'No se pudo confirmar el cambio en la base de datos.');
        return;
      }

      onResolved && onResolved(alert.id);
      onClose();
    } catch (err) {
      console.error('Error resolving alert:', err);
      Alert.alert('Error', 'No se pudo marcar como resuelto.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>Detalles de SOS</Text>

            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{fullName}</Text>

            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{profile?.number || profile?.contact || 'No disponible'}</Text>

            <Text style={styles.label}>Tipo de sangre</Text>
            <Text style={styles.value}>{profile?.blood || 'No disponible'}</Text>

            <Text style={styles.label}>Alergias</Text>
            <Text style={styles.value}>{profile?.allergies || 'No registrado'}</Text>

            <Text style={styles.label}>Medicamentos</Text>
            <Text style={styles.value}>{profile?.medicines || 'No registrado'}</Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2E7D57' }]} onPress={openMaps}>
              <Text style={styles.actionText}>Abrir en mapas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5CB85C' }]} onPress={handleResolve}>
              <Text style={styles.actionText}>Marcar como resuelto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ccc' }]} onPress={onClose}>
              <Text style={[styles.actionText, { color: '#222' }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 16 },
  container: { backgroundColor: '#fff', borderRadius: 12, maxHeight: '90%', overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  label: { marginTop: 8, color: '#666', fontSize: 12 },
  value: { fontSize: 15, color: '#222', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  actionBtn: { flex: 1, marginHorizontal: 6, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
});
