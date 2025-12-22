package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ReservationResponse;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorReservationService {

    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;

    private Doctor getAuthenticatedDoctor(String email) {
        return doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor record not found for user: " + email));
    }

    public List<ReservationResponse> getDoctorReservations(String email) {
        Doctor doctor = getAuthenticatedDoctor(email);
        
        // Get all confirmed reservations for this doctor (not pending or declined)
        List<Reservation> reservations = reservationRepository.findAllByDoctorOrderByAppointmentTimeDesc(doctor)
                .stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED || r.getStatus() == ReservationStatus.COMPLETED)
                .collect(Collectors.toList());
        
        return reservations.stream()
                .map(ReservationResponse::fromReservation)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getUpcomingReservations(String email) {
        Doctor doctor = getAuthenticatedDoctor(email);
        LocalDateTime now = LocalDateTime.now();
        
        // Get confirmed reservations that are in the future
        List<Reservation> reservations = reservationRepository.findAllByDoctorAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(
                doctor, now, now.plusMonths(6))
                .stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .collect(Collectors.toList());
        
        return reservations.stream()
                .map(ReservationResponse::fromReservation)
                .collect(Collectors.toList());
    }
}