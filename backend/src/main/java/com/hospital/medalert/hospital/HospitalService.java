package com.hospital.medalert.hospital;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.hospital.medalert.models.Department;
import com.hospital.medalert.repositories.DepartmentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.medalert.user.Role;
import com.hospital.medalert.user.User;
import com.hospital.medalert.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    DepartmentRepository departmentRepository;

    @Transactional
    public Hospital createHospitalWithAdmin(HospitalRegistrationRequest request) {
        if (request.getName() != null) {
             Optional<Hospital> existing = hospitalRepository.findByName(request.getName().trim());
             if (existing.isPresent()) {
                 throw new RuntimeException("A hospital with this name already exists.");
             }
        }
        
        if (userRepository.findByEmail(request.getAdminEmail()).isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }

        String uniqueHospitalId = UUID.randomUUID().toString();

        Hospital hospital = Hospital.builder()
                .name(request.getName())
                .hospitalId(uniqueHospitalId)
                .streetAddress(request.getStreetAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .phoneNumber(request.getPhoneNumber())
                .website(request.getWebsite())
                .status("Active")
                .build();
        
        Hospital savedHospital = hospitalRepository.save(hospital);

        User adminUser = User.builder()
                .fullName("Admin - " + request.getName())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .role(Role.HOSPITAL_ADMIN)
                .hospitalId(uniqueHospitalId)
                .isActive(true)
                .build();

        userRepository.save(adminUser);

        return savedHospital;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    // UPDATED: Now returns HospitalResponse with admin email
    public HospitalResponse getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        // Find the main admin for this hospital
        User adminUser = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.HOSPITAL_ADMIN && 
                             u.getHospitalId().equals(hospital.getHospitalId()))
                .findFirst()
                .orElse(null);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .streetAddress(hospital.getStreetAddress())
                .city(hospital.getCity())
                .state(hospital.getState())
                .zipCode(hospital.getZipCode())
                .website(hospital.getWebsite())
                .phoneNumber(hospital.getPhoneNumber())
                .status(hospital.getStatus())
                .adminEmail(adminUser != null ? adminUser.getEmail() : "")
                .build();
    }

    public Hospital updateHospital(Long id, Hospital updatedData) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        hospital.setName(updatedData.getName());
        hospital.setStreetAddress(updatedData.getStreetAddress());
        hospital.setCity(updatedData.getCity());
        hospital.setState(updatedData.getState());
        hospital.setZipCode(updatedData.getZipCode());
        hospital.setPhoneNumber(updatedData.getPhoneNumber());
        hospital.setWebsite(updatedData.getWebsite());
        
        return hospitalRepository.save(hospital);
    }

    public void toggleStatus(Long id, String newStatus) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        hospital.setStatus(newStatus);
        hospitalRepository.save(hospital);
    }

    public HospitalStatsResponse getHospitalStats() {
        long total = hospitalRepository.count();
        long active = hospitalRepository.countActiveHospitals();
        long inactive = hospitalRepository.countInactiveHospitals();

        return HospitalStatsResponse.builder()
                .totalHospitals(total)
                .operational(active)
                .maintenance(inactive)
                .build();
    }

    public void deleteHospital(Long id) {
        if (!hospitalRepository.existsById(id)) {
            throw new RuntimeException("Hospital not found with id: " + id);
        }
        hospitalRepository.deleteById(id);
    }
    // File: com.hospital.medalert.hospital.HospitalService
    public List<Department> getDepartmentsByHospitalId(String hospitalId) {
        // Uses the custom query method from your repository
        return departmentRepository.findByHospitalId(hospitalId);
    }
}