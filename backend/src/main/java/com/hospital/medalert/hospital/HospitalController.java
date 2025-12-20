package com.hospital.medalert.hospital;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService service;

    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(service.getAllHospitals());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getHospitalCount() {
        long count = service.getAllHospitals().size();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats")
    public ResponseEntity<HospitalStatsResponse> getStats() {
        return ResponseEntity.ok(service.getHospitalStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getHospitalById(id));
    }

    @PostMapping
    public ResponseEntity<Hospital> createHospital(@RequestBody HospitalRegistrationRequest request) {
        return ResponseEntity.ok(service.createHospitalWithAdmin(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(
            @PathVariable Long id, 
            @RequestBody Hospital request
    ) {
        return ResponseEntity.ok(service.updateHospital(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> toggleStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        service.toggleStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        service.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }
}