package com.pitstopengine.core.service;

import com.pitstopengine.core.config.RabbitMQConfig;
import com.pitstopengine.core.event.LapRegisteredEvent;
import com.pitstopengine.core.event.RaceFinishedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RabbitMQEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishRaceFinishedEvent(RaceFinishedEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.RACE_FINISHED_ROUTING_KEY,
                    event
            );
            log.info("📢 [RabbitMQ] Evento RaceFinishedEvent publicado com sucesso para a corrida ID: {}", event.getRaceId());
        } catch (Exception e) {
            log.warn("⚠️ [RabbitMQ] Não foi possível publicar RaceFinishedEvent (RabbitMQ offline): {}", e.getMessage());
        }
    }

    public void publishLapRegisteredEvent(LapRegisteredEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.LAP_REGISTERED_ROUTING_KEY,
                    event
            );
            log.info("📢 [RabbitMQ] Evento LapRegisteredEvent publicado para piloto: {}", event.getDriverCode());
        } catch (Exception e) {
            log.warn("⚠️ [RabbitMQ] Não foi possível publicar LapRegisteredEvent (RabbitMQ offline): {}", e.getMessage());
        }
    }
}
