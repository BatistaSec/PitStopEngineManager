# 🏎️ PitStopEngine — Plataforma Distribuída de Telemetria e Gestão de F1

[![Repository](https://img.shields.io/badge/GitHub-BatistaSec%2FPitStopEngineManager-181717?logo=github)](https://github.com/BatistaSec/PitStopEngineManager)
[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

O **PitStopEngine** ([BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)) é uma plataforma de alta performance desenvolvida em arquitetura distribuída de microserviços. O sistema combina gestão oficial de campeonatos de Fórmula 1, processamento de telemetria em tempo real via WebSockets, inteligência artificial preditiva para estratégias de pit stop e dashboards dinâmicos no estilo *Pit Wall*.

📍 **Repositório Oficial:** [github.com/BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)

---

## 🗺️ Roadmap de Desenvolvimento (5 Semanas)

| Semana | Módulo / Serviço | Tecnologias | Status |
| :--- | :--- | :--- | :---: |
| **Semana 1** | **Core Championship Service** | Java 21, Spring Boot 3, PostgreSQL, JPA, JUnit 5, Swagger | `Concluído` ✅ |
| **Semana 2** | **Frontend Pit Wall** | Next.js, React, TypeScript, TailwindCSS, Chart.js / Recharts | `Próximo` ⏳ |
| **Semana 3** | **Telemetria Streamer** | Node.js, Express / NestJS, WebSockets, MySQL | `Pendente` 🎯 |
| **Semana 4** | **Predictive AI Engine** | Python, FastAPI, Scikit-Learn, Pandas | `Pendente` 🎯 |
| **Semana 5** | **Infraestrutura & DevOps** | Docker, Docker Compose, GitHub Actions CI/CD, AWS | `Pendente` 🎯 |

---

## ✅ O Que Já Foi Feito (Concluído)

### 🏎️ Semana 1: Core Championship (`services/core-championship`)
- **Arquitetura de Domínio F1:**
  - `Team`: Cadastro de escuderias (Scuderia Ferrari, Red Bull Racing, McLaren, etc.).
  - `Driver`: Pilotos com identificadores únicos da FIA, números permanentes e dados biométricos.
  - `Circuit`: Circuito, extensão em quilômetros, localização e contagem de voltas.
  - `Race`: Agendamento de Grandes Prêmios por temporada e rodada.
  - `RaceResult`: Resultados oficiais das corridas, posições de largada/chegada e tempos de volta rápida.
- **Regras de Negócio Oficiais da FIA F1:**
  - Calculadora de Pontuação [F1PointsCalculator](services/core-championship/src/main/java/com/pitstopengine/core/service/F1PointsCalculator.java): Pontuação oficial (25, 18, 15, 12, 10, 8, 6, 4, 2, 1).
  - Regra de +1 ponto de bônus por **Volta Mais Rápida** (*Fastest Lap*) exclusivamente para pilotos que terminam no Top 10.
  - Cálculo dinâmico e em tempo real das tabelas de classificação de **Pilotos** e **Construtores (Equipes)** com desempate por vitórias e pódios.
- **RESTful API & Documentação Interativa:**
  - Endpoints REST completos para `/api/v1/teams`, `/api/v1/drivers`, `/api/v1/circuits`, `/api/v1/races` e `/api/v1/standings`.
  - Swagger UI e OpenAPI 3 integrados (`/swagger-ui.html`).
- **Validação & Testes:**
  - Cobertura de testes unitários com JUnit 5 e AssertJ [ChampionshipServiceTest](services/core-championship/src/test/java/com/pitstopengine/core/service/ChampionshipServiceTest.java) validados com 100% de sucesso.

---

## 🔮 O Que Vai Ser Feito (Próximas Etapas)

### 💻 Semana 2 – Frontend (Next.js + React + TypeScript)
- Portal do Campeonato: Tabelas de classificação de Pilotos/Construtores ao vivo e fichas técnicas.
- Dashboard *Pit Wall*: Gráficos interativos em tempo real exibindo a telemetria dos carros na pista.
- Design System responsivo com Dark Mode neon/carbon fiber inspirado na F1.

### 📡 Semana 3 – Telemetria (Node.js + NestJS/Express + MySQL)
- Microserviço em Node.js com WebSockets (Socket.io/WS) para ingestão de telemetria de alta frequência (Velocidade, RPM, Marcha, Desgaste de Pneus, Temperatura de Freios, ERS).
- Simulador de telemetria com streaming contínuo das voltas dos pilotos em circuito.

### 🤖 Semana 4 – Predictive AI Engine (Python + FastAPI)
- API de Machine Learning em Python (FastAPI) para predição de desgaste de pneus e momento ideal de Pit Stop (*Pit Window*).
- Algoritmos para estimativa de perda de tempo no pit lane e probabilidade de Safety Car.

### 🐳 Semana 5 – Infraestrutura & DevOps (Docker + CI/CD + AWS)
- Multi-stage Dockerfiles para otimização dos containers de todos os microserviços.
- Orquestração completa no `docker-compose.yml` (PostgreSQL, MySQL, Redis e serviços).
- Pipelines de CI/CD via GitHub Actions com testes automatizados, build e deploy na AWS.

---

## 🏗️ Estrutura do Monorepo

```text
PitStopEngineManager/
├── services/
│   ├── core-championship/   # [Semana 1] Java 21 + Spring Boot 3 + PostgreSQL (Concluído)
│   ├── telemetry/           # [Semana 3] Node.js + WebSockets + MySQL (Pendente)
│   └── predictive-ai/       # [Semana 4] Python + FastAPI + Machine Learning (Pendente)
├── frontend/                # [Semana 2] Next.js + React + TypeScript (Em Breve)
├── infra/                   # [Semana 5] Docker Compose, CI/CD GitHub Actions & AWS
└── docker-compose.yml       # Orquestração local dos containers e bancos de dados
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Java 21 LTS**
- **Apache Maven 3.9+**
- **Docker & Docker Compose**

### 1. Clonar o Repositório
```bash
git clone https://github.com/BatistaSec/PitStopEngineManager.git
cd PitStopEngineManager
```

### 2. Iniciar o Banco de Dados PostgreSQL via Docker
```bash
docker-compose up -d postgres
```

### 3. Rodar os Testes Unitários do Core Championship
```bash
cd services/core-championship
mvn clean test
```

### 4. Executar o Microserviço Spring Boot
```bash
mvn spring-boot:run
```

### 5. Acessar os Endpoints da API
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 📝 Licença

Este projeto é desenvolvido sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

👨‍💻 Desenvolvido por [BatistaSec](https://github.com/BatistaSec).
