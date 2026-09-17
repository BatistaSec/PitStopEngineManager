package com.pitstopengine.core.service;

import com.pitstopengine.core.dto.*;
import com.pitstopengine.core.event.LapRegisteredEvent;
import com.pitstopengine.core.event.RaceFinishedEvent;
import com.pitstopengine.core.model.*;
import com.pitstopengine.core.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChampionshipService {

    private final TeamRepository teamRepository;
    private final DriverRepository driverRepository;
    private final CircuitRepository circuitRepository;
    private final RaceRepository raceRepository;
    private final RaceResultRepository raceResultRepository;
    private final F1PointsCalculator pointsCalculator;
    private final RabbitMQEventPublisher eventPublisher;

    // --- TEAMS ---
    @Transactional
    public TeamDTO createTeam(TeamDTO dto) {
        Team team = Team.builder()
                .name(dto.getName())
                .country(dto.getCountry())
                .baseLocation(dto.getBaseLocation())
                .powerUnit(dto.getPowerUnit())
                .build();

        Team saved = teamRepository.save(team);
        return mapToTeamDTO(saved);
    }

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::mapToTeamDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + id));
        return mapToTeamDTO(team);
    }

    // --- DRIVERS ---
    @Transactional
    public DriverDTO createDriver(DriverDTO dto) {
        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + dto.getTeamId()));

        Driver driver = Driver.builder()
                .code(dto.getCode().toUpperCase())
                .permanentNumber(dto.getPermanentNumber())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .nationality(dto.getNationality())
                .team(team)
                .build();

        Driver saved = driverRepository.save(driver);
        return mapToDriverDTO(saved);
    }

    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::mapToDriverDTO)
                .collect(Collectors.toList());
    }

    public DriverDTO getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + id));
        return mapToDriverDTO(driver);
    }

    // --- CIRCUITS ---
    @Transactional
    public CircuitDTO createCircuit(CircuitDTO dto) {
        Circuit circuit = Circuit.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .country(dto.getCountry())
                .lengthKm(dto.getLengthKm())
                .laps(dto.getLaps())
                .build();

        Circuit saved = circuitRepository.save(circuit);
        return mapToCircuitDTO(saved);
    }

    public List<CircuitDTO> getAllCircuits() {
        return circuitRepository.findAll().stream()
                .map(this::mapToCircuitDTO)
                .collect(Collectors.toList());
    }

    // --- RACES ---
    @Transactional
    public RaceDTO createRace(RaceDTO dto) {
        Circuit circuit = circuitRepository.findById(dto.getCircuitId())
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + dto.getCircuitId()));

        Race race = Race.builder()
                .season(dto.getSeason())
                .round(dto.getRound())
                .name(dto.getName())
                .date(dto.getDate())
                .circuit(circuit)
                .completed(false)
                .build();

        Race saved = raceRepository.save(race);
        return mapToRaceDTO(saved);
    }

    public List<RaceDTO> getRacesBySeason(Integer season) {
        return raceRepository.findBySeasonOrderByRoundAsc(season).stream()
                .map(this::mapToRaceDTO)
                .collect(Collectors.toList());
    }

    // --- RACE RESULTS & RABBITMQ EVENTS ---
    @Transactional
    public List<RaceResultResponseDTO> submitRaceResults(Long raceId, List<RaceResultRequestDTO> results) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Race not found with ID: " + raceId));

        List<RaceResult> savedResults = new ArrayList<>();

        for (RaceResultRequestDTO req : results) {
            Driver driver = driverRepository.findById(req.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + req.getDriverId()));

            double points = pointsCalculator.calculatePoints(
                    req.getPosition(),
                    Boolean.TRUE.equals(req.getFastestLap()),
                    req.getStatus() != null ? req.getStatus() : "FINISHED"
            );

            RaceResult result = RaceResult.builder()
                    .race(race)
                    .driver(driver)
                    .position(req.getPosition())
                    .gridPosition(req.getGridPosition())
                    .points(points)
                    .status(req.getStatus() != null ? req.getStatus() : "FINISHED")
                    .fastestLap(Boolean.TRUE.equals(req.getFastestLap()))
                    .fastestLapTime(req.getFastestLapTime())
                    .build();

            savedResults.add(raceResultRepository.save(result));

            // Publicar evento de volta registrada se for volta mais rápida ou com tempo definido
            if (Boolean.TRUE.equals(req.getFastestLap()) || req.getFastestLapTime() != null) {
                eventPublisher.publishLapRegisteredEvent(LapRegisteredEvent.builder()
                        .raceId(race.getId())
                        .driverId(driver.getId())
                        .driverCode(driver.getCode())
                        .position(req.getPosition())
                        .fastestLap(Boolean.TRUE.equals(req.getFastestLap()))
                        .fastestLapTime(req.getFastestLapTime())
                        .build());
            }
        }

        race.setCompleted(true);
        raceRepository.save(race);

        // Publicar evento de corrida finalizada no RabbitMQ
        Optional<RaceResult> winner = savedResults.stream()
                .filter(r -> r.getPosition() == 1)
                .findFirst();

        eventPublisher.publishRaceFinishedEvent(RaceFinishedEvent.builder()
                .raceId(race.getId())
                .raceName(race.getName())
                .season(race.getSeason())
                .round(race.getRound())
                .winnerDriverCode(winner.map(w -> w.getDriver().getCode()).orElse("N/A"))
                .winnerDriverName(winner.map(w -> w.getDriver().getFirstName() + " " + w.getDriver().getLastName()).orElse("N/A"))
                .winnerTeamName(winner.map(w -> w.getDriver().getTeam() != null ? w.getDriver().getTeam().getName() : "N/A").orElse("N/A"))
                .totalParticipants(savedResults.size())
                .build());

        return savedResults.stream().map(this::mapToRaceResultResponseDTO).collect(Collectors.toList());
    }

    public List<RaceResultResponseDTO> getRaceResults(Long raceId) {
        return raceResultRepository.findByRaceIdOrderByPositionAsc(raceId).stream()
                .map(this::mapToRaceResultResponseDTO)
                .collect(Collectors.toList());
    }

    // --- STANDINGS ---
    public List<DriverStandingDTO> getDriverStandings(Integer season) {
        List<RaceResult> results = raceResultRepository.findBySeason(season);

        Map<Driver, List<RaceResult>> resultsByDriver = results.stream()
                .collect(Collectors.groupingBy(RaceResult::getDriver));

        List<DriverStandingDTO> standings = new ArrayList<>();

        for (Map.Entry<Driver, List<RaceResult>> entry : resultsByDriver.entrySet()) {
            Driver driver = entry.getKey();
            List<RaceResult> driverResults = entry.getValue();

            double totalPoints = driverResults.stream().mapToDouble(RaceResult::getPoints).sum();
            int wins = (int) driverResults.stream().filter(r -> r.getPosition() == 1 && "FINISHED".equalsIgnoreCase(r.getStatus())).count();
            int podiums = (int) driverResults.stream().filter(r -> r.getPosition() >= 1 && r.getPosition() <= 3 && "FINISHED".equalsIgnoreCase(r.getStatus())).count();

            standings.add(DriverStandingDTO.builder()
                    .driverId(driver.getId())
                    .driverCode(driver.getCode())
                    .driverName(driver.getFirstName() + " " + driver.getLastName())
                    .permanentNumber(driver.getPermanentNumber())
                    .teamName(driver.getTeam() != null ? driver.getTeam().getName() : "N/A")
                    .totalPoints(totalPoints)
                    .wins(wins)
                    .podiums(podiums)
                    .build());
        }

        standings.sort(Comparator.comparing(DriverStandingDTO::getTotalPoints)
                .thenComparing(DriverStandingDTO::getWins).reversed());

        for (int i = 0; i < standings.size(); i++) {
            standings.get(i).setRank(i + 1);
        }

        return standings;
    }

    public List<TeamStandingDTO> getTeamStandings(Integer season) {
        List<RaceResult> results = raceResultRepository.findBySeason(season);

        Map<Team, List<RaceResult>> resultsByTeam = results.stream()
                .filter(r -> r.getDriver().getTeam() != null)
                .collect(Collectors.groupingBy(r -> r.getDriver().getTeam()));

        List<TeamStandingDTO> standings = new ArrayList<>();

        for (Map.Entry<Team, List<RaceResult>> entry : resultsByTeam.entrySet()) {
            Team team = entry.getKey();
            List<RaceResult> teamResults = entry.getValue();

            double totalPoints = teamResults.stream().mapToDouble(RaceResult::getPoints).sum();
            int wins = (int) teamResults.stream().filter(r -> r.getPosition() == 1 && "FINISHED".equalsIgnoreCase(r.getStatus())).count();
            int podiums = (int) teamResults.stream().filter(r -> r.getPosition() >= 1 && r.getPosition() <= 3 && "FINISHED".equalsIgnoreCase(r.getStatus())).count();

            standings.add(TeamStandingDTO.builder()
                    .teamId(team.getId())
                    .teamName(team.getName())
                    .country(team.getCountry())
                    .totalPoints(totalPoints)
                    .wins(wins)
                    .podiums(podiums)
                    .build());
        }

        standings.sort(Comparator.comparing(TeamStandingDTO::getTotalPoints)
                .thenComparing(TeamStandingDTO::getWins).reversed());

        for (int i = 0; i < standings.size(); i++) {
            standings.get(i).setRank(i + 1);
        }

        return standings;
    }

    // --- MAPPERS ---
    private TeamDTO mapToTeamDTO(Team team) {
        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .country(team.getCountry())
                .baseLocation(team.getBaseLocation())
                .powerUnit(team.getPowerUnit())
                .build();
    }

    private DriverDTO mapToDriverDTO(Driver driver) {
        return DriverDTO.builder()
                .id(driver.getId())
                .code(driver.getCode())
                .permanentNumber(driver.getPermanentNumber())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .nationality(driver.getNationality())
                .teamId(driver.getTeam() != null ? driver.getTeam().getId() : null)
                .teamName(driver.getTeam() != null ? driver.getTeam().getName() : null)
                .build();
    }

    private CircuitDTO mapToCircuitDTO(Circuit circuit) {
        return CircuitDTO.builder()
                .id(circuit.getId())
                .name(circuit.getName())
                .location(circuit.getLocation())
                .country(circuit.getCountry())
                .lengthKm(circuit.getLengthKm())
                .laps(circuit.getLaps())
                .build();
    }

    private RaceDTO mapToRaceDTO(Race race) {
        return RaceDTO.builder()
                .id(race.getId())
                .season(race.getSeason())
                .round(race.getRound())
                .name(race.getName())
                .date(race.getDate())
                .circuitId(race.getCircuit() != null ? race.getCircuit().getId() : null)
                .circuitName(race.getCircuit() != null ? race.getCircuit().getName() : null)
                .completed(race.getCompleted())
                .build();
    }

    private RaceResultResponseDTO mapToRaceResultResponseDTO(RaceResult res) {
        return RaceResultResponseDTO.builder()
                .id(res.getId())
                .raceId(res.getRace().getId())
                .raceName(res.getRace().getName())
                .driverId(res.getDriver().getId())
                .driverName(res.getDriver().getFirstName() + " " + res.getDriver().getLastName())
                .driverCode(res.getDriver().getCode())
                .permanentNumber(res.getDriver().getPermanentNumber())
                .teamName(res.getDriver().getTeam() != null ? res.getDriver().getTeam().getName() : "N/A")
                .position(res.getPosition())
                .gridPosition(res.getGridPosition())
                .points(res.getPoints())
                .status(res.getStatus())
                .fastestLap(res.getFastestLap())
                .fastestLapTime(res.getFastestLapTime())
                .build();
    }
}
