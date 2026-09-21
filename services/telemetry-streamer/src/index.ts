import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { connectRabbitMQ, telemetryEvents, getRabbitChannel } from './services/rabbitmq.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/telemetry' });

const PORT = process.env.PORT || 3001;

// --- WebSockets Connection Management ---
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('[WebSocket] Client disconnected');
  });
});

// Broadcast helper
const broadcastWs = (event: string, data: any) => {
  const message = JSON.stringify({ event, data });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

// Listen to RabbitMQ events and broadcast
telemetryEvents.on('livetiming', (data) => broadcastWs('livetiming', data));
telemetryEvents.on('high_freq_telemetry', (data) => broadcastWs('telemetry', data));


// --- Ingestion Engine: Buffer & Micro-batching ---
const BATCH_INTERVAL_MS = 100;
let telemetryBuffer: any[] = [];

// Micro-batch processor
setInterval(() => {
  if (telemetryBuffer.length === 0) return;

  const batch = [...telemetryBuffer];
  telemetryBuffer = []; // Clear buffer

  // 1. Publish to RabbitMQ Topic Exchange (telemetry.car.{carId}.sector.{sectorId})
  const channel = getRabbitChannel();
  if (channel) {
    batch.forEach(item => {
      const routingKey = `telemetry.car.${item.driverCode}.sector.${item.sector || 1}`;
      channel.publish('f1.telemetry.topic', routingKey, Buffer.from(JSON.stringify(item)));
    });
  }

  // 2. Fast broadcast to clients
  broadcastWs('telemetry', batch);
  console.log(`[Ingestion] Processed micro-batch of ${batch.length} messages`);
}, BATCH_INTERVAL_MS);

// High-Throughput Ingestion Endpoint
app.post('/api/v1/telemetry/ingest', (req: Request, res: Response) => {
  const telemetryData = req.body;
  
  // Backpressure mechanism: Prevent memory bloat
  if (telemetryBuffer.length > 5000) {
    return res.status(429).json({ error: 'Buffer full (Backpressure applied)' });
  }

  if (Array.isArray(telemetryData)) {
    telemetryBuffer.push(...telemetryData);
  } else {
    telemetryBuffer.push(telemetryData);
  }

  res.status(202).json({ status: 'buffered' });
});


// --- CQRS Sync Worker ---
// Assuming rabbitmq.service is updated to bind to 'outbox.events' queue
telemetryEvents.on('outbox_sync', (eventPayload) => {
  console.log('[CQRS] Syncing outbox event to MySQL Read Replica:', eventPayload);
  // TODO: Use Prisma to update MySQL based on eventType and payload from Java Command Stack
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.listen(PORT, () => {
  console.log(`[Express/WS] Telemetry Streamer running on port ${PORT}`);
  connectRabbitMQ(); // Make sure this creates 'f1.telemetry.topic' exchange
});
