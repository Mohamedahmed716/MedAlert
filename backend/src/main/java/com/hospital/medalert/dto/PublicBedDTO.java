package com.hospital.medalert.dto;

import lombok.Data;

@Data
public class PublicBedDTO {
    private Long id;
    private String bedNumber;
    private String status; // AVAILABLE, OCCUPIED, etc.
}
