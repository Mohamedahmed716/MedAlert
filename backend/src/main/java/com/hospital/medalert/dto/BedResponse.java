package com.hospital.medalert.dto;

import com.hospital.medalert.models.Bed;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BedResponse {
    private Long id;
    private String bedNumber;
    private String hospitalId;
    private String status;
    private String patientName;
    private String patientId;
    private String assignedDoctor;
    private String notes;
    
    public static BedResponse fromBed(Bed bed) {
        return BedResponse.builder()
                .id(bed.getId())
                .bedNumber(bed.getBedNumber())
                .hospitalId(bed.getHospitalId())
                .status(bed.getStatus().name())
                .patientName(bed.getPatientName())
                .patientId(bed.getPatientId())
                .assignedDoctor(bed.getAssignedDoctor())
                .notes(bed.getNotes())
                .build();
    }
}