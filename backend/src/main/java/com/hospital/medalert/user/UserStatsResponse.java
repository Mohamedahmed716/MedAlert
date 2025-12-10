package com.hospital.medalert.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long pendingUsers;
}