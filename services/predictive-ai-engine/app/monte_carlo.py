import random
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

def run_monte_carlo_simulation(car_id: str, current_lap: int, weather: str) -> Dict:
    """
    Executa 10.000 simulações baseadas no método de Monte Carlo 
    para prever a probabilidade de vitória dependendo da janela de pit stop.
    """
    logger.info(f"[{car_id}] Iniciando 10.000 simulações Monte Carlo (Safety Car / Clima alterado: {weather})")
    
    simulations = 10000
    wins_if_pit_now = 0
    wins_if_stay_out = 0
    
    for _ in range(simulations):
        # Simulação simplificada de variáveis aleatórias
        # Pit stop agora: perde tempo imediato mas ganha ritmo
        pit_time_lost = random.triangular(20.0, 24.0, 21.5)
        new_tyre_pace = random.triangular(1.0, 2.5, 1.8) # Segundos mais rápido por volta
        
        # Ficar na pista: ganha posição de pista, mas perde ritmo
        old_tyre_degradation = random.triangular(0.5, 3.0, 1.5) 
        
        laps_remaining = 57 - current_lap
        
        # Tempo total simulado se parar
        time_pit = pit_time_lost - (new_tyre_pace * laps_remaining)
        
        # Tempo total simulado se ficar
        time_stay = old_tyre_degradation * laps_remaining
        
        # Adicionando ruído de tráfego / safety car
        traffic_penalty = random.uniform(0, 5) if weather == "RAIN" else random.uniform(0, 2)
        time_pit += traffic_penalty
        
        if time_pit < time_stay:
            wins_if_pit_now += 1
        else:
            wins_if_stay_out += 1
            
    prob_pit = (wins_if_pit_now / simulations) * 100
    prob_stay = (wins_if_stay_out / simulations) * 100
    
    return {
        "car_id": car_id,
        "recommendation": "PIT" if prob_pit > prob_stay else "STAY",
        "win_probability_if_pit": round(prob_pit, 2),
        "win_probability_if_stay": round(prob_stay, 2)
    }
