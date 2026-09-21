package com.pitstopengine.core.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxService {

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    /**
     * Creates an Outbox Event and persists it.
     * Bound to the BEFORE_COMMIT phase so it participates in the current transaction.
     */
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleDomainEvent(DomainEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event.getPayload());
            
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType(event.getAggregateType())
                    .aggregateId(event.getAggregateId())
                    .eventType(event.getEventType())
                    .payload(payload)
                    .createdAt(LocalDateTime.now())
                    .build();
                    
            outboxEventRepository.save(outboxEvent);
            log.debug("Persisted outbox event: {} for aggregate: {}", event.getEventType(), event.getAggregateId());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize domain event payload for outbox", e);
            throw new RuntimeException("Serialization failure", e);
        }
    }
}
