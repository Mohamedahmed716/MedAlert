package com.hospital.medalert.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// This tells Spring: "If a field is null, do not include it in the JSON response."
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientDTO {

    private Long id;
    private String name;

    // This will only appear in the JSON if you actually set it in the Service
    private LocalDate dateOfBirth;

    private String condition;
    private String time;
}