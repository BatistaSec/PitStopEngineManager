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

// Mocked high-frequency telemetry for demonstration purposes (since core doesn't publish this yet)
app.get('/api/v1/telemetry/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const drivers = ['VER', 'LEC', 'NOR', 'HAM'];

  const intervalId = setInterval(() => {
    const data = drivers.map(driverCode => ({
      driverCode,
      speed: Math.floor(Math.random() * (340 - 200 + 1) + 200),
      engineRpm: Math.floor(Math.random() * (12000 - 8000 + 1) + 8000),
      brakeTemp: Math.floor(Math.random() * (1000 - 400 + 1) + 400),
      ersLevel: Math.floor(Math.random() * 100),
      tireWear: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    }));
    
    // In a real app, this might also be saved to prisma, but it's too high frequency for this demo
    res.write(`event: telemetry\ndata: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`[Express] Telemetry Streamer running on port ${PORT}`);
  connectRabbitMQ();
});
