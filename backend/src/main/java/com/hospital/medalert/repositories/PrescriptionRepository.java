package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // 1. Added ', p.id DESC'
    @Query("SELECT p FROM Prescription p " +
            "WHERE p.doctor = :doctor " +
            "ORDER BY p.prescribedDate DESC, p.id DESC")
    List<Prescription> findAllByDoctor(@Param("doctor") Doctor doctor);

    // 2. Added ', p.id DESC'
    @Query("SELECT p FROM Prescription p " +
            "WHERE p.doctor = :doctor " +
            "AND LOWER(p.patient.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY p.prescribedDate DESC, p.id DESC")
    List<Prescription> searchByDoctorAndPatientName(
            @Param("doctor") Doctor doctor,
            @Param("query") String query
    );

    // 3. Updated method name to include 'IdDesc'
    // This ensures if you have 5 prescriptions today, the very last one created shows up first.
    List<Prescription> findTop3ByDoctorOrderByPrescribedDateDescIdDesc(Doctor doctor);
}