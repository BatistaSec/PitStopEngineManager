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
  
  // 1. Broadcast to high frequency telemetry clients (PitWall)
  telemetryEvents.emit('high_freq_telemetry', telemetryData);

  // 2. Build and broadcast live timing structure for LiveTiming Tower & Overview
  if (Array.isArray(telemetryData) && telemetryData.length > 0) {
    const currentLap = Math.floor(Math.random() * 5) + 15; // Lap around 15-20
    const liveTimingPayload = {
      timestamp: Date.now(),
      currentLap: currentLap,
      totalLaps: 57,
      trackStatus: 'GREEN',
      sessionTime: '1:31.245',
      timing: telemetryData.map((driver: any, idx: number) => ({
        position: idx + 1,
        number: driver.driverCode === 'VER' ? '1' : driver.driverCode === 'LEC' ? '16' : driver.driverCode === 'NOR' ? '4' : '44',
        code: driver.driverCode,
        driver: driver.driverCode === 'VER' ? 'Max Verstappen' : driver.driverCode === 'LEC' ? 'Charles Leclerc' : driver.driverCode === 'NOR' ? 'Lando Norris' : 'Lewis Hamilton',
        team: driver.driverCode === 'VER' ? 'Red Bull Racing' : driver.driverCode === 'LEC' ? 'Scuderia Ferrari' : driver.driverCode === 'NOR' ? 'McLaren F1 Team' : 'Mercedes AMG',
        gap: idx === 0 ? 'LEADER' : `+${(idx * 2.412).toFixed(3)}s`,
        interval: idx === 0 ? '-' : `+${(2.412).toFixed(3)}s`,
        lastLap: '1:36.512',
        bestLap: '1:34.288',
        s1: '29.1',
        s1Color: 'GREEN',
        s2: '39.8',
        s2Color: 'PURPLE',
        s3: '24.6',
        s3Color: 'GREEN',
        tyre: idx % 2 === 0 ? 'SOFT' : 'MEDIUM',
        tyreAge: currentLap,
        pits: 1,
        status: 'TRACK'
      }))
    };
    telemetryEvents.emit('livetiming', liveTimingPayload);
  }

  res.json({ status: 'ingested' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`[Express] Telemetry Streamer running on port ${PORT}`);
  connectRabbitMQ();
});
