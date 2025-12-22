package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ERAlertResponse {
    private Long id;
    private String guestName;
    private String reason;
    private String bedNumber;
    private Integer waitTimeMinutes;
    private String status; // PENDING, ACCEPTED, DECLINED
    private LocalDateTime requestTime;
    private LocalDateTime expiryTime; // When the reservation expires
    private String declineReason;
}