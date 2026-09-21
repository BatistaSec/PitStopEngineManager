import pandas as pd
import numpy as np
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class TelemetryAnomalyDetector:
    def __init__(self, window_size: int = 10):
        self.window_size = window_size
        self.history = {}

    def ingest_telemetry(self, telemetry_payload: Dict):
        """
        Recebe dados e aplica rolling window para detectar anomalias (furo de pneu, perda de pressão)
        """
        car_id = telemetry_payload.get('car_id', 'UNKNOWN')
        pressure = telemetry_payload.get('tyre_pressure_fl', 0.0)
        
        if car_id not in self.history:
            self.history[car_id] = []
            
        self.history[car_id].append(pressure)
        
        # Mantém apenas a janela desejada
        if len(self.history[car_id]) > self.window_size:
            self.history[car_id].pop(0)
            
        if len(self.history[car_id]) == self.window_size:
            return self._detect_puncture(car_id)
            
        return None

    def _detect_puncture(self, car_id: str) -> Dict:
        series = pd.Series(self.history[car_id])
        
        # Calcula a média móvel e desvio padrão
        rolling_mean = series.rolling(window=3).mean()
        
        # Se a queda de pressão for abrupta e contínua (slope negativo alto)
        diff = series.diff().dropna()
        
        if (diff < -0.8).sum() >= 2:
            logger.warning(f"🚨 ANOMALIA DETECTADA no Carro {car_id}: Possível furo no pneu (Pressão caindo rapidamente)")
            return {
                "car_id": car_id,
                "anomaly": "PUNCTURE_DETECTED",
                "confidence": 0.95
            }
            
        return None
