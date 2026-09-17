package com.pitstopengine.core.controller;

import com.pitstopengine.core.dto.TeamDTO;
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
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Endpoints para gerenciamento de escuderias de F1")
public class TeamController {

    private final ChampionshipService championshipService;

    @PostMapping
    @Operation(summary = "Cadastrar uma nova escuderia")
    public ResponseEntity<TeamDTO> createTeam(@Valid @RequestBody TeamDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(championshipService.createTeam(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todas as escuderias")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(championshipService.getAllTeams());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter dados de uma escuderia pelo ID")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(championshipService.getTeamById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados de uma escuderia")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable Long id, @Valid @RequestBody TeamDTO dto) {
        return ResponseEntity.ok(championshipService.updateTeam(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover uma escuderia")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        championshipService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
