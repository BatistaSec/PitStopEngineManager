package com.pitstopengine.core.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceResultRequestDTO {

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Position is required")
    private Integer position;

    private Integer gridPosition;

    private String status; // FINISHED, DNF, DSQ, DNS

    private Boolean fastestLap;

    private String fastestLapTime;
}
