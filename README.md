# 🏎️ PitStopEngine — Plataforma Distribuída de Telemetria e Gestão de F1

[![Repository](https://img.shields.io/badge/GitHub-BatistaSec%2FPitStopEngineManager-181717?logo=github)](https://github.com/BatistaSec/PitStopEngineManager)
[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

O **PitStopEngine** ([BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)) é uma plataforma de alta performance desenvolvida em arquitetura distribuída de microserviços. O sistema combina gestão oficial de campeonatos de Fórmula 1, autenticação JWT via Spring Security 6, mensageria de eventos em tempo real com RabbitMQ e dashboards dinâmicos no estilo *Pit Wall*.

📍 **Repositório Oficial:** [github.com/BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)

---

## 🗺️ Roadmap de Desenvolvimento (5 Semanas)

| Semana | Módulo / Serviço | Tecnologias | Status |
| :--- | :--- | :--- | :---: |
| **Semana 1** | **Core Championship & Security** | Java 21, Spring Boot 3, Spring Security 6 (JWT), RabbitMQ, PostgreSQL, JUnit 5, Swagger | `Concluído` ✅ |
| **Semana 2** | **Frontend Pit Wall** | Next.js, React, TypeScript, TailwindCSS, Chart.js / Recharts | `Próximo` ⏳ |
| **Semana 3** | **Telemetria Streamer** | Node.js, Express / NestJS, WebSockets, MySQL | `Pendente` 🎯 |
| **Semana 4** | **Predictive AI Engine** | Python, FastAPI, Scikit-Learn, Pandas | `Pendente` 🎯 |
| **Semana 5** | **Infraestrutura & DevOps** | Docker, Docker Compose, GitHub Actions CI/CD, AWS | `Pendente` 🎯 |

---

## 📚 Documentação das APIs REST (`/api/v1`)

### 🔐 1. Autenticação & Usuários (`/api/v1/auth`)

#### `POST /api/v1/auth/register` — Registrar Novo Usuário
- **Permissão:** Pública
- **Payload Request:**
  ```json
  {
    "username": "admin_f1",
    "email": "admin@pitstopengine.com",
    "password": "supersecretpassword",
    "role": "ROLE_ADMIN"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "username": "admin_f1",
    "role": "ROLE_ADMIN"
  }
  ```

#### `POST /api/v1/auth/login` — Autenticar & Obter Token JWT
- **Permissão:** Pública
- **Payload Request:**
  ```json
  {
    "username": "admin_f1",
    "password": "supersecretpassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "username": "admin_f1",
    "role": "ROLE_ADMIN"
  }
  ```

---

### 🏎️ 2. Escuderias / Teams (`/api/v1/teams`)

#### `GET /api/v1/teams` — Listar Todas as Escuderias
- **Permissão:** Pública
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Scuderia Ferrari",
      "country": "Italy",
      "baseLocation": "Maranello",
      "powerUnit": "Ferrari"
    }
  ]
  ```

#### `GET /api/v1/teams/{id}` — Obter Escuderia por ID
- **Permissão:** Pública

#### `POST /api/v1/teams` — Cadastrar Nova Escuderia
- **Permissão:** Requer Token JWT Bearer (`ROLE_ADMIN`)
- **Header:** `Authorization: Bearer <TOKEN>`
- **Payload Request:**
  ```json
  {
    "name": "Red Bull Racing",
    "country": "Austria",
    "baseLocation": "Milton Keynes",
    "powerUnit": "Honda RBPT"
  }
  ```

---

### 👤 3. Pilotos / Drivers (`/api/v1/drivers`)

#### `GET /api/v1/drivers` — Listar Todos os Pilotos
- **Permissão:** Pública

#### `POST /api/v1/drivers` — Cadastrar Novo Piloto
- **Permissão:** Requer Token JWT Bearer (`ROLE_ADMIN`)
- **Header:** `Authorization: Bearer <TOKEN>`
- **Payload Request:**
  ```json
  {
    "code": "LEC",
    "permanentNumber": 16,
    "firstName": "Charles",
    "lastName": "Leclerc",
    "nationality": "Monaco",
    "teamId": 1
  }
  ```

---

### 🏁 4. Circuitos / Circuits (`/api/v1/circuits`)

#### `GET /api/v1/circuits` — Listar Todos os Circuitos
- **Permissão:** Pública

#### `POST /api/v1/circuits` — Cadastrar Novo Circuito
- **Permissão:** Requer Token JWT Bearer (`ROLE_ADMIN`)
- **Payload Request:**
  ```json
  {
    "name": "Autódromo José Carlos Pace",
    "location": "São Paulo",
    "country": "Brazil",
    "lengthKm": 4.309,
    "laps": 71
  }
  ```

---

### 🏆 5. Grandes Prêmios & Resultados (`/api/v1/races`)

#### `GET /api/v1/races?season=2026` — Listar Corridas da Temporada
- **Permissão:** Pública

#### `POST /api/v1/races` — Agendar Novo GP
- **Permissão:** Requer Token JWT Bearer (`ROLE_ADMIN`)
- **Payload Request:**
  ```json
  {
    "season": 2026,
    "round": 1,
    "name": "GP de São Paulo",
    "date": "2026-11-08",
    "circuitId": 1
  }
  ```

#### `POST /api/v1/races/{raceId}/results` — Registrar Resultados da Corrida & Disparar Eventos RabbitMQ
- **Permissão:** Requer Token JWT Bearer (`ROLE_ADMIN`)
- **Efeitos Colaterais:**
  - Calcula a pontuação oficial da FIA F1 (25-18-15... + 1 ponto de volta rápida para Top 10).
  - Publica o evento `RaceFinishedEvent` na fila `f1.race.results.queue`.
  - Publica eventos `LapRegisteredEvent` na fila `f1.telemetry.laps.queue`.
- **Payload Request:**
  ```json
  [
    {
      "driverId": 1,
      "position": 1,
      "gridPosition": 1,
      "fastestLap": true,
      "fastestLapTime": "1:10.540",
      "status": "FINISHED"
    },
    {
      "driverId": 2,
      "position": 2,
      "gridPosition": 2,
      "fastestLap": false,
      "status": "FINISHED"
    }
  ]
  ```

---

### 📊 6. Tabelas de Classificação / Standings (`/api/v1/standings`)

#### `GET /api/v1/standings/drivers?season=2026` — Classificação Oficial de Pilotos
- **Permissão:** Pública
- **Response (200 OK):**
  ```json
  [
    {
      "rank": 1,
      "driverId": 1,
      "driverCode": "LEC",
      "driverName": "Charles Leclerc",
      "permanentNumber": 16,
      "teamName": "Scuderia Ferrari",
      "totalPoints": 26.0,
      "wins": 1,
      "podiums": 1
    }
  ]
  ```

#### `GET /api/v1/standings/teams?season=2026` — Classificação Oficial de Construtores
- **Permissão:** Pública
- **Response (200 OK):**
  ```json
  [
    {
      "rank": 1,
      "teamId": 1,
      "teamName": "Scuderia Ferrari",
      "country": "Italy",
      "totalPoints": 26.0,
      "wins": 1,
      "podiums": 1
    }
  ]
  ```

---

## 🐇 Arquitetura de Eventos em Tempo Real (RabbitMQ)

- **Painel de Gerenciamento Web:** `http://localhost:15672` (Credenciais: `guest`/`guest`)
- **Topic Exchange:** `f1.events`

| Evento | Fila (Queue) | Routing Key | Payload de Exemplo |
| :--- | :--- | :--- | :--- |
| **`RaceFinishedEvent`** | `f1.race.results.queue` | `f1.race.finished` | `{ "raceId": 1, "raceName": "GP de SP", "winnerDriverCode": "LEC", "winnerTeamName": "Ferrari" }` |
| **`LapRegisteredEvent`** | `f1.telemetry.laps.queue` | `f1.lap.registered` | `{ "raceId": 1, "driverCode": "LEC", "fastestLap": true, "fastestLapTime": "1:10.540" }` |

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

### 2. Iniciar PostgreSQL & RabbitMQ via Docker
```bash
docker-compose up -d
```

### 3. Rodar a Suíte Completa de Testes
```bash
cd services/core-championship
mvn clean test
```

### 4. Executar a Aplicação Spring Boot
```bash
# Execução Padrão (PostgreSQL)
mvn spring-boot:run

# Execução Dev Fallback (H2 em memória)
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### 5. Acessar a Documentação Interativa
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Painel RabbitMQ:** [http://localhost:15672](http://localhost:15672)

---

## 📝 Licença

Este projeto é desenvolvido sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

👨‍💻 Desenvolvido por [BatistaSec](https://github.com/BatistaSec).
