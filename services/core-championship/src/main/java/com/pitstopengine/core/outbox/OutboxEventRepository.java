package com.pitstopengine.core.outbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {
    
    // Fetch a batch of events to process
    List<OutboxEvent> findTop50ByOrderByCreatedAtAsc();
}
