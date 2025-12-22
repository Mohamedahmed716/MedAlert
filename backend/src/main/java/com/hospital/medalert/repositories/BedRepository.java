package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByHospitalIdOrderByBedNumber(String hospitalId);
    
    Optional<Bed> findByHospitalIdAndBedNumber(String hospitalId, String bedNumber);
    
    @Query("SELECT COUNT(b) FROM Bed b WHERE b.hospitalId = :hospitalId AND b.status = 'AVAILABLE'")
    long countAvailableBeds(@Param("hospitalId") String hospitalId);
    
    @Query("SELECT COUNT(b) FROM Bed b WHERE b.hospitalId = :hospitalId AND b.status = 'OCCUPIED'")
    long countOccupiedBeds(@Param("hospitalId") String hospitalId);
    
    @Query("SELECT COUNT(b) FROM Bed b WHERE b.hospitalId = :hospitalId")
    long countTotalBeds(@Param("hospitalId") String hospitalId);

    List<Bed> findByHospitalId(String hospitalId);
}