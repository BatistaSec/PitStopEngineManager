package com.pitstopengine.core.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "f1.events";

    public static final String RACE_FINISHED_QUEUE = "f1.race.results.queue";
    public static final String LAP_REGISTERED_QUEUE = "f1.telemetry.laps.queue";

    public static final String RACE_FINISHED_ROUTING_KEY = "f1.race.finished";
    public static final String LAP_REGISTERED_ROUTING_KEY = "f1.lap.registered";

    @Bean
    public TopicExchange f1EventsExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue raceFinishedQueue() {
        return QueueBuilder.durable(RACE_FINISHED_QUEUE).build();
    }

    @Bean
    public Queue lapRegisteredQueue() {
        return QueueBuilder.durable(LAP_REGISTERED_QUEUE).build();
    }

    @Bean
    public Binding raceFinishedBinding(Queue raceFinishedQueue, TopicExchange f1EventsExchange) {
        return BindingBuilder.bind(raceFinishedQueue).to(f1EventsExchange).with(RACE_FINISHED_ROUTING_KEY);
    }

    @Bean
    public Binding lapRegisteredBinding(Queue lapRegisteredQueue, TopicExchange f1EventsExchange) {
        return BindingBuilder.bind(lapRegisteredQueue).to(f1EventsExchange).with(LAP_REGISTERED_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
