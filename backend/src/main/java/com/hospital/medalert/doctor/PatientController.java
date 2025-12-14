package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.PatientDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/patients/recent")
    public ResponseEntity<List<PatientDTO>> getRecentPatients(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.getRecentPatients(email));
    }
}
