package com.hospital.medalert.patient;

import com.hospital.medalert.dto.PrescriptionDTO;
import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.models.Patient;
import com.hospital.medalert.models.Prescription;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.PrescriptionRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientUserService {
    private final PrescriptionRepository prescriptionRepository;
    private final ReservationRepository reservationRepository;
    private final PatientRepository patientRepository;

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

    public List<ReservationDTO> getMyReservations(String email) {
        Patient patient = getAuthenticatedPatient(email);
        return reservationRepository.findAllByPatientOrderByAppointmentTimeDesc(patient)
                .stream()
                .map(res -> ReservationDTO.builder()
                        .id(res.getId())
                        .patientName("Dr. " + res.getDoctor().getUser().getFullName()) // Using patientName field for Dr Name in UI
                        .appointmentTime(res.getAppointmentTime().toString())
                        .status(res.getStatus())
                        .reason(res.getReason())
                        .build()
                ).collect(Collectors.toList());
    }

    public void cancelReservation(Long id, String email) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!reservation.getPatient().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to cancel this reservation");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
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
}