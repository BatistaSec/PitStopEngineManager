package com.pitstopengine.core.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceResultResponseDTO {
    private Long id;
    private Long raceId;
    private String raceName;
    private Long driverId;
    private String driverName;
    private String driverCode;
    private Integer permanentNumber;
    private String teamName;
    private Integer position;
    private Integer gridPosition;
    private Double points;
    private String status;
    private Boolean fastestLap;
    private String fastestLapTime;
}
