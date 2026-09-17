package com.pitstopengine.core.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamDTO {
    private Long id;

    @NotBlank(message = "Team name is required")
    private String name;

    @NotBlank(message = "Country is required")
    private String country;

    private String baseLocation;
    private String powerUnit;
}
