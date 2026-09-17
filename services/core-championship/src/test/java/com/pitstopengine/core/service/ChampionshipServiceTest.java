package com.pitstopengine.core.service;

import com.pitstopengine.core.dto.*;
import com.pitstopengine.core.model.*;
import com.pitstopengine.core.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ChampionshipServiceTest {

    @Autowired
    private ChampionshipService championshipService;

    @Autowired
    private F1PointsCalculator pointsCalculator;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @BeforeEach
    void setUp() {
        raceResultRepository.deleteAll();
        raceRepository.deleteAll();
        driverRepository.deleteAll();
        teamRepository.deleteAll();
        circuitRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve calcular pontuação oficial da F1 corretamente incluindo volta rápida")
    void testF1PointsCalculator() {
        // 1º lugar com volta mais rápida (25 + 1 = 26)
        assertThat(pointsCalculator.calculatePoints(1, true, "FINISHED")).isEqualTo(26.0);

        // 1º lugar sem volta mais rápida (25)
        assertThat(pointsCalculator.calculatePoints(1, false, "FINISHED")).isEqualTo(25.0);

        // 2º lugar (18)
        assertThat(pointsCalculator.calculatePoints(2, false, "FINISHED")).isEqualTo(18.0);

        // 10º lugar com volta mais rápida (1 + 1 = 2)
        assertThat(pointsCalculator.calculatePoints(10, true, "FINISHED")).isEqualTo(2.0);

        // 11º lugar com volta mais rápida (fora do Top 10 não ganha bônus de volta mais rápida)
        assertThat(pointsCalculator.calculatePoints(11, true, "FINISHED")).isEqualTo(0.0);

        // DNF (Abandono)
        assertThat(pointsCalculator.calculatePoints(1, true, "DNF")).isEqualTo(0.0);
    }

    @Test
    @DisplayName("Deve registrar corrida, computar resultados e calcular classificação de pilotos e equipes")
    void testFullChampionshipFlow() {
        // 1. Cadastrar Equipes
        TeamDTO ferrari = championshipService.createTeam(TeamDTO.builder()
                .name("Scuderia Ferrari")
                .country("Italy")
                .baseLocation("Maranello")
                .powerUnit("Ferrari")
                .build());

        TeamDTO redbull = championshipService.createTeam(TeamDTO.builder()
                .name("Red Bull Racing")
                .country("Austria")
                .baseLocation("Milton Keynes")
                .powerUnit("Honda RBPT")
                .build());

        // 2. Cadastrar Pilotos
        DriverDTO leclerc = championshipService.createDriver(DriverDTO.builder()
                .code("LEC")
                .permanentNumber(16)
                .firstName("Charles")
                .lastName("Leclerc")
                .nationality("Monaco")
                .teamId(ferrari.getId())
                .build());

        DriverDTO verstappen = championshipService.createDriver(DriverDTO.builder()
                .code("VER")
                .permanentNumber(1)
                .firstName("Max")
                .lastName("Verstappen")
                .nationality("Netherlands")
                .teamId(redbull.getId())
                .build());

        // 3. Cadastrar Circuito e GP
        CircuitDTO interlagos = championshipService.createCircuit(CircuitDTO.builder()
                .name("Autódromo José Carlos Pace")
                .location("São Paulo")
                .country("Brazil")
                .lengthKm(4.309)
                .laps(71)
                .build());

        RaceDTO gpBrasil = championshipService.createRace(RaceDTO.builder()
                .season(2026)
                .round(1)
                .name("GP de São Paulo")
                .date(LocalDate.of(2026, 11, 8))
                .circuitId(interlagos.getId())
                .build());

        // 4. Submeter resultados do GP (Leclerc 1º + Volta Rápida, Verstappen 2º)
        List<RaceResultRequestDTO> results = List.of(
                RaceResultRequestDTO.builder()
                        .driverId(leclerc.getId())
                        .position(1)
                        .gridPosition(1)
                        .fastestLap(true)
                        .fastestLapTime("1:10.540")
                        .status("FINISHED")
                        .build(),
                RaceResultRequestDTO.builder()
                        .driverId(verstappen.getId())
                        .position(2)
                        .gridPosition(2)
                        .fastestLap(false)
                        .status("FINISHED")
                        .build()
        );

        championshipService.submitRaceResults(gpBrasil.getId(), results);

        // 5. Verificar Standings Pilotos
        List<DriverStandingDTO> driverStandings = championshipService.getDriverStandings(2026);
        assertThat(driverStandings).hasSize(2);
        assertThat(driverStandings.get(0).getDriverCode()).isEqualTo("LEC");
        assertThat(driverStandings.get(0).getTotalPoints()).isEqualTo(26.0); // 25 + 1
        assertThat(driverStandings.get(0).getRank()).isEqualTo(1);

        assertThat(driverStandings.get(1).getDriverCode()).isEqualTo("VER");
        assertThat(driverStandings.get(1).getTotalPoints()).isEqualTo(18.0);
        assertThat(driverStandings.get(1).getRank()).isEqualTo(2);

        // 6. Verificar Standings Equipes
        List<TeamStandingDTO> teamStandings = championshipService.getTeamStandings(2026);
        assertThat(teamStandings).hasSize(2);
        assertThat(teamStandings.get(0).getTeamName()).isEqualTo("Scuderia Ferrari");
        assertThat(teamStandings.get(0).getTotalPoints()).isEqualTo(26.0);
        assertThat(teamStandings.get(1).getTeamName()).isEqualTo("Red Bull Racing");
        assertThat(teamStandings.get(1).getTotalPoints()).isEqualTo(18.0);
    }
}
