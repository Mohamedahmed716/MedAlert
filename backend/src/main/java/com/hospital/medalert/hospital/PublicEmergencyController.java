package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.GuestReservationRequest;
import com.hospital.medalert.dto.PublicBedDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/emergency")
@RequiredArgsConstructor
public class PublicEmergencyController {

    private final EmergencyService emergencyService;

    // 1. Get All Hospitals (For the search list)
    @GetMapping("/hospitals")
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() { // Return type updated
        return ResponseEntity.ok(emergencyService.getAllHospitals());
    }

    // 2. Get Beds for a specific Hospital
    @GetMapping("/hospital/{name}/beds")
    public ResponseEntity<List<PublicBedDTO>> getHospitalBeds(@PathVariable String name) {
        return ResponseEntity.ok(emergencyService.getPublicBeds(name));
    }

    // 3. Reserve a Bed (Guest)
    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveBed(@RequestBody GuestReservationRequest request) {
        emergencyService.reserveBedForGuest(request);
        return ResponseEntity.ok().build();
    }
}
