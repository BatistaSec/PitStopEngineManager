package com.pitstopengine.core.repository;

import com.pitstopengine.core.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByCode(String code);
    Optional<Driver> findByPermanentNumber(Integer permanentNumber);
    List<Driver> findByTeamId(Long teamId);
}
