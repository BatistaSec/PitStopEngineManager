package com.pitstopengine.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceDTO {
    private Long id;

    @NotNull(message = "Season year is required")
    private Integer season;

    @NotNull(message = "Round number is required")
    private Integer round;

    @NotBlank(message = "Race name is required")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Circuit ID is required")
    private Long circuitId;

    private String circuitName;
    private Boolean completed;
}
