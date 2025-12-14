package com.hospital.medalert.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hospital.medalert.models.Reservation;
import com.hospital.medalert.models.ReservationStatus;
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
public class ReservationDTO {
    private Long id;
    private String patientName;
    private String reason;
    private String appointmentTime;
    private ReservationStatus status;
}
