package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("SELECT r.patient, MAX(r.appointmentTime) " +
            "FROM Reservation r " +
            "WHERE r.doctor = :doctor " +
            "GROUP BY r.patient")
    List<Object[]> findPatientsByDoctorWithLastVisit(@Param("doctor") Doctor doctor);
}
