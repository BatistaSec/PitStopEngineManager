package com.pitstopengine.core.controller;

import com.pitstopengine.core.dto.RaceDTO;
import com.pitstopengine.core.dto.RaceResultRequestDTO;
import com.pitstopengine.core.dto.RaceResultResponseDTO;
import com.pitstopengine.core.service.ChampionshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/races")
@RequiredArgsConstructor
@Tag(name = "Races", description = "Endpoints para gerenciamento de Grandes Prêmios e resultados")
public class RaceController {

    private final ChampionshipService championshipService;

    @PostMapping
    @Operation(summary = "Agendar/Cadastrar uma nova corrida na temporada")
    public ResponseEntity<RaceDTO> createRace(@Valid @RequestBody RaceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(championshipService.createRace(dto));
    }

    @GetMapping
    @Operation(summary = "Listar corridas de uma determinada temporada")
    public ResponseEntity<List<RaceDTO>> getRacesBySeason(@RequestParam(defaultValue = "2026") Integer season) {
        return ResponseEntity.ok(championshipService.getRacesBySeason(season));
    }

    @PostMapping("/{raceId}/results")
    @Operation(summary = "Registrar os resultados de uma corrida finalizada")
    public ResponseEntity<List<RaceResultResponseDTO>> submitResults(
            @PathVariable Long raceId,
            @RequestBody List<RaceResultRequestDTO> results) {
        return ResponseEntity.ok(championshipService.submitRaceResults(raceId, results));
    }

    @GetMapping("/{raceId}/results")
    @Operation(summary = "Obter o resultado final de uma corrida")
    public ResponseEntity<List<RaceResultResponseDTO>> getResults(@PathVariable Long raceId) {
        return ResponseEntity.ok(championshipService.getRaceResults(raceId));
    }
}
