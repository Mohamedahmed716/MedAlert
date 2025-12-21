package com.hospital.medalert.patient;

import com.hospital.medalert.dto.PrescriptionDTO;
import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.models.*;
import com.hospital.medalert.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientPortalService {
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ReservationRepository reservationRepository;

    private Patient getPatient(String email) {
        return patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient record not found for: " + email));
    }

    public List<PrescriptionDTO> getMyPrescriptions(String email) {
        Patient patient = getPatient(email);
        return prescriptionRepository.findAllByPatientOrderByPrescribedDateDesc(patient)
                .stream().map(p -> PrescriptionDTO.builder()
                        .id(p.getId())
                        .medicationName(p.getMedicationName())
                        .dosage(p.getDosage())
                        .frequency(p.getFrequency())
                        .instructions(p.getInstructions())
                        .prescribedDate(p.getPrescribedDate())
                        .patientName(p.getDoctor().getUser().getFullName()) // Using patientName field for Doctor Name in Patient View
                        .build()
                ).collect(Collectors.toList());
    }

    public List<ReservationDTO> getMyReservations(String email) {
        Patient patient = getPatient(email);
        return reservationRepository.findAllByPatientOrderByAppointmentTimeDesc(patient)
                .stream().map(r -> ReservationDTO.builder()
                        .id(r.getId())
                        .patientName("Dr. " + r.getDoctor().getUser().getFullName()) // Map Doctor name to the DTO
                        .appointmentTime(r.getAppointmentTime().toString())
                        .reason(r.getReason())
                        .status(r.getStatus())
                        .build()
                ).collect(Collectors.toList());
    }

    public void updateReservationStatus(Long id, String email, ReservationStatus status) {
        Reservation res = reservationRepository.findById(id).orElseThrow();
        if (!res.getPatient().getUser().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        res.setStatus(status);
        reservationRepository.save(res);
    }
}