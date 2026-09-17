package com.pitstopengine.core.repository;

import com.pitstopengine.core.model.Circuit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Long> {
    List<Circuit> findByCountry(String country);
}
