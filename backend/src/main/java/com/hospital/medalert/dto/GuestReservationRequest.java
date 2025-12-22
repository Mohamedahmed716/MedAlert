package com.hospital.medalert.dto;

import lombok.Data;

@Data
public class GuestReservationRequest {
    private String hospitalName; // Changed from hospitalId to match frontend
    private Long bedId;
    private String guestName;
    private String reason;
    private Integer waitTimeMinutes; // New field for wait time
}
