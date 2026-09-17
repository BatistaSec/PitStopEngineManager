package com.pitstopengine.core.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CircuitDTO {
    private Long id;

    @NotBlank(message = "Circuit name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Country is required")
    private String country;

    private Double lengthKm;
    private Integer laps;
}
