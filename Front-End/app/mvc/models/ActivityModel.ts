export enum ActivityType {
  Idle = 'idle',
  Walking = 'walking',
  Running = 'running',
  Vehicle = 'vehicle',
  Unknown = 'unknown'
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

// datos de sensores
export interface LocationData extends LatLng {
  speed: number | null;    // Velocidad en m/s
  accuracy: number | null;
  altitude?: number | null; 
  timestamp: number;
}

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

// sesion
export interface ActivityLog {
  timestamp: number;
  type: ActivityType;
  confidence: number;
}

export interface SessionStats {
  status: 'active' | 'paused' | 'stopped';
  startTime: number;
  durationSeconds: number;
  distanceMeters: number;
  averageSpeedKmh: number;
  currentActivity: ActivityType;
  caloriesBurned: number;
}

export interface SavedRoute {
  id: string;
  date: string;
  stats: SessionStats;
  path: LocationData[];
  activityLog: ActivityLog[];
  activityDistribution: Record<ActivityType, number>;
}


export interface ClassifierConfig {
  idleThreshold: number;
  walkingThreshold: number;
  runningThreshold: number;
  vehicleSpeedThreshold: number;
  minMovementSpeed: number;
  historyWindowSize: number;
}

export const DEFAULT_CLASSIFIER_CONFIG: ClassifierConfig = {
  // gravedad considerada ~1.0. Cualquier valor sobre 1.1 es movimiento
  idleThreshold: 1.05,     
  walkingThreshold: 1.12,  // 1.12 para detectar caminata suave
  runningThreshold: 1.6,   // 1.6 para detectar trote
  
  // Velocidad GPS
  vehicleSpeedThreshold: 6.0, // consideracion de 21 km/h
  minMovementSpeed: 0.6,      // consideracion de 2 km/h, cualquier valor menor se considera quieto

  historyWindowSize: 5        
};
