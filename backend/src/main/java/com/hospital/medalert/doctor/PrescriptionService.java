package com.hospital.medalert.doctor;

import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PrescriptionRepository;
import com.hospital.medalert.models.Prescription;
import com.hospital.medalert.models.DurationTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.hospital.medalert.dto.PrescriptionDTO;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;

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

        List<Prescription> entities = prescriptionRepository.findTop3ByDoctorOrderByPrescribedDateDesc(doctor);
        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
