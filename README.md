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

O **PitStopEngine** ([BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)) é uma **Engine de Simulação e Telemetria em Alta Escala** com arquitetura de Missão Crítica. 

Ele lida com telemetria em altíssima frequência (20 Hz por carro) utilizando padrões de engenharia de software avançados (CQRS, Outbox Pattern, Micro-batching, Web Workers) para fornecer uma experiência incrivelmente rápida e robusta, similar às tecnologias usadas em equipes reais.

📍 **Repositório Oficial:** [github.com/BatistaSec/PitStopEngineManager](https://github.com/BatistaSec/PitStopEngineManager)

---

## 🎮 O que este projeto faz na prática?

Imagine que você é o engenheiro chefe de uma equipe de Fórmula 1, sentado no "Pit Wall" (aquele painel cheio de monitores na beira da pista).
- **O que você vê:** Um painel bonito e rápido desenhado a 60 FPS mostrando os gráficos do carro (velocidade, freios, pneus) ao vivo, além da tabela de classificação de todos os pilotos.
- **O que acontece por trás das câmeras:** Os carros geram centenas de informações por segundo. Nosso sistema recebe tudo isso via WebSockets, organiza em lotes para não travar os servidores, arquiva de forma segura, analisa usando **Simulações de Inteligência Artificial** para prever a hora certa de fazer um pit stop e despacha para a sua tela instantaneamente.

---

## 🏗️ Arquitetura de Missão Crítica (Para que serve cada ferramenta?)

Nós dividimos esse sistema em partes menores, usando padrões de nível Sênior/Arquiteto para suportar uma carga absurda de dados sem travar:

* **🖼️ Next.js, Web Workers e Canvas API (A Interface Visual - Frontend)**
  * **O que faz:** É o "Pit Wall". Para não travar seu navegador recebendo milhares de dados por segundo, o site delega a matemática pesada (parsing) para um **Web Worker** invisível e desenha a pista usando **Canvas API nativa** a 60 FPS, ignorando os travamentos comuns de sites tradicionais.
* **⚙️ Java e Spring Boot (O Cérebro Seguro - Backend)**
  * **O que faz:** O "juiz intocável" do campeonato. Ele usa o padrão de **Sagas** para garantir que uma penalidade ou Safety Car seja aplicada corretamente. Além disso, usa o **Outbox Pattern**: sempre que ele salva algo no banco, ele garante 100% de certeza que o resto do sistema será avisado, sem nunca perder uma mensagem (Consistência Distribuída).
* **📡 Node.js e WebSockets (A Turbina de Ingestão - Telemetria Streamer)**
  * **O que faz:** Um aspirador de dados super potente. Ele recebe a telemetria via WebSockets e usa **Micro-batching** e **Backpressure**: em vez de se engasgar processando dado por dado, ele agrupa milhares de dados em pequenos pacotes de 100ms e os joga adiante, garantindo que a memória RAM do servidor nunca estoure.
* **🧠 Python e FastAPI (A Inteligência Artificial Preditiva)**
  * **O que faz:** Trabalha como um "estrategista matemático". Ele roda **Simulações de Monte Carlo** — testando 10.000 cenários de pit stops simultâneos a cada evento na pista — e usa **Rolling Windows** no Pandas para detectar imediatamente se um pneu está furando com base na queda de pressão.
* **🐰 RabbitMQ (O Correio Expresso - Mensageria)**
  * **O que faz:** É o sistema nervoso central. Todos os sistemas acima conversam por aqui usando canais de alta velocidade (*Topic Exchanges*), garantindo que a comunicação entre o Java, Node e Python flua em milissegundos.
* **🗄️ PostgreSQL e MySQL (Os Armazéns - CQRS)**
  * **O que faz:** Aplicamos o padrão **CQRS** (Separação de Leitura e Escrita). O **PostgreSQL** é o cofre ultra-seguro para gravar dados oficiais (Command), enquanto o **MySQL** armazena cópias desnormalizadas focadas 100% em leitura rápida (Query).
* **🐳 Docker e Docker Compose (A Caixa de Ferramentas)**
  * **O que faz:** Empacota toda essa infraestrutura complexa em "contêineres digitais". Você roda um único comando, e ele liga todos os motores para você perfeitamente.

---

## 🚀 Como Executar o Projeto no Seu Computador (Passo a Passo Leigo)

Para rodar este projeto na sua máquina local, você precisa ter instalado:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Mantenha o aplicativo aberto no Windows!)*
2. [Node.js](https://nodejs.org/) *(Necessário para rodar a página web)*
3. [Java 21](https://adoptium.net/) e o Maven *(Necessário para rodar o cérebro do sistema)*

### Passo 1: Ligar a infraestrutura (Bancos de Dados e RabbitMQ)
Abra o seu terminal (Prompt de Comando ou PowerShell) na pasta principal do projeto e digite:
```bash
docker-compose up -d
```
*💡 O que isso faz? Liga os bancos de dados e o sistema de mensagens escondido em segundo plano.*

### Passo 2: Ligar o Cérebro (Sistema de Gestão - Java)
Abra um **novo terminal** na mesma pasta principal e digite:
```bash
cd services/core-championship
mvn spring-boot:run
```
*💡 O que isso faz? Liga o sistema que controla as equipes e pilotos.*

### Passo 3: Ligar a Turbina de Ingestão (Node.js)
Abra um **terceiro terminal** na pasta principal e digite:
```bash
cd services/telemetry-streamer
npm install
npx prisma db push
npx tsx src/index.ts
```
*💡 O que isso faz? Liga o Micro-batching que vai processar os dados massivos sem travar.*

### Passo 4: Ligar o Visual de Alta Performance (Next.js)
Abra um **quarto terminal** na pasta principal e digite:
```bash
cd frontend
npm install
npm run dev
```
*💡 O que isso faz? Liga a interface do site no seu computador!*

📍 **Tudo pronto! Agora acesse no seu navegador o endereço:** [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Progresso do Projeto (Roadmap)

Aqui você consegue ver o andamento da construção de cada parte:

| Semana | Parte do Sistema | Tecnologias Usadas | Status |
| :--- | :--- | :--- | :---: |
| **Semana 1** | **Cérebro Principal e Outbox** | Java 21, Spring Boot, RabbitMQ, PostgreSQL | `Concluído` ✅ |
| **Semana 2** | **O Site (Painel Pit Wall 60FPS)** | Next.js, React, TailwindCSS, Canvas API | `Concluído` ✅ |
| **Semana 3** | **Sistema de Transmissão (Micro-batching)** | Node.js, Express, WebSockets, MySQL | `Concluído` ✅ |
| **Semana 4** | **Motor de Inteligência (Monte Carlo)** | Python, FastAPI, Pandas | `Concluído` ✅ |
| **Semana 5** | **Infraestrutura e Nuvem (DevOps)** | Docker, GitHub Actions, Nuvem AWS | `Atual` ⏳ |

---

## 📚 Documentação para Programadores (APIs REST)

*(Rotas disponíveis no sistema Core)*

### 1. Autenticação e Usuários (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Cadastro de usuários (Administrador / Comum).
- `POST /api/v1/auth/login`: Fazer login e receber a chave de segurança (Token JWT).

### 2. Gestão de Equipes (`/api/v1/teams`)
- `GET /api/v1/teams`: Ver a lista de equipes abertamente.
- `POST /api/v1/teams`: Adicionar nova equipe (Apenas Administradores).

### 3. Gestão de Pilotos (`/api/v1/drivers`)
- `GET /api/v1/drivers`: Ver a lista de pilotos abertamente.
- `POST /api/v1/drivers`: Adicionar novo piloto (Apenas Administradores).

### 4. Transmissão Ao Vivo (`/ws/telemetry`)
- `WS /ws/telemetry`: Conexão WebSocket de baixa latência para renderização na Canvas API.

### 5. Sistema de Classificação (`/api/v1/standings`)
- `GET /api/v1/standings/drivers?season=2026`: Tabela oficial de classificação dos pilotos.
- `GET /api/v1/standings/teams?season=2026`: Tabela oficial de construtores (Equipes).

---

## 📝 Licença

Este projeto é desenvolvido sob a licença **MIT** (Código aberto para uso). Veja o arquivo `LICENSE` para mais detalhes.

👨‍💻 Desenvolvido por [BatistaSec](https://github.com/BatistaSec).
