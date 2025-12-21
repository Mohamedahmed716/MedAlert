package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBedRequest {
    private String status;
    private String patientName;
    private String patientId;
    private String assignedDoctor;
    private String notes;
}