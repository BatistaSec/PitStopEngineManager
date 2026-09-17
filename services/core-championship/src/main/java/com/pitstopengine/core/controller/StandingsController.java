package com.pitstopengine.core.controller;

import com.pitstopengine.core.dto.DriverStandingDTO;
import com.pitstopengine.core.dto.TeamStandingDTO;
import com.pitstopengine.core.service.ChampionshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/standings")
@RequiredArgsConstructor
@Tag(name = "Standings", description = "Endpoints para tabelas de classificação de Pilotos e Construtores")
public class StandingsController {

    private final ChampionshipService championshipService;

    @GetMapping("/drivers")
    @Operation(summary = "Obter a classificação oficial de Pilotos (Driver Standings)")
    public ResponseEntity<List<DriverStandingDTO>> getDriverStandings(@RequestParam(defaultValue = "2026") Integer season) {
        return ResponseEntity.ok(championshipService.getDriverStandings(season));
    }

    @GetMapping("/teams")
    @Operation(summary = "Obter a classificação oficial de Construtores (Team/Constructor Standings)")
    public ResponseEntity<List<TeamStandingDTO>> getTeamStandings(@RequestParam(defaultValue = "2026") Integer season) {
        return ResponseEntity.ok(championshipService.getTeamStandings(season));
    }
}
