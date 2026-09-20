import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRabbitMQ, telemetryEvents } from './services/rabbitmq.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Endpoint for SSE Livetiming
app.get('/api/v1/livetiming/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onLiveTiming = (data: any) => {
    res.write(`event: livetiming\ndata: ${JSON.stringify(data)}\n\n`);
  };

  telemetryEvents.on('livetiming', onLiveTiming);

  req.on('close', () => {
    telemetryEvents.off('livetiming', onLiveTiming);
    res.end();
  });
});

// Live Telemetry SSE endpoint
app.get('/api/v1/telemetry/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onTelemetry = (data: any) => {
    res.write(`event: telemetry\ndata: ${JSON.stringify(data)}\n\n`);
  };

  telemetryEvents.on('high_freq_telemetry', onTelemetry);

  req.on('close', () => {
    telemetryEvents.off('high_freq_telemetry', onTelemetry);
    res.end();
  });
});

// Ingest endpoint for Race Simulator (receives REAL FastF1 data)
app.post('/api/v1/telemetry/ingest', (req: Request, res: Response) => {
  const telemetryData = req.body;
  // Broadcast to all connected SSE clients
  telemetryEvents.emit('high_freq_telemetry', telemetryData);
  res.json({ status: 'ingested' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`[Express] Telemetry Streamer running on port ${PORT}`);
  connectRabbitMQ();
});
