package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationActionRequest {
    private String action; // "ACCEPT" or "DECLINE"
    private String declineReason; // Required if action is DECLINE
}