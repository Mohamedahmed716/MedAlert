package com.hospital.medalert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateDepartmentRequest {
    private String name;
    private String description;
    private String hospitalId; // Will be set by the controller
    
    // These fields are collected by the frontend but not stored in the current Department entity
    // They could be used for future enhancements or stored in a separate table
    private String shortCode;
    private String headOfDepartment;
    private String phone;
    private String email;
}