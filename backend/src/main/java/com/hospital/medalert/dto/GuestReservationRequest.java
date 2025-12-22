package com.hospital.medalert.dto;

import lombok.Data;

@Data
public class GuestReservationRequest {
    private Long hospitalId;
    private Long bedId;
    private String guestName;
    private String reason;
}
