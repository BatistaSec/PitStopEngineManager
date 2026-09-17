package com.pitstopengine.core.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "race_results", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"race_id", "driver_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(nullable = false)
    private Integer position;

    private Integer gridPosition;

    @Column(nullable = false)
    private Double points;

    @Builder.Default
    private String status = "FINISHED"; // FINISHED, DNF, DSQ, DNS

    @Builder.Default
    private Boolean fastestLap = false;

    private String fastestLapTime;
}
