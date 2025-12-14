package com.hospital.medalert.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many prescriptions can belong to One Doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // Many prescriptions can belong to One Patient
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private String medicationName;

    private String dosage; // e.g. "500mg"

    private String frequency; // e.g. "Twice daily"

    private int durationInDays;

    private LocalDate prescribedDate;

    @Column(columnDefinition = "TEXT")
    private String instructions; // e.g. "Take after food"

    private String status; // e.g. "ACTIVE", "COMPLETED"
}