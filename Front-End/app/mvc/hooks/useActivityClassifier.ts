import { useState, useEffect, useRef, useCallback } from 'react';
import { Accelerometer } from 'expo-sensors';
import { 
  ActivityType, 
  LocationData, 
  AccelerometerData, 
  SessionStats, 
  ActivityLog, 
  SavedRoute 
} from '../models/ActivityModel';

import LocationService from '../services/LocationService';
import ActivityClassifierService from '../services/ActivityClassifierService';
import RouteService from '../services/RouteService';

const MET_VALUES = {
  [ActivityType.Idle]: 1.0,
  [ActivityType.Walking]: 3.5,
  [ActivityType.Running]: 9.0,
  [ActivityType.Vehicle]: 0,
  [ActivityType.Unknown]: 1.0,
};

export const useActivityClassifier = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(ActivityType.Idle);
  const [confidence, setConfidence] = useState(0);
  
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [currentAccel, setCurrentAccel] = useState<AccelerometerData | null>(null);
  
  const [accelHistory, setAccelHistory] = useState<number[]>([]);

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    status: 'stopped',
    startTime: 0,
    durationSeconds: 0,
    distanceMeters: 0,
    averageSpeedKmh: 0,
    currentActivity: ActivityType.Idle,
    caloriesBurned: 0,
  });

  // Internal Refs
  const statsRef = useRef<SessionStats>(sessionStats);
  const pathRef = useRef<LocationData[]>([]);
  const activityLogsRef = useRef<ActivityLog[]>([]);
  const lastLocationRef = useRef<LocationData | null>(null);
  const accelSubscription = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const permitted = await LocationService.requestPermissions();
      setHasPermission(permitted);
      Accelerometer.setUpdateInterval(500); 
    })();
    return () => stopTracking(); 
  }, []);

  const handleLocationUpdate = useCallback((newLoc: LocationData) => {
    const prevLoc = lastLocationRef.current;
    let distDelta = 0;

    if (prevLoc) {
      distDelta = LocationService.calculateDistance(
        prevLoc.latitude, prevLoc.longitude,
        newLoc.latitude, newLoc.longitude
      );
    }

    if (distDelta < 0.5) distDelta = 0; 

    statsRef.current.distanceMeters += distDelta;
    
    const totalHours = statsRef.current.durationSeconds / 3600;
    const totalKm = statsRef.current.distanceMeters / 1000;
    statsRef.current.averageSpeedKmh = totalHours > 0 ? totalKm / totalHours : 0;

    pathRef.current.push(newLoc);
    lastLocationRef.current = newLoc;
    
    setCurrentLocation(newLoc);
  }, []);

  const handleAccelUpdate = (data: any) => {
    const timestamp = Date.now();
    const accData: AccelerometerData = { x: data.x, y: data.y, z: data.z, timestamp };
    
    setCurrentAccel(accData);

    // Calcula la magnitud
    const magnitude = Math.sqrt(data.x**2 + data.y**2 + data.z**2);
    
    // Actualiza el historial (grafica)
    setAccelHistory(prev => {
      const newHist = [...prev, magnitude];
      if (newHist.length > 30) newHist.shift();
      return newHist;
    });

    const currentSpeed = currentLocation?.speed || 0;
    const detectedActivity = ActivityClassifierService.getActivity(accData, currentSpeed);
    const conf = ActivityClassifierService.getConfidence();

    if (detectedActivity !== currentActivity) {
      setCurrentActivity(detectedActivity);
      
      activityLogsRef.current.push({
        timestamp: timestamp,
        type: detectedActivity,
        confidence: conf
      });
    }
    
    setConfidence(conf);
    statsRef.current.currentActivity = detectedActivity;
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      statsRef.current.durationSeconds += 1;
      const met = MET_VALUES[statsRef.current.currentActivity] || 1;
      const kcalPerSecond = (met * 3.5 * 70) / (200 * 60);
      statsRef.current.caloriesBurned += kcalPerSecond;
      setSessionStats({ ...statsRef.current });
    }, 1000);
  };

  const startTracking = async () => {
    if (!hasPermission) return;
    
    statsRef.current = {
      status: 'active',
      startTime: Date.now(),
      durationSeconds: 0,
      distanceMeters: 0,
      averageSpeedKmh: 0,
      currentActivity: ActivityType.Idle,
      caloriesBurned: 0,
    };
    pathRef.current = [];
    activityLogsRef.current = []; // Reinicia logs
    lastLocationRef.current = null;
    setAccelHistory([]);

    setIsActive(true);
    setSessionStats(statsRef.current);

    await LocationService.startTracking(handleLocationUpdate);
    accelSubscription.current = Accelerometer.addListener(handleAccelUpdate);
    startTimer();
  };

  const stopTracking = () => {
    LocationService.stopTracking();
    if (accelSubscription.current) accelSubscription.current.remove();
    if (timerRef.current) clearInterval(timerRef.current);

    setIsActive(false);
    
    const finalStats = { ...statsRef.current, status: 'stopped' as const };
    setSessionStats(finalStats);

    const finalRoute: SavedRoute = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      stats: finalStats,
      path: pathRef.current,
      activityLog: [...activityLogsRef.current], 
      activityDistribution: {} as any
    };

    RouteService.saveSession(finalRoute);
    
    return finalRoute;
  };

  return {
    isActive,
    hasPermission,
    currentActivity,
    confidence,
    sessionStats,
    currentLocation,
    currentAccel,
    accelHistory,
    startTracking,
    stopTracking
  };
};
