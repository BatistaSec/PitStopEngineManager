package com.pitstopengine.core.saga;

public interface SagaStep<T> {

    /**
     * Executes the current step of the saga.
     */
    void execute(T context);

    /**
     * Compensates (rolls back) the current step if a subsequent step fails.
     */
    void compensate(T context);
}
