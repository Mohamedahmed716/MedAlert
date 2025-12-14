package com.hospital.medalert.doctor;

import com.hospital.medalert.dto.ReservationDTO;
import com.hospital.medalert.dto.ShiftDTO;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    @GetMapping("/reservations/recent")
    public ResponseEntity<List<ReservationDTO>> getRecentReservations(Authentication authentication){
        String email = authentication.getName();
        List<ReservationDTO> reservations = reservationService.getRecentReservations(email);
        if (reservations != null) {
            return ResponseEntity.ok(reservations);
        } else {
            return ResponseEntity.noContent().build(); // Return 204 if no reservations found
        }
    }

    @GetMapping("/reservations/count")
    public ResponseEntity<Long> getReservationsCount(Authentication authentication){
        String email = authentication.getName();
        Long count = reservationService.getCount(email);
        return ResponseEntity.ok(count);
    }
}
