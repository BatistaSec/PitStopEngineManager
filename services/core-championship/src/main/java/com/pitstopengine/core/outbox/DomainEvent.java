package com.pitstopengine.core.outbox;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DomainEvent {
    private String aggregateType;
    private String aggregateId;
    private String eventType;
    private Object payload;
}
