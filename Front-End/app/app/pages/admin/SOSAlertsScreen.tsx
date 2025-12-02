import React, { useEffect, useRef, useState } from 'react';
import * as Font from 'expo-font';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../../scripts/supabaseClient';
import SOSAlertCard, { SOSAlertItem } from '../../../app/components/SOSAlertCard';
import SOSDetailsModal from '../../../app/components/SOSDetailsModal';
import { Audio } from 'expo-av';
import { startSosListener, loadCache, saveCache, addSosListener, removeSosListener } from '../../services/sosListener';
import { useIsFocused } from '@react-navigation/native';

export default function SOSAlertsScreen() {
  const [alerts, setAlerts] = useState<SOSAlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selected, setSelected] = useState<SOSAlertItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlertVisible, setNewAlertVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      TenorSans: require('../../../assets/fonts/Tenor_Sans/TenorSans-Regular.ttf'),
      Gloock: require('../../../assets/fonts/Gloock/Gloock-Regular.ttf'),
      Raleway: require('../../../assets/fonts/Raleway/static/Raleway-Black.ttf'),
    });
    setIsLoaded(true);
  };

  const soundRef = useRef<Audio.Sound | null>(null);
  const isFocused = useIsFocused();

  const fetchAlerts = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('sos_alerts')
      .select(`id, lat, lng, status, created_at, email, user_id`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching SOS alerts', error);
      setAlerts([]);
    } else {
      setAlerts(
        (data || []).map((r: any) => ({
          id: String(r.id),
          lat: r.lat,
          lng: r.lng,
          status: r.status,
          created_at: r.created_at,
          email: r.email,
          user_id: r.user_id,
          users: null, // dejamos null porque ya NO hacemos join
        }))
      );
    }
  } catch (err) {
    console.error('Fetch error', err);
    setAlerts([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const playAlertSound = async () => {
    try {
      // Fallback to a remote sound URI to avoid bundler errors if local asset is missing.
      // If you add `assets/sounds/alarm.mp3`, replace `SOUND_URI` with a local require.
      const SOUND_URI = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
      const { sound } = await Audio.Sound.createAsync({ uri: SOUND_URI });
      soundRef.current = sound;
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
    } catch (err) {
      console.error('Error playing sound', err);
    }
  };

  useEffect(() => {
    loadFonts();

    // load cached alerts for today first
    let mounted = true;
    const init = async () => {
      const cached = await loadCache();
      if (mounted) setAlerts(cached || []);
      // then fetch latest from server and merge
      await fetchAlerts();
    };
    init();

    // register for realtime notifications (UI listener)
    const onNew = (mapped: any) => {
      setAlerts(prev => [mapped, ...prev]);
      setNewAlertVisible(true);
    };

    // start global listener once and add our UI listener
    startSosListener().catch(err => console.error('start listener error', err));
    addSosListener(onNew);

    return () => {
      mounted = false;
      // unregister UI listener
      removeSosListener(onNew);
      // do not stop the global listener here to ensure notifications while not on screen
      // unload sound used by this screen
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // when screen becomes focused, reload cache to ensure we show today's persisted items
  useEffect(() => {
    if (isFocused) {
      loadCache().then(cached => setAlerts(cached || [])).catch(e => console.error(e));
      setNewAlertVisible(false);
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setNewAlertVisible(false);
  };

  const openDetails = (alert: SOSAlertItem) => {
    setSelected(alert);
    setModalVisible(true);
  };

  const handleResolved = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, status: 'resolved' } : a)));
  };

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: 'Gloock' }]}>Notificaciones SOS</Text>
      </View>

      {newAlertVisible && (
        <TouchableOpacity style={styles.newBanner} onPress={() => { setNewAlertVisible(false); }}>
          <Text style={[styles.newBannerText, { fontFamily: 'TenorSans' }]}>¡Nueva alerta SOS recibida!</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <SOSAlertCard alert={item} onViewDetails={openDetails} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <SOSDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        alert={selected ?? undefined}
        onResolved={handleResolved}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 80, backgroundColor: '#2E7D57', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  list: { padding: 16 },
  newBanner: { backgroundColor: '#D9534F', padding: 12, alignItems: 'center' },
  newBannerText: { color: '#fff', fontWeight: '800' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
