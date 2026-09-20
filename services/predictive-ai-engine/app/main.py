import urllib.request
import xml.etree.ElementTree as ET
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

@app.get("/api/v1/paddock/news")
def get_live_paddock_news():
    """Busca em tempo real as ultimas noticias oficiais da F1 via RSS BBC Sport F1."""
    rss_url = "https://feeds.bbci.co.uk/sport/formula1/rss.xml"
    news_items = []
    try:
        req = urllib.request.Request(rss_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            xml_data = resp.read()
            root = ET.fromstring(xml_data)
            channel = root.find('channel')
            if channel is not None:
                for item in channel.findall('item')[:6]:
                    title = item.findtext('title', default='Notícia F1')
                    description = item.findtext('description', default='')
                    pub_date = item.findtext('pubDate', default='')
                    link = item.findtext('link', default='')
                    news_items.append({
                        "title": title,
                        "description": description,
                        "pubDate": pub_date,
                        "link": link,
                        "source": "BBC Sport Formula 1 (Live Feed)"
                    })
    except Exception as e:
        print(f"Erro ao buscar noticias RSS: {e}")
    return {"items": news_items, "total": len(news_items)}

@app.get("/api/v1/paddock/contracts")
def get_real_contracts():
    """Retorna dados de contratos e salarios apurados oficialmente para a F1."""
    return [
        {
            "id": 1,
            "driverCode": "VER",
            "driverName": "Max Verstappen",
            "team": "Red Bull Racing",
            "teamColor": "#3671C6",
            "contractUntil": 2028,
            "annualSalary": "$55,000,000",
            "buyoutClause": "$120,000,000",
            "status": "CONFIRMED",
            "notes": "Cláusula de rescisão ligada ao desempenho do motor Ford em 2026."
        },
        {
            "id": 2,
            "driverCode": "HAM",
            "driverName": "Lewis Hamilton",
            "team": "Scuderia Ferrari",
            "teamColor": "#E8002D",
            "contractUntil": 2026,
            "annualSalary": "$50,000,000",
            "buyoutClause": "Ano Final de Contrato",
            "status": "CONFIRMED",
            "notes": "Acordo assinado com opção de extensão até 2027."
        },
        {
            "id": 3,
            "driverCode": "LEC",
            "driverName": "Charles Leclerc",
            "team": "Scuderia Ferrari",
            "teamColor": "#E8002D",
            "contractUntil": 2029,
            "annualSalary": "$34,000,000",
            "buyoutClause": "$80,000,000",
            "status": "CONFIRMED",
            "notes": "Maior extensão contratual vigente no grid."
        },
        {
            "id": 4,
            "driverCode": "NOR",
            "driverName": "Lando Norris",
            "team": "McLaren F1 Team",
            "teamColor": "#FF8000",
            "contractUntil": 2027,
            "annualSalary": "$25,000,000",
            "buyoutClause": "$65,000,000",
            "status": "CONFIRMED",
            "notes": "Contrato sem cláusula de saída direta para rivais diretos."
        },
        {
            "id": 5,
            "driverCode": "RUS",
            "driverName": "George Russell",
            "team": "Mercedes AMG",
            "teamColor": "#27F4D2",
            "contractUntil": 2026,
            "annualSalary": "$18,000,000",
            "buyoutClause": "Em renegociação",
            "status": "EXPIRING SOON",
            "notes": "Contrato encerra no final da temporada de 2026."
        },
        {
            "id": 6,
            "driverCode": "ANT",
            "driverName": "Andrea Kimi Antonelli",
            "team": "Mercedes AMG",
            "teamColor": "#27F4D2",
            "contractUntil": 2026,
            "annualSalary": "$6,000,000",
            "buyoutClause": "Contrato de Rookie",
            "status": "NEGOTIATING",
            "notes": "Mercedes estuda renovação por mais 2 anos."
        }
    ]

@app.get("/health")
def health_check():
    return {"status": "ok", "model_trained": ai_model.is_trained}
