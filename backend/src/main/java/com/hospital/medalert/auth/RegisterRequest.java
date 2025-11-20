package com.hospital.medalert.auth;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private LocalDate dateOfBirth;
    private String role;       // "PATIENT", "DOCTOR", etc.
    private String hospitalId; // "general", "city", etc.
}
