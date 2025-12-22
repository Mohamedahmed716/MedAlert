package com.hospital.medalert.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "er_alert")
public class ERAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String guestName;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private String hospitalId;

    @ManyToOne
    @JoinColumn(name = "bed_id")
    private Bed bed;

    @Column(nullable = false)
    private Integer waitTimeMinutes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ERAlertStatus status;

    @Column(nullable = false)
    private LocalDateTime requestTime;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    private String declineReason;

    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        if (requestTime == null) {
            requestTime = LocalDateTime.now();
        }
        if (expiryTime == null && waitTimeMinutes != null) {
            expiryTime = requestTime.plusMinutes(waitTimeMinutes);
        }
    }
}