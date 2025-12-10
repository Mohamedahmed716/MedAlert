package com.hospital.medalert.hospital;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByName(String name);

    @Query("SELECT COUNT(h) FROM Hospital h WHERE h.status = 'Active'")
    long countActiveHospitals();

    @Query("SELECT COUNT(h) FROM Hospital h WHERE h.status = 'Inactive'")
    long countInactiveHospitals();
}