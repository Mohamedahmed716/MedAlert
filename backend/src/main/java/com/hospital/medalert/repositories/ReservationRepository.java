package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Patient;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 3 recent completed reservations
    List<Reservation> findTop3ByDoctorAndStatusOrderByAppointmentTimeDesc(
            Doctor doctor,
            ReservationStatus status
    );

    List<Reservation> findTop3ByDoctorAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(
            Doctor doctor,
            LocalDateTime start,
            LocalDateTime end
    );

    long countByDoctorAndAppointmentTimeBetween(Doctor doctor, LocalDateTime start, LocalDateTime end);

    List<Reservation> findAllByDoctorAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(
            Doctor doctor,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Reservation> findAllByDoctorOrderByAppointmentTimeDesc(Doctor doctor);

    @Query("SELECT r FROM Reservation r " +
            "WHERE r.doctor = :doctor " +
            "AND LOWER(r.patient.user.fullName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "ORDER BY r.appointmentTime DESC")
    List<Reservation> searchByDoctorAndPatientName(
            @Param("doctor") Doctor doctor,
            @Param("name") String name
    );
    
    long countByDoctorUserHospitalId(String hospitalId);
    long countByDoctorUserHospitalIdAndStatus(String hospitalId, ReservationStatus status);
    List<Reservation> findAllByPatientOrderByAppointmentTimeDesc(Patient patient);

    // New methods for hospital admin reservation management
    List<Reservation> findByDoctorUserHospitalIdAndStatus(String hospitalId, ReservationStatus status);
    List<Reservation> findByDoctorUserHospitalIdOrderByCreatedAtDesc(String hospitalId);

    @Query("SELECT r FROM Reservation r WHERE r.status = 'CONFIRMED' " +
            "AND (r.appointmentTime < :today " +
            "OR (r.appointmentTime = :today AND r.appointmentTime < :now))")
    List<Reservation> findReadyToCompleteReservations(
            @Param("today") LocalDate today,
            @Param("now") LocalTime now
    );
}
