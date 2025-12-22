package com.hospital.medalert.patient;

import com.hospital.medalert.dto.PrescriptionDTO;
import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.dto.ReservationResponse;
import com.hospital.medalert.models.*;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.PrescriptionRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientUserService {
    private final PrescriptionRepository prescriptionRepository;
    private final ReservationRepository reservationRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    private Patient getAuthenticatedPatient(String email) {
        return patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient record not found for user: " + email));
    }

    public List<PrescriptionDTO> getMyPrescriptions(String email) {
        Patient patient = getAuthenticatedPatient(email);
        return prescriptionRepository.findAllByPatientOrderByPrescribedDateDesc(patient)
                .stream()
                .map(this::mapPrescriptionToDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getMyReservations(String email) {
        Patient patient = getAuthenticatedPatient(email);
        return reservationRepository.findAllByPatientOrderByAppointmentTimeDesc(patient)
                .stream()
                .map(ReservationResponse::fromReservation)
                .collect(Collectors.toList());
    }

    public ReservationResponse cancelReservation(Long id, String email) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!reservation.getPatient().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to cancel this reservation");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation savedReservation = reservationRepository.save(reservation);
        return ReservationResponse.fromReservation(savedReservation);
    }

    private PrescriptionDTO mapPrescriptionToDTO(Prescription p) {
        return PrescriptionDTO.builder()
                .id(p.getId())
                .medicationName(p.getMedicationName())
                .dosage(p.getDosage())
                .frequency(p.getFrequency())
                .duration(p.getDuration())
                .durationTime(p.getDurationTime())
                .prescribedDate(p.getPrescribedDate())
                .instructions(p.getInstructions())
                .patientName("Dr. " + p.getDoctor().getUser().getFullName())
                .build();
    }
    // File: com.hospital.medalert.patient.PatientUserService
    public ReservationDTO createReservation(String email, ReservationDTO request) {
        // 1. Get the authenticated patient
        Patient patient = getAuthenticatedPatient(email);

        // 2. Find the selected doctor using the ID from the DTO
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 3. Create the Reservation entity
        Reservation reservation = Reservation.builder()
                .patient(patient)
                .doctor(doctor)
                // Expecting ISO format from frontend (e.g., 2025-12-25T10:30:00)
                .appointmentTime(LocalDateTime.parse(request.getAppointmentTime()))
                .reason(request.getReason())
                .status(ReservationStatus.PENDING) // New requests start as PENDING
                .build();

        // 4. Save to database
        Reservation saved = reservationRepository.save(reservation);

        return ReservationDTO.builder()
                .id(saved.getId())
                .status(saved.getStatus())
                .appointmentTime(saved.getAppointmentTime().toString())
                .build();
    }
}