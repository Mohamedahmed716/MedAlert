package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;

    public List<ReservationDTO> getRecentReservations(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();      // 2025-12-14 00:00:00
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        List<Reservation> recentReservations = reservationRepository.findTop3ByDoctorAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(doctor, startOfDay, endOfDay);

        return recentReservations.stream()
                .map(res -> ReservationDTO.builder()
                        .id(res.getId())
                        .patientName(res.getPatient().getUser().getFullName())
                        .appointmentTime(res.getAppointmentTime().toString())
                        .reason(res.getReason())
                        .build()
                ).collect(Collectors.toList());
    }

    public Long getCount(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        return reservationRepository.countByDoctorAndAppointmentTimeBetween(doctor, startOfDay, endOfDay);
    }
}
