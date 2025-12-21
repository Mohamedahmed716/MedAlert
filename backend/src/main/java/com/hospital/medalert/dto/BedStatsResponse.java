package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BedStatsResponse {
    private long totalBeds;
    private long availableBeds;
    private long occupiedBeds;
    private long maintenanceBeds;
    private long reservedBeds;
    private double occupancyRate;
}