import { AccelerometerData, ActivityType, DEFAULT_CLASSIFIER_CONFIG } from '../models/ActivityModel';

class ActivityClassifierService {
  private magnitudeHistory: number[] = [];
  private config = DEFAULT_CLASSIFIER_CONFIG;

  calculateMagnitude(x: number, y: number, z: number): number {
    return Math.sqrt(x * x + y * y + z * z);
  }

  private getSmoothedMagnitude(newMagnitude: number): number {
    this.magnitudeHistory.push(newMagnitude);
    if (this.magnitudeHistory.length > this.config.historyWindowSize) {
      this.magnitudeHistory.shift();
    }
    const sum = this.magnitudeHistory.reduce((a, b) => a + b, 0);
    return sum / this.magnitudeHistory.length;
  }

  // Actividad
  getActivity(accData: AccelerometerData, currentSpeedMps: number | null): ActivityType {
    const magnitude = this.calculateMagnitude(accData.x, accData.y, accData.z);
    const smoothedMag = this.getSmoothedMagnitude(magnitude);
    const speed = currentSpeedMps || 0; // m/s

    // más de 25 km/h (7 m/s), vehículo.
    if (speed > this.config.vehicleSpeedThreshold) {
      return ActivityType.Vehicle;
    }

    // Corriendo
    // Agitación fuerte (>1.6G) O velocidad de trote (> 2.5 m/s = 9 km/h)
    if (smoothedMag > this.config.runningThreshold || speed > 2.5) {
      return ActivityType.Running;
    }

    // Caminando
    // Movimiento moderado (>1.12G) O desplazamiento GPS constante (> 0.6 m/s)
    if (smoothedMag > this.config.walkingThreshold || speed > this.config.minMovementSpeed) {
      return ActivityType.Walking;
    }

    // Estatico/Quieto
    // Si no se cumple nada de lo anterior, no hay movimiento.
    return ActivityType.Idle;
  }

  getConfidence(): number {
    // Simulacion de valor alto para la demo
    return 0.95;
  }
}

export default new ActivityClassifierService();
