package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateDoctorRequest {
    private String fullName;
    private String email;
    private String password;
    private String specialty;
    private String department;
    private String phoneNumber;
    private String address;
    private String bio;
    private LocalDate dateOfBirth;
    private String gender;
    private String hospitalId;
    private List<AvailabilityDTO> availability;
}