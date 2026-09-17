package com.pitstopengine.core.repository;

import com.pitstopengine.core.model.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
    List<Race> findBySeasonOrderByRoundAsc(Integer season);
    Optional<Race> findBySeasonAndRound(Integer season, Integer round);
}
