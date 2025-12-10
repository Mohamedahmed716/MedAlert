package com.hospital.medalert.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HospitalResponse {
    private Long id;
    private String name;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String website;
    private String phoneNumber;
    private String status;
    private String adminEmail;
}