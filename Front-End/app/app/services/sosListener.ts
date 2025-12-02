import { supabase } from '../../scripts/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';

type RawAlert = any;

let channelRef: any = null;
let subRef: any = null;
let soundRef: Audio.Sound | null = null;
let started = false;
const listeners: Array<(payload: any) => void> = [];

const todayKey = () => {
  const d = new Date();
  const k = d.toISOString().split('T')[0];
  return `sos_alerts_cache_${k}`;
}

async function loadCache(): Promise<RawAlert[]> {
  try {
    const key = todayKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading SOS cache', err);
    return [];
  }
}

async function saveCache(items: RawAlert[]) {
  try {
    const key = todayKey();
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving SOS cache', err);
  }
}

async function ensureNotificationPermissions() {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch (err) {
    console.error('Error requesting notification permissions', err);
  }
}

async function presentLocalNotification(title: string, body: string) {
  try {
    await ensureNotificationPermissions();
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: Platform.OS === 'ios' ? 'default' : undefined,
      },
      trigger: null,
    });
  } catch (err) {
    console.error('Error showing local notification', err);
  }
}

async function playAlertSound() {
  try {
    const SOUND_URI = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
    const { sound } = await Audio.Sound.createAsync({ uri: SOUND_URI });
    soundRef = sound;
    await sound.setVolumeAsync(1.0);
    await sound.playAsync();
  } catch (err) {
    console.error('Error playing alert sound', err);
  }
}

function vibrate() {
  try {
    Vibration.vibrate(1000);
  } catch (err) {
    console.error('Error vibrating device', err);
  }
}

export async function startSosListener(onNew?: (payload: any) => void) {
  // register listener
  if (onNew) listeners.push(onNew);

  if (started) return;
  started = true;

  // Load cache to ensure permissions are requested early
  await ensureNotificationPermissions();

  // Setup realtime listener
  const handleInsert = async (payload: any) => {
    try {
      const r = (payload.record || payload.new) || payload;
      // update cache (only keep today's)
      const cached = await loadCache();
      const mapped = {
        id: String(r.id),
        lat: r.lat,
        lng: r.lng,
        status: r.status,
        created_at: r.created_at,
        email: r.email,
        user_id: r.user_id,
        users: r.users || null,
      };

      // avoid duplicates
      const exists = cached.find((c: any) => String(c.id) === String(mapped.id));
      const next = exists ? cached.map((c: any) => (String(c.id) === String(mapped.id) ? mapped : c)) : [mapped, ...cached];
      await saveCache(next);

      // Notify registered listeners
      listeners.forEach(cb => { try { cb(mapped); } catch (e) { console.error('listener error', e); } });

      // Show OS notification and play sound/vibrate
      await presentLocalNotification('Nueva alerta SOS', mapped.email || 'Alerta recibida');
      playAlertSound();
      vibrate();
    } catch (err) {
      console.error('Error in handleInsert', err);
    }
  };

  // subscribe using supabase-js v2 channel if available
  try {
    if ((supabase as any).channel) {
      channelRef = (supabase as any)
        .channel('realtime:sos_alerts')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, (payload: any) => handleInsert(payload))
        .subscribe();
    } else if ((supabase as any).from) {
      subRef = (supabase as any).from('sos_alerts').on('INSERT', (payload: any) => handleInsert(payload)).subscribe();
    }
  } catch (err) {
    console.error('Error starting sos listener', err);
  }
}

export function addSosListener(cb: (payload: any) => void) {
  listeners.push(cb);
}

export function removeSosListener(cb: (payload: any) => void) {
  const idx = listeners.indexOf(cb);
  if (idx > -1) listeners.splice(idx, 1);
}

export async function stopSosListener() {
  try {
    if (channelRef && (supabase as any).removeChannel) {
      (supabase as any).removeChannel(channelRef);
      channelRef = null;
    }

    if (subRef && (supabase as any).removeSubscription) {
      (supabase as any).removeSubscription(subRef);
      subRef = null;
    }
  } catch (err) {
    console.error('Error stopping sos listener', err);
  }

  if (soundRef) {
    try { await soundRef.unloadAsync(); } catch {}
    soundRef = null;
  }
  started = false;
  listeners.length = 0;
}

export { loadCache, saveCache };
