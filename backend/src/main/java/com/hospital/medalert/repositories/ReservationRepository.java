package com.hospital.medalert.repositories;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
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
}