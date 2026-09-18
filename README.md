# 🏎️ PitStopEngine — Plataforma Distribuída de Telemetria e Gestão de F1

[![Repository](https://img.shields.io/badge/GitHub-BatistaSec%2FPitStopEngineManager-181717?logo=github)](https://github.com/BatistaSec/PitStopEngineManager)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

O **PitStopEngine** ([BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)) é uma plataforma de alta performance desenvolvida em arquitetura distribuída de microserviços. O sistema combina gestão oficial de campeonatos de Fórmula 1, um **Pit Wall Dashboard em Next.js 16**, telemetria em tempo real via WebSockets, inteligência artificial preditiva para estratégias de pit stop e segurança com JWT.

📍 **Repositório Oficial:** [github.com/BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)

---

## 🗺️ Roadmap de Desenvolvimento (5 Semanas)

| Semana | Módulo / Serviço | Tecnologias | Status |
| :--- | :--- | :--- | :---: |
| **Semana 1** | **Core Championship & Security** | Java 21, Spring Boot 3, Spring Security 6 (JWT), RabbitMQ, PostgreSQL | `Concluído` ✅ |
| **Semana 2** | **Frontend Pit Wall** | Next.js 16, React 19, TypeScript, TailwindCSS, Recharts, Lucide | `Concluído` ✅ |
| **Semana 3** | **Telemetria Streamer** | Node.js, Express / NestJS, WebSockets, MySQL | `Próximo` ⏳ |
| **Semana 4** | **Predictive AI Engine** | Python, FastAPI, Scikit-Learn, Pandas | `Pendente` 🎯 |
| **Semana 5** | **Infraestrutura & DevOps** | Docker, Docker Compose, GitHub Actions CI/CD, AWS | `Pendente` 🎯 |

---

## 💻 Semana 2: Frontend Pit Wall Dashboard (`frontend/`)

O **Pit Wall Monitor** é o painel frontal interativo do sistema desenvolvido com **Next.js 16 (App Router)** e **TailwindCSS v4**:

- **📊 Live Telemetry Monitor (Recharts):**
  - Gráficos em tempo real de Velocidade (km/h), RPM do Motor, Temperatura de Freios (°C), Nível de ERS (%) e Desgaste de Pneus (%).
  - Seletor ao vivo de pilotos de topo da F1 (Max Verstappen `#1`, Charles Leclerc `#16`, Lando Norris `#4`, Lewis Hamilton `#44`).
- **🏆 Classificação Oficial (Standings Portal):**
  - Tabelas integradas de *Driver Standings* e *Constructor Standings* conectadas em tempo real à API REST (`/api/v1/standings/drivers` e `/teams`).
- **📅 Calendário de GPs:**
  - Exibição de corridas da temporada 2026 com circuitos e status de conclusão.
- **🔑 Autenticação & Modal JWT:**
  - Login e registro de usuários com armazenamento seguro do Token JWT Bearer no `localStorage` para criação e modificação de equipes.

---

## 📚 Documentação das APIs REST (`/api/v1`)

### 🔐 1. Autenticação & Usuários (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Registro de usuários (`ROLE_ADMIN` / `ROLE_USER`).
- `POST /api/v1/auth/login`: Autenticação e emissão do Token JWT Bearer.

### 🏎️ 2. Escuderias (`/api/v1/teams`)
- `GET /api/v1/teams`: Listar escuderias (Público).
- `POST /api/v1/teams`: Cadastrar escuderia (Requer Bearer Token JWT `ROLE_ADMIN`).
- `PUT /api/v1/teams/{id}`: Atualizar escuderia (Requer Bearer Token JWT `ROLE_ADMIN`).
- `DELETE /api/v1/teams/{id}`: Remover escuderia (Requer Bearer Token JWT `ROLE_ADMIN`).

### 👤 3. Pilotos (`/api/v1/drivers`)
- `GET /api/v1/drivers`: Listar pilotos (Público).
- `POST /api/v1/drivers`: Cadastrar piloto (Requer Bearer Token JWT `ROLE_ADMIN`).
- `PUT /api/v1/drivers/{id}`: Atualizar piloto (Requer Bearer Token JWT `ROLE_ADMIN`).
- `DELETE /api/v1/drivers/{id}`: Remover piloto (Requer Bearer Token JWT `ROLE_ADMIN`).

### 📡 3.5. Telemetria e Live Timing (SSE)
- `GET /api/v1/livetiming/stream`: Stream SSE em tempo real de posições, gaps e setores (Público).
- `GET /api/v1/telemetry/stream`: Stream SSE de telemetria de alta frequência (Público).

### 🏁 4. Circuitos (`/api/v1/circuits`)
- `GET /api/v1/circuits`: Listar circuitos.
- `POST /api/v1/circuits`: Cadastrar circuito.

### 🏆 5. Corridas & Resultados (`/api/v1/races`)
- `GET /api/v1/races?season=2026`: Listar GPs da temporada.
- `POST /api/v1/races`: Cadastrar GP.
- `POST /api/v1/races/{raceId}/results`: Registrar resultados + dispara eventos no RabbitMQ.

### 📊 6. Tabelas de Classificação (`/api/v1/standings`)
- `GET /api/v1/standings/drivers?season=2026`: Classificação oficial de Pilotos.
- `GET /api/v1/standings/teams?season=2026`: Classificação oficial de Construtores.

---

## 🐇 Eventos em Tempo Real (RabbitMQ)

- **Topic Exchange:** `f1.events`
  - Fila `f1.race.results.queue` (Routing Key: `f1.race.finished`)
  - Fila `f1.telemetry.laps.queue` (Routing Key: `f1.lap.registered`)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Iniciar os Serviços Docker (PostgreSQL & RabbitMQ)
```bash
docker-compose up -d
```

### 2. Executar o Backend (Spring Boot Core Championship)
```bash
cd services/core-championship
mvn spring-boot:run
```

### 3. Executar o Frontend (Next.js Pit Wall Dashboard)
```bash
cd frontend
npm install
npm run dev
```
📍 **Acesse no navegador:** [http://localhost:3000](http://localhost:3000)

---

## 📝 Licença

Este projeto é desenvolvido sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

👨‍💻 Desenvolvido por [BatistaSec](https://github.com/BatistaSec).
