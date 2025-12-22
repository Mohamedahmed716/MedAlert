package com.hospital.medalert.api;

import com.hospital.medalert.dto.DoctorDTO;
import com.hospital.medalert.dto.HospitalResponse;
import com.hospital.medalert.hospital.Hospital;
import com.hospital.medalert.hospital.HospitalAdminService;
import com.hospital.medalert.hospital.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PublicController {

    private final HospitalRepository hospitalRepository;
    private final HospitalAdminService hospitalAdminService;

    @GetMapping("/hospitals")
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        List<HospitalResponse> response = hospitals.stream()
                .map(hospital -> {
                    String address = "";
                    if (hospital.getStreetAddress() != null) {
                        address = hospital.getStreetAddress();
                        if (hospital.getCity() != null) {
                            address += ", " + hospital.getCity();
                        }
                        if (hospital.getState() != null) {
                            address += ", " + hospital.getState();
                        }
                    }
                    
                    return HospitalResponse.builder()
                            .hospitalId(hospital.getHospitalId())
                            .name(hospital.getName())
                            .address(address.isEmpty() ? null : address)
                            .build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hospitals/{hospitalId}/doctors")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByHospital(@PathVariable String hospitalId) {
        List<DoctorDTO> doctors = hospitalAdminService.getAllDoctorsByHospital(hospitalId);
        return ResponseEntity.ok(doctors);
    }
}