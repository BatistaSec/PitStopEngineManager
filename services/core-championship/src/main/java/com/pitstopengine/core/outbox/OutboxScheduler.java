package com.pitstopengine.core.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxScheduler {

    private final OutboxEventRepository outboxEventRepository;
    private final RabbitTemplate rabbitTemplate;
    
    // Topic exchange name
    private static final String EXCHANGE_NAME = "f1.events";

    /**
     * Polls the outbox table every 2 seconds and dispatches events.
     */
    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void processOutboxEvents() {
        List<OutboxEvent> events = outboxEventRepository.findTop50ByOrderByCreatedAtAsc();
        
        if (events.isEmpty()) {
            return;
        }
        
        log.info("Processing {} outbox events...", events.size());
        
        for (OutboxEvent event : events) {
            try {
                // Publish to RabbitMQ using the eventType as routing key
                rabbitTemplate.convertAndSend(EXCHANGE_NAME, event.getEventType(), event.getPayload());
                
                // If successful, remove from the outbox
                outboxEventRepository.delete(event);
            } catch (Exception e) {
                log.error("Failed to dispatch outbox event id: {}. Will retry next polling cycle.", event.getId(), e);
                // We break the loop or continue depending on strict ordering needs.
                // For now, continue to others.
            }
        }
    }
}
