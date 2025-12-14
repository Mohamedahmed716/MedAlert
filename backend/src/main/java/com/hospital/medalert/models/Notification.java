package com.hospital.medalert.models;

import com.hospital.medalert.user.User;
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
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who receives this? (Could be a Doctor OR a Patient, so we link to the base User)
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private String title;

    private String message;

    private LocalDateTime timestamp;

    private boolean isRead; // To show unread badges
}