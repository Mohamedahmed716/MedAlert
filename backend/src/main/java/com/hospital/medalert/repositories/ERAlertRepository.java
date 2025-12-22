package com.hospital.medalert.repositories;

import com.hospital.medalert.models.ERAlert;
import com.hospital.medalert.models.ERAlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ERAlertRepository extends JpaRepository<ERAlert, Long> {
    
    // Get all ER alerts for a specific hospital
    List<ERAlert> findByHospitalIdOrderByRequestTimeDesc(String hospitalId);
    
    // Get pending ER alerts for a specific hospital
    List<ERAlert> findByHospitalIdAndStatusOrderByRequestTimeDesc(String hospitalId, ERAlertStatus status);
    
    // Count pending ER alerts for a specific hospital
    long countByHospitalIdAndStatus(String hospitalId, ERAlertStatus status);
    
    // Find expired alerts that need to be processed
    @Query("SELECT e FROM ERAlert e WHERE e.status = 'PENDING' AND e.expiryTime < :now")
    List<ERAlert> findExpiredPendingAlerts(@Param("now") LocalDateTime now);
}