package com.pitstopengine.core.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamStandingDTO {
    private Integer rank;
    private Long teamId;
    private String teamName;
    private String country;
    private Double totalPoints;
    private Integer wins;
    private Integer podiums;
}
