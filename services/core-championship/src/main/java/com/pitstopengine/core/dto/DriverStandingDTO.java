package com.pitstopengine.core.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverStandingDTO {
    private Integer rank;
    private Long driverId;
    private String driverCode;
    private String driverName;
    private Integer permanentNumber;
    private String teamName;
    private Double totalPoints;
    private Integer wins;
    private Integer podiums;
}
