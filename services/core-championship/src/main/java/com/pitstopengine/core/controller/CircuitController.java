package com.pitstopengine.core.controller;

import com.pitstopengine.core.dto.CircuitDTO;
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
@RequestMapping("/api/v1/circuits")
@RequiredArgsConstructor
@Tag(name = "Circuits", description = "Endpoints para gerenciamento de circuitos de F1")
public class CircuitController {

    private final ChampionshipService championshipService;

    @PostMapping
    @Operation(summary = "Cadastrar um novo circuito")
    public ResponseEntity<CircuitDTO> createCircuit(@Valid @RequestBody CircuitDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(championshipService.createCircuit(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todos os circuitos")
    public ResponseEntity<List<CircuitDTO>> getAllCircuits() {
        return ResponseEntity.ok(championshipService.getAllCircuits());
    }
}
