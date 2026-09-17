package com.pitstopengine.core.repository;

import com.pitstopengine.core.model.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaceResultRepository extends JpaRepository<RaceResult, Long> {
    List<RaceResult> findByRaceIdOrderByPositionAsc(Long raceId);
    List<RaceResult> findByDriverId(Long driverId);

    @Query("SELECT r FROM RaceResult r WHERE r.race.season = :season")
    List<RaceResult> findBySeason(@Param("season") Integer season);
}
