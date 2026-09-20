import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

class TyreDegradationModel:
    def __init__(self):
        self.model = None
        self.is_trained = False

    def train_synthetic(self):
        print("[AI Engine] Generating synthetic F1 tyre data...")
        # Features: tyre_compound, laps_done, track_temperature
        # Target: degradation_percentage (0 to 100)
        
        np.random.seed(42)
        n_samples = 5000
        
        compounds = np.random.choice(['SOFT', 'MEDIUM', 'HARD'], size=n_samples)
        laps_done = np.random.randint(1, 60, size=n_samples)
        track_temp = np.random.uniform(25.0, 50.0, size=n_samples)
        
        # Synthetic wear rules
        wear_rates = {'SOFT': 2.5, 'MEDIUM': 1.5, 'HARD': 1.0}
        
        degradation = []
        for i in range(n_samples):
            base_wear = laps_done[i] * wear_rates[compounds[i]]
            temp_factor = (track_temp[i] - 25) * 0.1 * (wear_rates[compounds[i]] / 2)
            noise = np.random.normal(0, 2)
            
            total_deg = base_wear + temp_factor + noise
            total_deg = max(0, min(100, total_deg))
            degradation.append(total_deg)
            
        df = pd.DataFrame({
            'tyre_compound': compounds,
            'laps_done': laps_done,
            'track_temperature': track_temp,
            'degradation': degradation
        })

        print("[AI Engine] Training RandomForestRegressor...")
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), ['tyre_compound'])
            ],
            remainder='passthrough'
        )

        self.model = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=50, random_state=42))
        ])

        X = df[['tyre_compound', 'laps_done', 'track_temperature']]
        y = df['degradation']
        
        self.model.fit(X, y)
        self.is_trained = True
        print("[AI Engine] Model trained successfully!")

    def predict_degradation(self, compound: str, laps: int, track_temp: float) -> float:
        if not self.is_trained:
            self.train_synthetic()
            
        X_new = pd.DataFrame({
            'tyre_compound': [compound.upper()],
            'laps_done': [laps],
            'track_temperature': [track_temp]
        })
        
        pred = self.model.predict(X_new)[0]
        return max(0, min(100, pred))

    def predict_strategy(self, current_compound: str, current_laps: int, track_temp: float, total_laps: int):
        # We simulate future laps to find when degradation hits a critical threshold (70%)
        if not self.is_trained:
            self.train_synthetic()
            
        deg = self.predict_degradation(current_compound, current_laps, track_temp)
        if deg >= 70:
            return current_laps # Box this lap!
            
        # Simulate forward
        for additional_laps in range(1, total_laps - current_laps + 1):
            future_laps = current_laps + additional_laps
            future_deg = self.predict_degradation(current_compound, future_laps, track_temp)
            if future_deg >= 70:
                return future_laps
                
        return total_laps

ai_model = TyreDegradationModel()
