import * as Location from 'expo-location';
import { LocationData } from './ActivityModel';

type LocationCallback = (data: LocationData) => void;

class LocationService {
  private subscription: Location.LocationSubscription | null = null;

  // Permisos
  async requestPermissions(): Promise<boolean> {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') return false;

    return true;
  }

  // Tracking o Sesion
  async startTracking(callback: LocationCallback) {
    if (this.subscription) return;

    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, // Actualizacion cada segundo
        distanceInterval: 1,
      },
      (location) => {
        const data: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed,
          timestamp: location.timestamp,
        };
        callback(data);
      }
    );
  }

  // Detiene Tracking o Sesion
  stopTracking() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  // Calcula la distancia (Formula Haversine)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Se considera como el radio de la tierra en metros
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export default new LocationService();
