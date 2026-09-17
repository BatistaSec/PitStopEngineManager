package com.pitstopengine.core.controller;

import com.pitstopengine.core.dto.DriverDTO;
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
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@Tag(name = "Drivers", description = "Endpoints para gerenciamento de pilotos de F1")
public class DriverController {

    private final ChampionshipService championshipService;

    @PostMapping
    @Operation(summary = "Cadastrar um novo piloto")
    public ResponseEntity<DriverDTO> createDriver(@Valid @RequestBody DriverDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(championshipService.createDriver(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todos os pilotos")
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        return ResponseEntity.ok(championshipService.getAllDrivers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter piloto pelo ID")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(championshipService.getDriverById(id));
    }
}
