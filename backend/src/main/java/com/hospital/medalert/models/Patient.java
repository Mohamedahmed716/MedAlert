package com.hospital.medalert.models;

import com.hospital.medalert.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User (if patients can log in)
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory; // Simple text for now

    // Relationships
    @OneToMany(mappedBy = "patient")
    private List<Prescription> prescriptions;

    @OneToMany(mappedBy = "patient")
    private List<Reservation> reservations;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "patient_doctors",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    private List<Doctor> doctors;
}