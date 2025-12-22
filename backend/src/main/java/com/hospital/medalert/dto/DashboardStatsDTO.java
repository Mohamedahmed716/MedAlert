package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalPatients;
    private long activeDoctors;
    private long availableBeds;
    private long upcomingAppointments;
    private long totalReservations;
    private long pendingReservations;
    private long pendingERAlerts; // New field for ER alerts count
}