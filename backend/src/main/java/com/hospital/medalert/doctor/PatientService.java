package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.PatientDTO;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;

    public List<PatientDTO> getRecentPatients(String doctorEmail) {
        // 1. Find Doctor
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 2. Get Top 3 Completed Reservations
        List<Reservation> recentReservations = reservationRepository
                .findTop3ByDoctorAndStatusOrderByAppointmentTimeDesc(doctor, ReservationStatus.COMPLETED);

        // 3. Map to DTO
        return recentReservations.stream()
                .map(res -> PatientDTO.builder()
                        .id(res.getPatient().getId())
                        .name(res.getPatient().getUser().getFullName())
                        .condition(res.getReason())
                        .time(res.getAppointmentTime().toString())
                        .build())
                .collect(Collectors.toList());
    }
}