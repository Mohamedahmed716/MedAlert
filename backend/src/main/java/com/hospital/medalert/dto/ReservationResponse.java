package com.hospital.medalert.dto;

import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private String doctorDepartment;
    private LocalDateTime appointmentTime;
    private String reason;
    private ReservationStatus status;
    private String declineReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReservationResponse fromReservation(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .patientName(reservation.getPatient().getUser().getFullName())
                .patientEmail(reservation.getPatient().getUser().getEmail())
                .doctorName(reservation.getDoctor().getUser().getFullName())
                .doctorDepartment(reservation.getDoctor().getDepartment() != null ? 
                    reservation.getDoctor().getDepartment().getName() : "General")
                .appointmentTime(reservation.getAppointmentTime())
                .reason(reservation.getReason())
                .status(reservation.getStatus())
                .declineReason(reservation.getDeclineReason())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}