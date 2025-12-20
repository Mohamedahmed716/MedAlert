package com.hospital.medalert.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO {
    private Long id;
    private String fullName;
    private String email;
    private String specialty;
    private String department;
    private String phoneNumber;
    private String profilePhotoUrl;
    private String bio;
    
    @JsonProperty("isActive")
    private boolean isActive;
}
