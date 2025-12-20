package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.PrescriptionDTO;
import com.hospital.medalert.models.Prescription;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/doctor/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @GetMapping("/load")
    public ResponseEntity<List<PrescriptionDTO>> loadAllPrescriptions(Authentication authentication , @RequestParam(required = false) String query) {
        String email = authentication.getName();
        List<PrescriptionDTO> prescriptions = prescriptionService.loadAll(email, query);
        if(prescriptions != null) {
            return ResponseEntity.ok(prescriptions);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PrescriptionDTO>> loadRecentPrescriptions(Authentication authentication) {
        String email = authentication.getName();
        List<PrescriptionDTO> prescriptions = prescriptionService.loadRecent(email);
        if(prescriptions != null) {
            return ResponseEntity.ok(prescriptions);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Prescription> createPrescription(Prescription prescription) {
        return ResponseEntity.ok(new Prescription());
    }
}
