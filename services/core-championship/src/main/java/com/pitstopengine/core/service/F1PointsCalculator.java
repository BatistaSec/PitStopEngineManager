package com.pitstopengine.core.service;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class F1PointsCalculator {

    private static final Map<Integer, Double> POSITION_POINTS = Map.of(
            1, 25.0,
            2, 18.0,
            3, 15.0,
            4, 12.0,
            5, 10.0,
            6, 8.0,
            7, 6.0,
            8, 4.0,
            9, 2.0,
            10, 1.0
    );

    public double calculatePoints(int position, boolean fastestLap, String status) {
        if (!"FINISHED".equalsIgnoreCase(status)) {
            return 0.0;
        }

        double basePoints = POSITION_POINTS.getOrDefault(position, 0.0);

        // FIA F1 Rule: Fastest lap awards +1 point only if driver finishes in Top 10
        if (fastestLap && position >= 1 && position <= 10) {
            basePoints += 1.0;
        }

        return basePoints;
    }
}
