package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // 1. Get All Prescriptions for a Doctor (Ordered by Date)
    @Query("SELECT p FROM Prescription p " +
            "WHERE p.doctor = :doctor " +
            "ORDER BY p.prescribedDate DESC")
    List<Prescription> findAllByDoctor(@Param("doctor") Doctor doctor);

    // 2. Search by Patient Name (Case Insensitive)
    @Query("SELECT p FROM Prescription p " +
            "WHERE p.doctor = :doctor " +
            "AND LOWER(p.patient.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY p.prescribedDate DESC")
    List<Prescription> searchByDoctorAndPatientName(
            @Param("doctor") Doctor doctor,
            @Param("query") String query
    );

    List<Prescription> findTop3ByDoctorOrderByPrescribedDateDesc(Doctor doctor);
}