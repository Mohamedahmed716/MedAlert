package com.hospital.medalert.dto;

import com.hospital.medalert.models.DurationTime;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class PrescriptionDTO {
    private Long id;
    private String medicationName;
    private String dosage;
    private String frequency;
    private int duration;
    private DurationTime durationTime;
    private LocalDate prescribedDate;
    private String instructions;
    private String patientName;
}