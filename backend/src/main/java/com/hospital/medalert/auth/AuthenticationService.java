package com.hospital.medalert.auth;

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

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .role(userRole)
                .hospitalId(request.getHospitalId())
                .isActive(false)
                .gender(request.getGender()) 
                .build();

        var savedUser = repository.save(user);

        if (userRole == Role.DOCTOR) {
            var doctor = Doctor.builder()
                    .user(savedUser)
                    .specialty(null)
                    .phoneNumber(null)
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