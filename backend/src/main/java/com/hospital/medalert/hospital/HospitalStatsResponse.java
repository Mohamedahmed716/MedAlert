package com.hospital.medalert.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HospitalStatsResponse {
    private long totalHospitals;
    private long operational;
    private long maintenance;
}