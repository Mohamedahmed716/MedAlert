package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.ERAlertResponse;
import com.hospital.medalert.dto.ERAlertActionRequest;
import com.hospital.medalert.dto.GuestReservationRequest;
import com.hospital.medalert.dto.PublicBedDTO;
import com.hospital.medalert.models.*;
import com.hospital.medalert.repositories.BedRepository;
import com.hospital.medalert.repositories.ERAlertRepository;
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
    private final ERAlertRepository erAlertRepository;

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

    // --- 3. RESERVE BED (Updated to create ER Alert instead of direct reservation) ---
    @Transactional
    public void reserveBedForGuest(GuestReservationRequest request) {
        System.out.println("=== GUEST ER RESERVATION REQUEST ===");
        System.out.println("Hospital: " + request.getHospitalName());
        System.out.println("Guest: " + request.getGuestName());
        System.out.println("Wait Time: " + request.getWaitTimeMinutes() + " minutes");
        
        // Find hospital by name
        Hospital hospital = hospitalRepository.findByName(request.getHospitalName())
                .orElseThrow(() -> new RuntimeException("Hospital not found: " + request.getHospitalName()));
        
        Bed bed = bedRepository.findById(request.getBedId())
                .orElseThrow(() -> new RuntimeException("Bed not found"));

        if (bed.getStatus() != Bed.BedStatus.AVAILABLE) {
            throw new RuntimeException("Bed is no longer available!");
        }

        // Create ER Alert instead of direct reservation
        ERAlert erAlert = ERAlert.builder()
                .guestName(request.getGuestName())
                .reason(request.getReason())
                .hospitalId(hospital.getHospitalId())
                .bed(bed)
                .waitTimeMinutes(request.getWaitTimeMinutes())
                .status(ERAlertStatus.PENDING)
                .requestTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(request.getWaitTimeMinutes()))
                .build();

        erAlertRepository.save(erAlert);

        // Temporarily reserve the bed (will be confirmed or released based on admin decision)
        bed.setStatus(Bed.BedStatus.RESERVED);
        bed.setPatientName("PENDING: " + request.getGuestName());
        bed.setNotes("ER Alert - Waiting for admin approval");
        bedRepository.save(bed);
        
        System.out.println("ER Alert created with ID: " + erAlert.getId());
    }

    // --- 4. GET ER ALERTS FOR HOSPITAL ADMIN ---
    public List<ERAlertResponse> getPendingERAlerts(String hospitalId) {
        // First, process any expired alerts
        processExpiredAlerts();
        
        List<ERAlert> alerts = erAlertRepository.findByHospitalIdAndStatusOrderByRequestTimeDesc(hospitalId, ERAlertStatus.PENDING);
        return alerts.stream()
                .map(this::mapToERAlertResponse)
                .collect(Collectors.toList());
    }

    public List<ERAlertResponse> getAllERAlerts(String hospitalId) {
        // First, process any expired alerts
        processExpiredAlerts();
        
        List<ERAlert> alerts = erAlertRepository.findByHospitalIdOrderByRequestTimeDesc(hospitalId);
        return alerts.stream()
                .map(this::mapToERAlertResponse)
                .collect(Collectors.toList());
    }

    // --- 5. PROCESS ER ALERT (ACCEPT/DECLINE) ---
    @Transactional
    public ERAlertResponse processERAlert(Long alertId, ERAlertActionRequest request, String hospitalId) {
        System.out.println("=== PROCESSING ER ALERT ===");
        System.out.println("Alert ID: " + alertId);
        System.out.println("Action: " + request.getAction());
        System.out.println("Hospital ID: " + hospitalId);
        
        ERAlert alert = erAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("ER Alert not found"));

        // Verify the alert belongs to this hospital
        if (!alert.getHospitalId().equals(hospitalId)) {
            throw new RuntimeException("ER Alert does not belong to your hospital");
        }

        if (alert.getStatus() != ERAlertStatus.PENDING) {
            throw new RuntimeException("ER Alert has already been processed");
        }

        // Check if alert has expired
        if (LocalDateTime.now().isAfter(alert.getExpiryTime())) {
            alert.setStatus(ERAlertStatus.EXPIRED);
            alert.setProcessedAt(LocalDateTime.now());
            erAlertRepository.save(alert);
            
            // Release the bed
            Bed bed = alert.getBed();
            bed.setStatus(Bed.BedStatus.AVAILABLE);
            bed.setPatientName(null);
            bed.setNotes(null);
            bedRepository.save(bed);
            
            throw new RuntimeException("ER Alert has expired");
        }

        if ("ACCEPT".equalsIgnoreCase(request.getAction())) {
            alert.setStatus(ERAlertStatus.ACCEPTED);
            alert.setProcessedAt(LocalDateTime.now());
            
            // Confirm the bed reservation
            Bed bed = alert.getBed();
            bed.setStatus(Bed.BedStatus.OCCUPIED);
            bed.setPatientName(alert.getGuestName());
            bed.setNotes("ER Patient - " + alert.getReason());
            bedRepository.save(bed);
            
            System.out.println("ER Alert accepted - Bed confirmed for guest");
            
        } else if ("DECLINE".equalsIgnoreCase(request.getAction())) {
            alert.setStatus(ERAlertStatus.DECLINED);
            alert.setDeclineReason(request.getDeclineReason());
            alert.setProcessedAt(LocalDateTime.now());
            
            // Release the bed
            Bed bed = alert.getBed();
            bed.setStatus(Bed.BedStatus.AVAILABLE);
            bed.setPatientName(null);
            bed.setNotes(null);
            bedRepository.save(bed);
            
            System.out.println("ER Alert declined - Bed released");
            
        } else {
            throw new RuntimeException("Invalid action. Must be ACCEPT or DECLINE");
        }

        ERAlert savedAlert = erAlertRepository.save(alert);
        return mapToERAlertResponse(savedAlert);
    }

    // --- 6. GET ER ALERTS COUNT ---
    public long getPendingERAlertsCount(String hospitalId) {
        processExpiredAlerts();
        return erAlertRepository.countByHospitalIdAndStatus(hospitalId, ERAlertStatus.PENDING);
    }

    // --- HELPER METHODS ---
    private void processExpiredAlerts() {
        List<ERAlert> expiredAlerts = erAlertRepository.findExpiredPendingAlerts(LocalDateTime.now());
        
        for (ERAlert alert : expiredAlerts) {
            alert.setStatus(ERAlertStatus.EXPIRED);
            alert.setProcessedAt(LocalDateTime.now());
            
            // Release the bed
            Bed bed = alert.getBed();
            bed.setStatus(Bed.BedStatus.AVAILABLE);
            bed.setPatientName(null);
            bed.setNotes(null);
            bedRepository.save(bed);
            
            System.out.println("Expired ER Alert ID: " + alert.getId() + " - Bed released");
        }
        
        if (!expiredAlerts.isEmpty()) {
            erAlertRepository.saveAll(expiredAlerts);
            System.out.println("Processed " + expiredAlerts.size() + " expired ER alerts");
        }
    }

    private ERAlertResponse mapToERAlertResponse(ERAlert alert) {
        return ERAlertResponse.builder()
                .id(alert.getId())
                .guestName(alert.getGuestName())
                .reason(alert.getReason())
                .bedNumber(alert.getBed().getBedNumber())
                .waitTimeMinutes(alert.getWaitTimeMinutes())
                .status(alert.getStatus().toString())
                .requestTime(alert.getRequestTime())
                .expiryTime(alert.getExpiryTime())
                .declineReason(alert.getDeclineReason())
                .build();
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