import fastf1
import requests
import time
import os
import pandas as pd

print("[Race Simulator] Loading REAL telemetry (Bahrain 2023)...")
os.makedirs("fastf1_cache", exist_ok=True)
fastf1.Cache.enable_cache('fastf1_cache')

session = fastf1.get_session(2023, 'Bahrain', 'R')
# We need telemetry=True to get Speed and RPM
session.load(telemetry=True, weather=False, messages=False)

drivers = ['VER', 'LEC', 'NOR', 'HAM']
telemetry_data = {}

for driver in drivers:
    try:
        d_laps = session.laps.pick_driver(driver)
        if not d_laps.empty:
            # Get telemetry for the whole session for this driver
            telemetry_data[driver] = d_laps.get_telemetry()
    except Exception as e:
        print(f"Skipping {driver}: {e}")

print("[Race Simulator] Ready! Starting real-time stream to Telemetry Streamer...")

TELEMETRY_URL = "http://localhost:3001/api/v1/telemetry/ingest"

# FastF1 telemetry is sampled at ~10Hz. We take every 10th row for a 1Hz update rate
if len(telemetry_data) > 0:
    max_rows = min([len(t) for t in telemetry_data.values()])
    
    for i in range(0, max_rows, 10):
        payload = []
        for driver in drivers:
            if driver in telemetry_data:
                row = telemetry_data[driver].iloc[i]
                payload.append({
                    "driverCode": driver,
                    "speed": int(row['Speed']) if not pd.isna(row['Speed']) else 0,
                    "engineRpm": int(row['RPM']) if not pd.isna(row['RPM']) else 0,
                    "brakeTemp": 400 + (int(row['Brake']) * 50 if not pd.isna(row['Brake']) else 0),
                    "ersLevel": 80.0,
                    "tireWear": 0.0,
                    "x": float(row['X']) if 'X' in row and not pd.isna(row['X']) else 0.0,
                    "y": float(row['Y']) if 'Y' in row and not pd.isna(row['Y']) else 0.0,
                    "timestamp": row['Date'].isoformat() if not pd.isna(row['Date']) else ""
                })
        
        try:
            requests.post(TELEMETRY_URL, json=payload)
            print(f"Sent telemetry frame {i}/{max_rows}")
        except Exception as e:
            print(f"Error sending telemetry: {e}")
            
        time.sleep(1)
