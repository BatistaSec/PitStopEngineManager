package com.pitstopengine.core.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Telemetry SSE", description = "Server-Sent Events para telemetria em tempo real e Live Timing")
public class TelemetrySSEController {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final Random random = new Random();

    // Real F1 2026 grid drivers
    private static final String[][] DRIVERS = {
        {"1", "VER", "Max Verstappen", "Red Bull Racing", "MEDIUM"},
        {"4", "NOR", "Lando Norris", "McLaren", "SOFT"},
        {"16", "LEC", "Charles Leclerc", "Ferrari", "MEDIUM"},
        {"44", "HAM", "Lewis Hamilton", "Ferrari", "HARD"},
        {"63", "RUS", "George Russell", "Mercedes", "MEDIUM"},
        {"81", "PIA", "Oscar Piastri", "McLaren", "SOFT"},
        {"11", "PER", "Sergio Pérez", "Red Bull Racing", "HARD"},
        {"14", "ALO", "Fernando Alonso", "Aston Martin", "MEDIUM"},
        {"55", "SAI", "Carlos Sainz", "Williams", "SOFT"},
        {"10", "GAS", "Pierre Gasly", "Alpine", "MEDIUM"},
        {"23", "ALB", "Alexander Albon", "Williams", "MEDIUM"},
        {"27", "HUL", "Nico Hülkenberg", "Sauber", "HARD"},
        {"22", "TSU", "Yuki Tsunoda", "RB", "SOFT"},
        {"18", "STR", "Lance Stroll", "Aston Martin", "MEDIUM"},
        {"77", "BOT", "Valtteri Bottas", "Sauber", "HARD"},
        {"2", "SAR", "Logan Sargeant", "RB", "MEDIUM"},
        {"24", "ZHO", "Guanyu Zhou", "Stake F1", "MEDIUM"},
        {"20", "MAG", "Kevin Magnussen", "Haas", "HARD"},
        {"87", "BEA", "Oliver Bearman", "Haas", "SOFT"},
        {"31", "OCO", "Esteban Ocon", "Alpine", "MEDIUM"},
    };

    @GetMapping(value = "/telemetry/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream de telemetria SSE (velocidade, RPM, pneus, ERS, freios)")
    public SseEmitter streamTelemetry() {
        SseEmitter emitter = new SseEmitter(300_000L); // 5 min timeout

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(() -> {
            try {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("timestamp", System.currentTimeMillis());
                data.put("speed", 280 + random.nextInt(60));
                data.put("rpm", 10000 + random.nextInt(5000));
                data.put("throttle", 70 + random.nextInt(30));
                data.put("brake", random.nextInt(100));
                data.put("gear", 4 + random.nextInt(5));
                data.put("ersDeployment", 30 + random.nextInt(70));
                data.put("ersHarvest", 10 + random.nextInt(40));
                data.put("batteryCharge", 20 + random.nextInt(80));
                data.put("tyreWearFL", 5 + random.nextInt(40));
                data.put("tyreWearFR", 5 + random.nextInt(40));
                data.put("tyreWearRL", 5 + random.nextInt(40));
                data.put("tyreWearRR", 5 + random.nextInt(40));
                data.put("brakeTempFL", 200 + random.nextInt(800));
                data.put("brakeTempFR", 200 + random.nextInt(800));
                data.put("brakeTempRL", 200 + random.nextInt(800));
                data.put("brakeTempRR", 200 + random.nextInt(800));
                data.put("fuelLoad", 50 + random.nextDouble() * 60);
                data.put("drsActive", random.nextBoolean());
                data.put("lapNumber", 1 + random.nextInt(55));
                data.put("sector", 1 + random.nextInt(3));

                emitter.send(SseEmitter.event()
                        .name("telemetry")
                        .data(data));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }, 0, 1000, TimeUnit.MILLISECONDS);

        emitter.onCompletion(() -> future.cancel(true));
        emitter.onTimeout(() -> { future.cancel(true); emitter.complete(); });
        emitter.onError(e -> future.cancel(true));

        return emitter;
    }

    @GetMapping(value = "/livetiming/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream de Live Timing SSE (posições, gaps, voltas, setores)")
    public SseEmitter streamLiveTiming() {
        SseEmitter emitter = new SseEmitter(300_000L);

        // Mutable state for this SSE connection to simulate evolving race
        final int[] currentLap = {1 + random.nextInt(10)};

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(() -> {
            try {
                List<Map<String, Object>> timing = new ArrayList<>();
                double cumulativeGap = 0;

                for (int i = 0; i < DRIVERS.length; i++) {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("position", i + 1);
                    entry.put("number", DRIVERS[i][0]);
                    entry.put("code", DRIVERS[i][1]);
                    entry.put("driver", DRIVERS[i][2]);
                    entry.put("team", DRIVERS[i][3]);

                    // Gap calculation
                    if (i == 0) {
                        entry.put("gap", "LEADER");
                        entry.put("interval", "—");
                    } else {
                        double interval = 0.2 + random.nextDouble() * 2.5;
                        cumulativeGap += interval;
                        entry.put("gap", String.format("+%.3f", cumulativeGap));
                        entry.put("interval", String.format("+%.3f", interval));
                    }

                    // Lap time (realistic ~1:20-1:35 range)
                    int mins = 1;
                    int secs = 18 + random.nextInt(17);
                    int millis = random.nextInt(1000);
                    String lapTime = String.format("%d:%02d.%03d", mins, secs, millis);
                    entry.put("lastLap", lapTime);

                    // Best lap
                    int bestSecs = 18 + random.nextInt(5);
                    int bestMillis = random.nextInt(1000);
                    entry.put("bestLap", String.format("1:%02d.%03d", bestSecs, bestMillis));

                    // Sector times with color coding (PURPLE=personal best, GREEN=session best, YELLOW=normal)
                    String[] sectorColors = {"YELLOW", "GREEN", "PURPLE"};
                    for (int s = 1; s <= 3; s++) {
                        double sectorTime = 24.0 + random.nextDouble() * 8.0;
                        entry.put("s" + s, String.format("%.3f", sectorTime));
                        entry.put("s" + s + "Color", sectorColors[random.nextInt(3)]);
                    }

                    // Tyre compound
                    String[] compounds = {"SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"};
                    entry.put("tyre", compounds[random.nextInt(3)]); // mostly dry conditions
                    entry.put("tyreAge", random.nextInt(25));
                    entry.put("pits", random.nextInt(3));

                    // Status flags
                    String[] statuses = {"TRACK", "TRACK", "TRACK", "TRACK", "PIT", "OUT"};
                    entry.put("status", statuses[random.nextInt(statuses.length)]);

                    timing.add(entry);
                }

                Map<String, Object> payload = new LinkedHashMap<>();
                payload.put("timestamp", System.currentTimeMillis());
                payload.put("currentLap", currentLap[0]);
                payload.put("totalLaps", 55);
                payload.put("trackStatus", random.nextInt(20) < 18 ? "GREEN" : (random.nextBoolean() ? "YELLOW" : "VSC"));
                payload.put("sessionTime", LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
                payload.put("timing", timing);

                // Slowly advance laps
                if (random.nextInt(3) == 0 && currentLap[0] < 55) {
                    currentLap[0]++;
                }

                emitter.send(SseEmitter.event()
                        .name("livetiming")
                        .data(payload));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }, 0, 1500, TimeUnit.MILLISECONDS);

        emitter.onCompletion(() -> future.cancel(true));
        emitter.onTimeout(() -> { future.cancel(true); emitter.complete(); });
        emitter.onError(e -> future.cancel(true));

        return emitter;
    }
}
