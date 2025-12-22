package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.GuestReservationRequest;
import com.hospital.medalert.dto.PublicBedDTO;
import com.hospital.medalert.models.*;
import com.hospital.medalert.repositories.BedRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final HospitalRepository hospitalRepository;
    private final BedRepository bedRepository;
    private final PatientRepository patientRepository;
    private final ReservationRepository reservationRepository;

    // --- 1. GET ALL HOSPITALS ---
    public List<HospitalResponse> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(this::mapToHospitalResponse)
                .collect(Collectors.toList());
    }

    // --- 2. GET BEDS ---
    public List<PublicBedDTO> getPublicBeds(String name) {
        Hospital hospital = hospitalRepository.findByName(name).orElseThrow(() -> new RuntimeException("Hospital not found"));;
        return bedRepository.findByHospitalId(hospital.getHospitalId().toString()).stream()
                .map(bed -> {
                    PublicBedDTO dto = new PublicBedDTO();
                    dto.setId(bed.getId());
                    dto.setBedNumber(bed.getBedNumber());
                    dto.setStatus(bed.getStatus().toString());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // --- 3. RESERVE BED ---
    @Transactional
    public void reserveBedForGuest(GuestReservationRequest request) {
        Bed bed = bedRepository.findById(request.getBedId())
                .orElseThrow(() -> new RuntimeException("Bed not found"));

        if (bed.getStatus() != Bed.BedStatus.AVAILABLE) {
            throw new RuntimeException("Bed is no longer available!");
        }

        Patient guestPatient = patientRepository.findById(9999L)
                .orElseThrow(() -> new RuntimeException("System Error: Guest Account missing"));

        String guestInfo = String.format("GUEST: %s | REASON: %s", request.getGuestName(), request.getReason());

        // // //
        Reservation reservation = Reservation.builder()
                .patient(guestPatient)
                .doctor(null)
                .status(ReservationStatus.PENDING)
                .appointmentTime(LocalDateTime.now())
                .reason(guestInfo)
                .build();

        reservationRepository.save(reservation);

        bed.setStatus(Bed.BedStatus.RESERVED);
        bedRepository.save(bed);
    }

    // --- HELPER: Map Entity to New DTO ---
    private HospitalResponse mapToHospitalResponse(Hospital h) {
        return HospitalResponse.builder()
                .id(h.getId())
                .name(h.getName())
                .streetAddress(h.getStreetAddress())
                .city(h.getCity())
                .state(h.getState())
                .zipCode(h.getZipCode())
                .website(h.getWebsite())
                .phoneNumber(h.getPhoneNumber())
                .status(h.getStatus() != null ? h.getStatus().toString() : "ACTIVE") // Handle Enum to String
                // Assuming Admin email is accessible via relation, otherwise set null or generic
                .adminEmail(null)
                .build();
    }
}