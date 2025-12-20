package com.hospital.medalert.doctor;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Patient;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PrescriptionRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.models.Prescription;
import com.hospital.medalert.models.DurationTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import com.hospital.medalert.dto.PrescriptionDTO;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public List<PrescriptionDTO> loadAll(String doctorEmail, String query) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Prescription> entities;

        if (query == null || query.isEmpty()) {
            entities = prescriptionRepository.findAllByDoctor(doctor);
        } else {
            entities = prescriptionRepository.searchByDoctorAndPatientName(doctor, query);
        }

        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private PrescriptionDTO mapToDTO(Prescription p) {
        return PrescriptionDTO.builder()
                .id(p.getId())
                .medicationName(p.getMedicationName())
                .dosage(p.getDosage())
                .frequency(p.getFrequency())
                .duration(p.getDuration())
                .durationTime(p.getDurationTime())
                .prescribedDate(p.getPrescribedDate())
                .instructions(p.getInstructions())
                .patientName(p.getPatient().getUser().getFullName())
                .build();
    }

    public List<PrescriptionDTO> loadRecent(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Prescription> entities = prescriptionRepository.findTop3ByDoctorOrderByPrescribedDateDescIdDesc(doctor);
        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Change return type from void to Prescription
    public PrescriptionDTO send(String doctorEmail, PrescriptionDTO prescription) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findByUserFullName(prescription.getPatientName())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + prescription.getPatientName()));

        Prescription newPrescription = Prescription.builder()
                .doctor(doctor)
                .dosage(prescription.getDosage())
                .frequency(prescription.getFrequency())
                .medicationName(prescription.getMedicationName())
                .instructions(prescription.getInstructions())
                .prescribedDate(LocalDate.now())
                .duration(prescription.getDuration())
                .durationTime(prescription.getDurationTime())
                .patient(patient)
                .build();

        Prescription savedEntity = prescriptionRepository.save(newPrescription);
        return mapToDTO(savedEntity);
    }
}
