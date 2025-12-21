package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.CreateDoctorRequest;
import com.hospital.medalert.dto.CreateDepartmentRequest;
import com.hospital.medalert.dto.ChangePasswordRequest;
import com.hospital.medalert.dto.DashboardStatsDTO;
import com.hospital.medalert.dto.DoctorDTO;
import com.hospital.medalert.dto.BedResponse;
import com.hospital.medalert.dto.UpdateBedRequest;
import com.hospital.medalert.dto.BedStatsResponse;
import com.hospital.medalert.models.Department;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.models.Bed;
import com.hospital.medalert.repositories.DepartmentRepository;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.ReservationRepository;
import com.hospital.medalert.repositories.BedRepository;
import com.hospital.medalert.user.Role;
import com.hospital.medalert.user.User;
import com.hospital.medalert.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalAdminService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final BedRepository bedRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorDTO> getAllDoctorsByHospital(String hospitalId) {
        // Get all doctors for this hospital (both active and inactive for management)
        List<Doctor> doctors = doctorRepository.findByUserHospitalId(hospitalId);
        return doctors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO createDoctor(CreateDoctorRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create User first - doctors created by hospital admin need system admin approval
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(Role.DOCTOR)
                .hospitalId(request.getHospitalId())
                .isActive(false) // Doctors need system admin approval
                .build();

        var savedUser = userRepository.save(user);

        // Find or create department
        Department department = null;
        if (request.getDepartment() != null && !request.getDepartment().trim().isEmpty()) {
            department = departmentRepository.findByHospitalIdAndName(request.getHospitalId(), request.getDepartment());
            
            // If department doesn't exist, create it
            if (department == null) {
                department = Department.builder()
                        .name(request.getDepartment())
                        .hospitalId(request.getHospitalId())
                        .description("Auto-created department")
                        .isActive(true)
                        .build();
                department = departmentRepository.save(department);
            }
        }

        // Create Doctor
        var doctor = Doctor.builder()
                .user(savedUser)
                .department(department) // This can be null if no department specified
                .build();

        var savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    public DoctorDTO updateDoctor(Long doctorId, CreateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = doctor.getUser();
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Find or create department
        Department department = null;
        if (request.getDepartment() != null && !request.getDepartment().trim().isEmpty()) {
            department = departmentRepository.findByHospitalIdAndName(request.getHospitalId(), request.getDepartment());
            
            // If department doesn't exist, create it
            if (department == null) {
                department = Department.builder()
                        .name(request.getDepartment())
                        .hospitalId(request.getHospitalId())
                        .description("Auto-created department")
                        .isActive(true)
                        .build();
                department = departmentRepository.save(department);
            }
        }
        
        doctor.setDepartment(department);

        userRepository.save(user);
        doctorRepository.save(doctor);

        return mapToDTO(doctor);
    }

    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }

    public void toggleDoctorStatus(Long doctorId, boolean isActive) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User user = doctor.getUser();
        user.setActive(isActive);
        userRepository.save(user);
    }

    public DashboardStatsDTO getDashboardStats(String hospitalId) {
        long totalPatients = patientRepository.countByUserHospitalId(hospitalId);
        long activeDoctors = doctorRepository.countByUserHospitalIdAndUserIsActive(hospitalId, true);
        long totalReservations = reservationRepository.countByDoctorUserHospitalId(hospitalId);
        long pendingReservations = reservationRepository.countByDoctorUserHospitalIdAndStatus(hospitalId, com.hospital.medalert.models.ReservationStatus.PENDING);
        
        return DashboardStatsDTO.builder()
                .totalPatients(totalPatients)
                .activeDoctors(activeDoctors)
                .availableBeds(15) // This would come from a beds table
                .upcomingAppointments(42) // This would come from appointments
                .totalReservations(totalReservations)
                .pendingReservations(pendingReservations)
                .build();
    }

    public List<String> getDepartmentsByHospital(String hospitalId) {
        List<Department> departments = departmentRepository.findByHospitalIdAndIsActive(hospitalId, true);
        return departments.stream()
                .map(Department::getName)
                .sorted()
                .collect(Collectors.toList());
    }

    public String createDepartment(CreateDepartmentRequest request) {
        // Check if department already exists for this hospital
        List<Department> existingDepartments = departmentRepository.findByHospitalIdAndIsActive(request.getHospitalId(), true);
        boolean departmentExists = existingDepartments.stream()
                .anyMatch(dept -> dept.getName().equalsIgnoreCase(request.getName()));
        
        if (departmentExists) {
            throw new RuntimeException("Department already exists in this hospital");
        }

        // Create new department (only using fields that exist in the entity)
        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .hospitalId(request.getHospitalId())
                .isActive(true)
                .build();

        Department savedDepartment = departmentRepository.save(department);
        return savedDepartment.getName();
    }

    public void changeUserPassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        System.out.println("Password updated successfully for user ID: " + userId);
    }

    // Method to fix doctors with null departments
    public void fixDoctorsWithNullDepartments(String hospitalId) {
        List<Doctor> doctors = doctorRepository.findByUserHospitalId(hospitalId);
        
        // Find or create a "General Medicine" department as default
        Department defaultDepartment = departmentRepository.findByHospitalIdAndName(hospitalId, "General Medicine");
        if (defaultDepartment == null) {
            defaultDepartment = Department.builder()
                    .name("General Medicine")
                    .hospitalId(hospitalId)
                    .description("Default department for doctors")
                    .isActive(true)
                    .build();
            defaultDepartment = departmentRepository.save(defaultDepartment);
        }
        
        // Update doctors with null departments
        int updatedCount = 0;
        for (Doctor doctor : doctors) {
            if (doctor.getDepartment() == null) {
                doctor.setDepartment(defaultDepartment);
                doctorRepository.save(doctor);
                updatedCount++;
            }
        }
        
        System.out.println("Updated " + updatedCount + " doctors with default department for hospital: " + hospitalId);
    }

    // Bed Management Methods
    public List<BedResponse> getAllBeds(String hospitalId) {
        List<Bed> beds = bedRepository.findByHospitalIdOrderByBedNumber(hospitalId);
        return beds.stream()
                .map(BedResponse::fromBed)
                .collect(Collectors.toList());
    }

    public BedStatsResponse getBedStats(String hospitalId) {
        long totalBeds = bedRepository.countTotalBeds(hospitalId);
        long availableBeds = bedRepository.countAvailableBeds(hospitalId);
        long occupiedBeds = bedRepository.countOccupiedBeds(hospitalId);
        
        // Count maintenance and reserved beds
        List<Bed> allBeds = bedRepository.findByHospitalIdOrderByBedNumber(hospitalId);
        long maintenanceBeds = allBeds.stream()
                .mapToLong(bed -> bed.getStatus() == Bed.BedStatus.MAINTENANCE ? 1 : 0)
                .sum();
        long reservedBeds = allBeds.stream()
                .mapToLong(bed -> bed.getStatus() == Bed.BedStatus.RESERVED ? 1 : 0)
                .sum();
        
        double occupancyRate = totalBeds > 0 ? (double) occupiedBeds / totalBeds * 100 : 0;
        
        return BedStatsResponse.builder()
                .totalBeds(totalBeds)
                .availableBeds(availableBeds)
                .occupiedBeds(occupiedBeds)
                .maintenanceBeds(maintenanceBeds)
                .reservedBeds(reservedBeds)
                .occupancyRate(Math.round(occupancyRate * 100.0) / 100.0)
                .build();
    }

    public BedResponse updateBedStatus(String hospitalId, String bedNumber, UpdateBedRequest request) {
        Bed bed = bedRepository.findByHospitalIdAndBedNumber(hospitalId, bedNumber)
                .orElseThrow(() -> new RuntimeException("Bed not found"));
        
        // Update bed status
        try {
            bed.setStatus(Bed.BedStatus.valueOf(request.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid bed status: " + request.getStatus());
        }
        
        // Update patient information
        bed.setPatientName(request.getPatientName());
        bed.setPatientId(request.getPatientId());
        bed.setAssignedDoctor(request.getAssignedDoctor());
        bed.setNotes(request.getNotes());
        
        // Clear patient info if bed becomes available
        if (bed.getStatus() == Bed.BedStatus.AVAILABLE) {
            bed.setPatientName(null);
            bed.setPatientId(null);
            bed.setAssignedDoctor(null);
            bed.setNotes(null);
        }
        
        Bed savedBed = bedRepository.save(bed);
        return BedResponse.fromBed(savedBed);
    }

    public void initializeBeds(String hospitalId, int numberOfBeds) {
        // Check if beds already exist for this hospital
        long existingBeds = bedRepository.countTotalBeds(hospitalId);
        if (existingBeds > 0) {
            throw new RuntimeException("Beds already initialized for this hospital");
        }
        
        // Create beds with numbers like "B001", "B002", etc.
        for (int i = 1; i <= numberOfBeds; i++) {
            String bedNumber = String.format("B%03d", i);
            
            Bed bed = Bed.builder()
                    .bedNumber(bedNumber)
                    .hospitalId(hospitalId)
                    .status(Bed.BedStatus.AVAILABLE)
                    .build();
            
            bedRepository.save(bed);
        }
    }

    public void addBeds(String hospitalId, int additionalBeds) {
        // Get the current highest bed number
        List<Bed> existingBeds = bedRepository.findByHospitalIdOrderByBedNumber(hospitalId);
        int startNumber = existingBeds.size() + 1;
        
        // Add new beds
        for (int i = 0; i < additionalBeds; i++) {
            String bedNumber = String.format("B%03d", startNumber + i);
            
            Bed bed = Bed.builder()
                    .bedNumber(bedNumber)
                    .hospitalId(hospitalId)
                    .status(Bed.BedStatus.AVAILABLE)
                    .build();
            
            bedRepository.save(bed);
        }
    }

    public void removeBeds(String hospitalId, int numberOfBeds) {
        // Get all beds for this hospital, ordered by bed number (highest first for removal)
        List<Bed> existingBeds = bedRepository.findByHospitalIdOrderByBedNumber(hospitalId);
        
        if (existingBeds.size() < numberOfBeds) {
            throw new RuntimeException("Cannot remove " + numberOfBeds + " beds. Only " + existingBeds.size() + " beds exist.");
        }
        
        // Check if any of the beds to be removed are occupied
        List<Bed> bedsToRemove = existingBeds.subList(existingBeds.size() - numberOfBeds, existingBeds.size());
        boolean hasOccupiedBeds = bedsToRemove.stream()
                .anyMatch(bed -> bed.getStatus() == Bed.BedStatus.OCCUPIED);
        
        if (hasOccupiedBeds) {
            throw new RuntimeException("Cannot remove beds that are currently occupied. Please free up the beds first.");
        }
        
        // Remove the highest numbered beds
        for (Bed bed : bedsToRemove) {
            bedRepository.delete(bed);
        }
    }

    private DoctorDTO mapToDTO(Doctor doctor) {
        User user = doctor.getUser();
        
        // Generate a default profile photo URL if none exists
        String profilePhotoUrl = user.getProfilePhotoUrl();
        if (profilePhotoUrl == null || profilePhotoUrl.isEmpty()) {
            // Use a service like UI Avatars or Gravatar for default photos
            String initials = getInitials(user.getFullName());
            profilePhotoUrl = "https://ui-avatars.com/api/?name=" + 
                            user.getFullName().replace(" ", "+") + 
                            "&background=0D8ABC&color=fff&size=200&bold=true";
        }
        
        // Safely get department name, handle null department
        String departmentName = null;
        if (doctor.getDepartment() != null) {
            departmentName = doctor.getDepartment().getName();
        }
        
        return DoctorDTO.builder()
                .id(doctor.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .department(departmentName)
                .phoneNumber(user.getPhoneNumber())
                .profilePhotoUrl(profilePhotoUrl)
                .isActive(user.isActive())
                .build();
    }
    
    private String getInitials(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "DR";
        }
        
        String[] parts = fullName.trim().split("\\s+");
        StringBuilder initials = new StringBuilder();
        
        for (int i = 0; i < Math.min(2, parts.length); i++) {
            if (!parts[i].isEmpty()) {
                initials.append(parts[i].charAt(0));
            }
        }
        
        return initials.length() > 0 ? initials.toString().toUpperCase() : "DR";
    }
}