package com.pitstopengine.core.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "circuits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Circuit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String country;

    private Double lengthKm;

    private Integer laps;
}
