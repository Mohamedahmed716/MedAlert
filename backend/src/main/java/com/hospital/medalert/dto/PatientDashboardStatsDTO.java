package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDashboardStatsDTO {
    private long upcomingAppointments;
    private long activePrescriptions;
    private String healthStatus; // e.g., "Normal" or "Requires Attention"
}
