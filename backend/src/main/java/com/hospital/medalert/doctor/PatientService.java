package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.PatientDTO;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Patient;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import com.hospital.medalert.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

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
                        .lastVisit(res.getAppointmentTime().toString())
                        .build())
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getMyPatients(String doctorEmail, String searchQuery) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Object[]> results;

        // IF search query is present, use the Search Query
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            results = patientRepository.searchPatientsByDoctorAndName(doctor, searchQuery);
        }
        // ELSE, use the default "Get All" Query
        else {
            results = patientRepository.findPatientsByDoctorWithLastVisit(doctor);
        }

        // Map results to DTO (Same logic as before)
        return results.stream().map(record -> {
            Patient patient = (Patient) record[0];
            LocalDateTime lastVisit = (LocalDateTime) record[1];

            return PatientDTO.builder()
                    .id(patient.getId())
                    .name(patient.getUser().getFullName())
                    .dateOfBirth(patient.getUser().getDateOfBirth().toString())
                    .lastVisit(lastVisit.toLocalDate().toString())
                    .condition(patient.getMedicalHistory())
                    .build();
        }).collect(Collectors.toList());
    }
}