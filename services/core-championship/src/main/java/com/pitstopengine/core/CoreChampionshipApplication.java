package com.pitstopengine.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CoreChampionshipApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoreChampionshipApplication.class, args);
    }
}
