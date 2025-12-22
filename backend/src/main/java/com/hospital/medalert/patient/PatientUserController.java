package com.hospital.medalert.patient;

import com.hospital.medalert.dto.PrescriptionDTO;
import com.hospital.medalert.dto.ReservationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PatientUserController {
    private final PatientUserService patientService;

    @GetMapping("/prescriptions")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptions(Authentication authentication) {
        return ResponseEntity.ok(patientService.getMyPrescriptions(authentication.getName()));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getReservations(Authentication authentication) {
        return ResponseEntity.ok(patientService.getMyReservations(authentication.getName()));
    }
    @PostMapping("/reservations")
    public ResponseEntity<ReservationDTO> bookReservation(
            Authentication authentication,
            @RequestBody ReservationDTO request) {
        // authentication.getName() provides the user's email from the JWT
        return ResponseEntity.ok(patientService.createReservation(authentication.getName(), request));
    }

}