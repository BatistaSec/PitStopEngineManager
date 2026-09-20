from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.ml.model import ai_model

app = FastAPI(title="PitStopEngine Predictive AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Train the synthetic model when the app starts
    ai_model.train_synthetic()

class DegradationRequest(BaseModel):
    tyre_compound: str
    laps_done: int
    track_temperature: float

class StrategyRequest(BaseModel):
    current_compound: str
    current_laps: int
    track_temperature: float
    total_laps: int

@app.post("/api/v1/predict/degradation")
def predict_degradation(req: DegradationRequest):
    deg = ai_model.predict_degradation(req.tyre_compound, req.laps_done, req.track_temperature)
    return {"predicted_degradation_percentage": round(deg, 2)}

@app.post("/api/v1/predict/strategy")
def predict_strategy(req: StrategyRequest):
    pit_lap = ai_model.predict_strategy(req.current_compound, req.current_laps, req.track_temperature, req.total_laps)
    return {
        "recommended_pit_lap": pit_lap,
        "laps_remaining_until_pit": max(0, pit_lap - req.current_laps)
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "model_trained": ai_model.is_trained}
