package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ShiftDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DashboardController {

    private final ShiftService shiftService;

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
}
