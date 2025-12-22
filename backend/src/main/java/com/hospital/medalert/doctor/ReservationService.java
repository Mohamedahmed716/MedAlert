package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Patient;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

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

    public List<ReservationDTO> getTodayReservations(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        List<Reservation> reservations = reservationRepository.findAllByDoctorAndAppointmentTimeBetweenOrderByAppointmentTimeAsc(doctor, startOfDay,endOfDay);
        return reservations.stream()
                .map(res -> ReservationDTO.builder()
                        .id(res.getId())
                        .patientName(res.getPatient().getUser().getFullName())
                        .appointmentTime(res.getAppointmentTime().toString())
                        .reason(res.getReason())
                        .status(res.getStatus())
                        .build()
                ).collect(Collectors.toList());
    }

    public List<ReservationDTO> getAllReservations(String doctorEmail, String searchQuery) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Reservation> reservations;

        if(searchQuery != null && !searchQuery.trim().isEmpty()){
            reservations = reservationRepository.searchByDoctorAndPatientName(doctor, searchQuery);
        }
        else{
            reservations = reservationRepository.findAllByDoctorOrderByAppointmentTimeDesc(doctor);
        }

        return reservations.stream()
                .map(res -> ReservationDTO.builder()
                        .id(res.getId())
                        .patientName(res.getPatient().getUser().getFullName())
                        .appointmentTime(res.getAppointmentTime().toString())
                        .reason(res.getReason())
                        .status(res.getStatus())
                        .build()
                ).collect(Collectors.toList());
    }
    @Scheduled(cron = "0 0/15 * * * *")
    @Transactional
    public void scanAndCompleteReservations() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // 1. Find ACCEPTED reservations that are now in the past
        List<Reservation> pastReservations = reservationRepository
                .findReadyToCompleteReservations(today, now);

        for (Reservation r : pastReservations) {
            // 2. Automatically mark as COMPLETED
            r.setStatus(ReservationStatus.COMPLETED);

            // 3. Perform the linking logic
            linkPatientAndDoctor(r);

            // 4. Save
            reservationRepository.save(r);

            System.out.println("Auto-completed reservation " + r.getId());
        }
    }

    // This helper logic stays here
    private void linkPatientAndDoctor(Reservation reservation) {
        Patient patient = reservation.getPatient();
        Doctor doctor = reservation.getDoctor();

        if (patient.getDoctors() == null) {
            patient.setDoctors(new ArrayList<>());
        }

        // Check if already linked to avoid duplicates
        boolean alreadyLinked = patient.getDoctors().stream()
                .anyMatch(d -> d.getId().equals(doctor.getId()));

        if (!alreadyLinked) {
            patient.getDoctors().add(doctor);
            patientRepository.save(patient); // Updates the Join Table
        }
    }
}
