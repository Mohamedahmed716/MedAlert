package com.hospital.medalert.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beds")
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String bedNumber;
    
    @Column(nullable = false)
    private String hospitalId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedStatus status = BedStatus.AVAILABLE;
    
    @Column
    private String patientName;
    
    @Column
    private String patientId;
    
    @Column
    private String assignedDoctor;
    
    @Column
    private String notes;
    
    public enum BedStatus {
        AVAILABLE,
        OCCUPIED,
        MAINTENANCE,
        RESERVED
    }
}