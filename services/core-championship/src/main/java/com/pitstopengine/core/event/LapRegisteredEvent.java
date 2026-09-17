package com.pitstopengine.core.event;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LapRegisteredEvent implements Serializable {
    private Long raceId;
    private Long driverId;
    private String driverCode;
    private Integer position;
    private Boolean fastestLap;
    private String fastestLapTime;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
