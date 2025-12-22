package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.CreateDoctorRequest;
import com.hospital.medalert.dto.CreateDepartmentRequest;
import com.hospital.medalert.dto.ChangePasswordRequest;
import com.hospital.medalert.dto.DashboardStatsDTO;
import com.hospital.medalert.dto.DoctorDTO;
import com.hospital.medalert.dto.DepartmentResponse;
import com.hospital.medalert.dto.BedResponse;
import com.hospital.medalert.dto.UpdateBedRequest;
import com.hospital.medalert.dto.BedStatsResponse;
import com.hospital.medalert.dto.ReservationResponse;
import com.hospital.medalert.dto.ReservationActionRequest;
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

    // Bed Management Endpoints
    @GetMapping("/beds")
    public ResponseEntity<List<BedResponse>> getAllBeds(@AuthenticationPrincipal User user) {
        List<BedResponse> beds = hospitalAdminService.getAllBeds(user.getHospitalId());
        return ResponseEntity.ok(beds);
    }

    @GetMapping("/beds/stats")
    public ResponseEntity<BedStatsResponse> getBedStats(@AuthenticationPrincipal User user) {
        BedStatsResponse stats = hospitalAdminService.getBedStats(user.getHospitalId());
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/beds/{bedNumber}")
    public ResponseEntity<BedResponse> updateBedStatus(
            @PathVariable String bedNumber,
            @RequestBody UpdateBedRequest request,
            @AuthenticationPrincipal User user) {
        try {
            BedResponse bed = hospitalAdminService.updateBedStatus(user.getHospitalId(), bedNumber, request);
            return ResponseEntity.ok(bed);
        } catch (Exception e) {
            System.err.println("Error updating bed: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/beds/initialize")
    public ResponseEntity<DepartmentResponse> initializeBeds(
            @RequestParam int numberOfBeds,
            @AuthenticationPrincipal User user) {
        try {
            hospitalAdminService.initializeBeds(user.getHospitalId(), numberOfBeds);
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name("")
                    .message("Successfully initialized " + numberOfBeds + " beds")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/beds/add")
    public ResponseEntity<DepartmentResponse> addBeds(
            @RequestParam int additionalBeds,
            @AuthenticationPrincipal User user) {
        try {
            hospitalAdminService.addBeds(user.getHospitalId(), additionalBeds);
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name("")
                    .message("Successfully added " + additionalBeds + " beds")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/beds/remove")
    public ResponseEntity<DepartmentResponse> removeBeds(
            @RequestParam int numberOfBeds,
            @AuthenticationPrincipal User user) {
        try {
            hospitalAdminService.removeBeds(user.getHospitalId(), numberOfBeds);
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name("")
                    .message("Successfully removed " + numberOfBeds + " beds")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/doctors/fix-departments")
    public ResponseEntity<DepartmentResponse> fixDoctorsWithNullDepartments(@AuthenticationPrincipal User user) {
        try {
            hospitalAdminService.fixDoctorsWithNullDepartments(user.getHospitalId());
            
            DepartmentResponse response = DepartmentResponse.builder()
                    .name("")
                    .message("Successfully fixed doctors with missing departments")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            DepartmentResponse errorResponse = DepartmentResponse.builder()
                    .name("")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Reservation Management Endpoints
    @GetMapping("/reservations/pending")
    public ResponseEntity<List<ReservationResponse>> getPendingReservations(@AuthenticationPrincipal User user) {
        List<ReservationResponse> reservations = hospitalAdminService.getPendingReservations(user.getHospitalId());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations(@AuthenticationPrincipal User user) {
        List<ReservationResponse> reservations = hospitalAdminService.getAllReservations(user.getHospitalId());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations/{reservationId}/debug")
    public ResponseEntity<String> debugReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal User user) {
        try {
            System.out.println("=== DEBUG RESERVATION ===");
            System.out.println("User: " + user.getEmail());
            System.out.println("Hospital ID: " + user.getHospitalId());
            System.out.println("Reservation ID: " + reservationId);
            
            String debugInfo = hospitalAdminService.debugReservation(reservationId, user.getHospitalId());
            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            System.err.println("Error debugging reservation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    @PostMapping("/reservations/{reservationId}/process")
    public ResponseEntity<ReservationResponse> processReservation(
            @PathVariable Long reservationId,
            @RequestBody ReservationActionRequest request,
            @AuthenticationPrincipal User user) {
        try {
            System.out.println("=== HOSPITAL ADMIN PROCESS RESERVATION ===");
            System.out.println("User: " + user.getEmail());
            System.out.println("Hospital ID: " + user.getHospitalId());
            System.out.println("Reservation ID: " + reservationId);
            System.out.println("Action: " + request.getAction());
            
            ReservationResponse reservation = hospitalAdminService.processReservation(reservationId, request, user.getHospitalId());
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            System.err.println("Error processing reservation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/reservations/pending/count")
    public ResponseEntity<Long> getPendingReservationsCount(@AuthenticationPrincipal User user) {
        long count = hospitalAdminService.getPendingReservationsCount(user.getHospitalId());
        return ResponseEntity.ok(count);
    }
}