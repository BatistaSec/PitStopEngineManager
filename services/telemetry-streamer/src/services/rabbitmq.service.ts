import amqp from 'amqplib';
import { prisma } from './prisma.service';
import { EventEmitter } from 'events';

export const telemetryEvents = new EventEmitter();

const EXCHANGE_NAME = 'f1.events';
const LAP_QUEUE = 'f1.telemetry.laps.queue';
const RACE_FINISH_QUEUE = 'f1.race.results.queue';

export async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

    // Laps Queue
    await channel.assertQueue(LAP_QUEUE, { durable: true });
    await channel.bindQueue(LAP_QUEUE, EXCHANGE_NAME, 'f1.lap.registered');

    // Race Finish Queue
    await channel.assertQueue(RACE_FINISH_QUEUE, { durable: true });
    await channel.bindQueue(RACE_FINISH_QUEUE, EXCHANGE_NAME, 'f1.race.finished');

    console.log(`[RabbitMQ] Connected and listening to queues...`);

    channel.consume(LAP_QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`[RabbitMQ] Received LapRegisteredEvent:`, content);

          const lap = await prisma.lapEvent.create({
            data: {
              raceId: content.raceId,
              driverId: content.driverId,
              driverCode: content.driverCode,
              position: content.position,
              fastestLap: content.fastestLap,
              fastestLapTime: content.fastestLapTime,
            },
          });

          telemetryEvents.emit('livetiming', lap);
          channel.ack(msg);
        } catch (err) {
          console.error('[RabbitMQ] Error processing LapRegisteredEvent:', err);
          channel.nack(msg);
        }
      }
    });

    channel.consume(RACE_FINISH_QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`[RabbitMQ] Received RaceFinishedEvent:`, content);

          const race = await prisma.raceFinishEvent.create({
            data: {
              raceId: content.raceId,
              raceName: content.raceName,
              season: content.season,
              round: content.round,
              winnerDriverCode: content.winnerDriverCode,
              winnerDriverName: content.winnerDriverName,
              winnerTeamName: content.winnerTeamName,
              totalParticipants: content.totalParticipants,
            },
          });

          telemetryEvents.emit('livetiming', race);
          channel.ack(msg);
        } catch (err) {
          console.error('[RabbitMQ] Error processing RaceFinishedEvent:', err);
          channel.nack(msg);
        }
      }
    });

  } catch (error) {
    console.error(`[RabbitMQ] Failed to connect:`, error);
    setTimeout(connectRabbitMQ, 5000);
  }
}
