package com.pitstopengine.core.saga;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RaceTerminationSaga implements SagaStep<String> {

    @Override
    public void execute(String raceId) {
        log.info("Executing Race Termination Saga for Race: {}", raceId);
        // TODO: Lock race status, compute final standings, publish event
    }

    @Override
    public void compensate(String raceId) {
        log.warn("Compensating Race Termination Saga for Race: {}. Reverting to active state.", raceId);
        // TODO: Unlock race status, revert standings computation
    }
}
