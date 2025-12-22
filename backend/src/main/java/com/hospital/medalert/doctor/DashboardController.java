package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ShiftDTO;
import com.hospital.medalert.dto.BedResponse;
import com.hospital.medalert.dto.BedStatsResponse;
import com.hospital.medalert.dto.ReservationResponse;
import com.hospital.medalert.hospital.HospitalAdminService;
import com.hospital.medalert.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DashboardController {

    private final ShiftService shiftService;
    private final HospitalAdminService hospitalAdminService;
    private final DoctorReservationService doctorReservationService;

    @GetMapping("/shift/today")
    public ResponseEntity<ShiftDTO> getTodayShift(Authentication authentication) {
        String email = authentication.getName();

        ShiftDTO shiftDTO = shiftService.getTodayShift(email);

        if (shiftDTO != null) {
            return ResponseEntity.ok(shiftDTO);
        } else {
            return ResponseEntity.noContent().build(); // Return 204 if no shift found
        }
    }

    // Bed viewing endpoints for doctors (read-only)
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

    // Reservation endpoints for doctors (view confirmed reservations only)
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        String email = authentication.getName();
        List<ReservationResponse> reservations = doctorReservationService.getDoctorReservations(email);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations/upcoming")
    public ResponseEntity<List<ReservationResponse>> getUpcomingReservations(Authentication authentication) {
        String email = authentication.getName();
        List<ReservationResponse> reservations = doctorReservationService.getUpcomingReservations(email);
        return ResponseEntity.ok(reservations);
    }
}
