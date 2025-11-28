import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoute, SessionStats } from './ActivityModel';

const KEYS = {
  ROUTES: '@app_maps_routes',
  CURRENT_SESSION: '@app_maps_current_session',
  STATS: '@app_maps_total_stats'
};

class StorageService {
  
  // Guarda la ruta completa
  async saveRoute(route: SavedRoute): Promise<void> {
    try {
      const existing = await this.getRoutes();
      existing.push(route);
      await AsyncStorage.setItem(KEYS.ROUTES, JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving route', e);
    }
  }

  // Recupera las rutas
  async getRoutes(): Promise<SavedRoute[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.ROUTES);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  }

  // Guarda estadisticas totales
  async updateGlobalStats(newStats: SessionStats): Promise<void> {
    try {
      const json = await AsyncStorage.getItem(KEYS.STATS);
      const current = json ? JSON.parse(json) : { distanceMeters: 0, durationSeconds: 0 };
      
      const updated = {
        distanceMeters: current.distanceMeters + newStats.distanceMeters,
        durationSeconds: current.durationSeconds + newStats.durationSeconds,
      };

      await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating stats', e);
    }
  }

  // Limpia datos
  async clearAll() {
    await AsyncStorage.clear();
  }
}

export default new StorageService();
