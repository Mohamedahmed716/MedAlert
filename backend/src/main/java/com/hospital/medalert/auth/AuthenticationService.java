package com.hospital.medalert.auth;

import com.hospital.medalert.models.Patient;
import com.hospital.medalert.repositories.PatientRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hospital.medalert.config.JwtService;
import com.hospital.medalert.user.Role;
import com.hospital.medalert.user.User;
import com.hospital.medalert.user.UserRepository;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.repositories.DoctorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PatientRepository patientRepository; // Add this

    public AuthenticationResponse register(RegisterRequest request) {
        Role userRole;
        try {
            String roleInput = request.getRole().toUpperCase();
            if (roleInput.equals("ADMIN")) {
                userRole = Role.HOSPITAL_ADMIN;
            } else {
                userRole = Role.valueOf(roleInput.replace(" ", "_"));
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        if ((userRole == Role.DOCTOR || userRole == Role.HOSPITAL_ADMIN) && 
            (request.getHospitalId() == null || request.getHospitalId().trim().isEmpty())) {
            throw new RuntimeException("Hospital selection is required for Doctors and Hospital Admins.");
        }

        // Determine if user should be active based on role
        // Patients are automatically active, Doctors need system admin approval
        boolean isActive = (userRole == Role.PATIENT);

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .role(userRole)
                .hospitalId(request.getHospitalId())
                .phoneNumber(null)
                .isActive(isActive)
                .gender(request.getGender())
                .build();

        var savedUser = repository.save(user);
        if (userRole == Role.PATIENT) {
            var patient = Patient.builder()
                    .user(savedUser)
                    .medicalHistory("Initial profile created")
                    .build();
            patientRepository.save(patient);
        }

        if (userRole == Role.DOCTOR) {
            var doctor = Doctor.builder()
                    .user(savedUser)
                    .specialty(null)
                    .department(request.getDepartment()) // Set department from request
                    .build();

            doctorRepository.save(doctor);
        }
        
        return AuthenticationResponse.builder()
                .token(null)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .gender(user.getGender())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .gender(user.getGender())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();
    }
}