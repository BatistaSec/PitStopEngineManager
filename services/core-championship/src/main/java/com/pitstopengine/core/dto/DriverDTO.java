package com.pitstopengine.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverDTO {
    private Long id;

    @NotBlank(message = "Driver code is required (e.g. VER)")
    private String code;

    @NotNull(message = "Permanent number is required")
    private Integer permanentNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Nationality is required")
    private String nationality;

    @NotNull(message = "Team ID is required")
    private Long teamId;

    private String teamName;
}
