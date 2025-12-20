package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.CreateDoctorRequest;
import com.hospital.medalert.dto.CreateDepartmentRequest;
import com.hospital.medalert.dto.ChangePasswordRequest;
import com.hospital.medalert.dto.DashboardStatsDTO;
import com.hospital.medalert.dto.DoctorDTO;
import com.hospital.medalert.dto.DepartmentResponse;
import com.hospital.medalert.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospital-admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class HospitalAdminController {

    private final HospitalAdminService hospitalAdminService;

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments(@AuthenticationPrincipal User user) {
        List<String> departments = hospitalAdminService.getDepartmentsByHospital(user.getHospitalId());
        return ResponseEntity.ok(departments);
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(
            @RequestBody CreateDepartmentRequest request,
            @AuthenticationPrincipal User user) {
        try {
            System.out.println("Creating department: " + request.getName() + " for hospital: " + user.getHospitalId());
            
            request.setHospitalId(user.getHospitalId());
            String departmentName = hospitalAdminService.createDepartment(request);
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name(departmentName)
                    .message("Department created successfully")
                    .build();
            
            System.out.println("Department created successfully: " + departmentName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating department: " + e.getMessage());
            e.printStackTrace();
            
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(@AuthenticationPrincipal User user) {
        List<DoctorDTO> doctors = hospitalAdminService.getAllDoctorsByHospital(user.getHospitalId());
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorDTO> createDoctor(
            @RequestBody CreateDoctorRequest request,
            @AuthenticationPrincipal User user) {
        request.setHospitalId(user.getHospitalId());
        DoctorDTO doctor = hospitalAdminService.createDoctor(request);
        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/doctors/{doctorId}")
    public ResponseEntity<DoctorDTO> updateDoctor(
            @PathVariable Long doctorId,
            @RequestBody CreateDoctorRequest request,
            @AuthenticationPrincipal User user) {
        request.setHospitalId(user.getHospitalId());
        DoctorDTO doctor = hospitalAdminService.updateDoctor(doctorId, request);
        return ResponseEntity.ok(doctor);
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long doctorId) {
        hospitalAdminService.deleteDoctor(doctorId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/doctors/{doctorId}/status")
    public ResponseEntity<Void> toggleDoctorStatus(
            @PathVariable Long doctorId,
            @RequestParam boolean isActive) {
        hospitalAdminService.toggleDoctorStatus(doctorId, isActive);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(@AuthenticationPrincipal User user) {
        DashboardStatsDTO stats = hospitalAdminService.getDashboardStats(user.getHospitalId());
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<DepartmentResponse> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User user) {
        try {
            System.out.println("=== HOSPITAL ADMIN PASSWORD CHANGE ===");
            System.out.println("User: " + user.getEmail());
            
            hospitalAdminService.changeUserPassword(user.getId(), request);
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name("")
                    .message("Password changed successfully")
                    .build();
            
            System.out.println("Password changed successfully for: " + user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error changing password: " + e.getMessage());
            e.printStackTrace();
            
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}