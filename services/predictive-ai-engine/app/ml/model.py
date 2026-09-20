import pandas as pd
import numpy as np
import fastf1
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

class TyreDegradationModel:
    def __init__(self):
        self.model = None
        self.is_trained = False

    def train_synthetic(self):
        # We redirect this to real fastf1 data
        self.train_from_fastf1()

    def train_from_fastf1(self):
        print("[AI Engine] Loading REAL F1 data using FastF1 (2023 Bahrain GP)...")
        os.makedirs("fastf1_cache", exist_ok=True)
        fastf1.Cache.enable_cache('fastf1_cache')
        
        # Carregar GP do Bahrain de 2023 (Corrida)
        session = fastf1.get_session(2023, 'Bahrain', 'R')
        session.load(telemetry=False, weather=True, messages=False)

        # Filtrar as voltas e pegar o tipo de pneu e o tempo de uso
        laps = session.laps.pick_quicklaps().dropna(subset=['Compound', 'TyreLife'])
        weather = session.weather_data
        
        # Encontra a vida útil máxima observada para cada pneu na corrida real
        max_life = laps.groupby('Compound')['TyreLife'].max().to_dict()
        
        df_list = []
        for _, lap in laps.iterrows():
            compound = lap['Compound']
            if compound not in ['SOFT', 'MEDIUM', 'HARD']:
                continue
                
            tyre_life = lap['TyreLife']
            max_l = max_life.get(compound, 30)
            
            # Temperaturas reais da pista no momento da volta
            lap_time = lap['Time']
            nearest_weather = weather.iloc[(weather['Time'] - lap_time).abs().argsort()[:1]]
            track_temp = nearest_weather['TrackTemp'].values[0] if not nearest_weather.empty else 30.0
            
            # Calcula degradação (0 a 100%) baseado no ciclo de vida real daquele composto + leve variação aleatória de pista
            deg = (tyre_life / max_l) * 100.0
            deg = max(0, min(100, deg))
            
            df_list.append({
                'tyre_compound': compound,
                'laps_done': tyre_life,
                'track_temperature': track_temp,
                'degradation': deg
            })
            
        df = pd.DataFrame(df_list)

        print(f"[AI Engine] Training RandomForestRegressor on {len(df)} REAL F1 lap records...")
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), ['tyre_compound'])
            ],
            remainder='passthrough'
        )

        self.model = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
        ])

        X = df[['tyre_compound', 'laps_done', 'track_temperature']]
        y = df['degradation']
        
        self.model.fit(X, y)
        self.is_trained = True
        print("[AI Engine] Real Data Model trained successfully!")

    def predict_degradation(self, compound: str, laps: int, track_temp: float) -> float:
        if not self.is_trained:
            self.train_from_fastf1()
            
        X_new = pd.DataFrame({
            'tyre_compound': [compound.upper()],
            'laps_done': [laps],
            'track_temperature': [track_temp]
        })
        
        pred = self.model.predict(X_new)[0]
        return max(0, min(100, pred))

    def predict_strategy(self, current_compound: str, current_laps: int, track_temp: float, total_laps: int):
        if not self.is_trained:
            self.train_from_fastf1()
            
        deg = self.predict_degradation(current_compound, current_laps, track_temp)
        if deg >= 70:
            return current_laps
            
        for additional_laps in range(1, total_laps - current_laps + 1):
            future_laps = current_laps + additional_laps
            future_deg = self.predict_degradation(current_compound, future_laps, track_temp)
            if future_deg >= 70:
                return future_laps
                
        return total_laps

ai_model = TyreDegradationModel()
