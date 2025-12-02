import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type UserProfile = {
  nombre?: string | null;
  apellido?: string | null;
  blood?: string | null;
  allergies?: string | null;
  medicines?: string | null;
  contact?: string | null;
  number?: string | null;
};

export type SOSAlertItem = {
  id: string;
  lat?: number | null;
  lng?: number | null;
  status?: string | null;
  created_at?: string | null;
  email?: string | null;
  user_id?: string | null;
  users?: UserProfile | null;
};

type Props = {
  alert: SOSAlertItem;
  onViewDetails: (alert: SOSAlertItem) => void;
};

export default function SOSAlertCard({ alert, onViewDetails }: Props) {
  const name = alert.users?.nombre && alert.users?.apellido
    ? `${alert.users.nombre} ${alert.users.apellido}`
    : (alert.email || 'Usuario');

  const date = alert.created_at ? new Date(alert.created_at).toLocaleString() : '';

  const status = (alert.status || 'pending').toLowerCase();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.chip, status === 'resolved' ? styles.resolved : styles.pending]}>
          <Text style={styles.chipText}>{status}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => onViewDetails(alert)} accessibilityLabel={`Ver detalles ${name}`}>
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  left: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#222' },
  date: { marginTop: 4, fontSize: 13, color: '#666' },
  right: { alignItems: 'flex-end', marginLeft: 12 },
  chip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginBottom: 8 },
  chipText: { color: '#fff', fontWeight: '700', textTransform: 'capitalize' },
  pending: { backgroundColor: '#D9534F' },
  resolved: { backgroundColor: '#5CB85C' },
  button: { marginTop: 4, backgroundColor: '#2E7D57', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
