package com.hospital.medalert.hospital;

import com.hospital.medalert.dto.CreateDoctorRequest;
import com.hospital.medalert.dto.CreateDepartmentRequest;
import com.hospital.medalert.dto.ChangePasswordRequest;
import com.hospital.medalert.dto.DashboardStatsDTO;
import com.hospital.medalert.dto.DoctorDTO;
import com.hospital.medalert.models.Department;
import com.hospital.medalert.models.Doctor;
import com.hospital.medalert.repositories.DepartmentRepository;
import com.hospital.medalert.repositories.DoctorRepository;
import com.hospital.medalert.repositories.PatientRepository;
import com.hospital.medalert.repositories.ReservationRepository;
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

        // Create Doctor
        Department department = departmentRepository.findByHospitalIdAndName(request.getHospitalId(), request.getDepartment());
        var doctor = Doctor.builder()
                .user(savedUser)
                .department(department)
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
        Department department = departmentRepository.findByHospitalIdAndName(request.getHospitalId(), request.getDepartment());
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
        return DoctorDTO.builder()
                .id(doctor.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .department(doctor.getDepartment().getName())
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