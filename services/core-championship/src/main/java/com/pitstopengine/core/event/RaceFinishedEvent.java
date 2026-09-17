package com.pitstopengine.core.event;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceFinishedEvent implements Serializable {
    private Long raceId;
    private String raceName;
    private Integer season;
    private Integer round;
    private String winnerDriverCode;
    private String winnerDriverName;
    private String winnerTeamName;
    private Integer totalParticipants;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
