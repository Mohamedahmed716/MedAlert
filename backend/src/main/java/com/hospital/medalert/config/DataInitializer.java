package com.hospital.medalert.config;

import com.hospital.medalert.hospital.Hospital;
import com.hospital.medalert.hospital.HospitalRepository;
import com.hospital.medalert.models.Department;
import com.hospital.medalert.repositories.DepartmentRepository;
import com.hospital.medalert.user.Role;
import com.hospital.medalert.user.User;
import com.hospital.medalert.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔄 DataInitializer running...");
        
        // Initialize hospitals
        long hospitalCount = hospitalRepository.count();
        System.out.println("📊 Current hospital count: " + hospitalCount);
        
        if (hospitalCount == 0) {
            System.out.println("🏥 No hospitals found, initializing...");
            initializeHospitals();
        } else {
            System.out.println("✅ Hospitals already exist, skipping initialization");
        }
        
        // Initialize system admin
        if (!userRepository.existsByRole(Role.SYSTEM_ADMIN)) {
            System.out.println("👤 No system admin found, creating default admin...");
            initializeSystemAdmin();
        } else {
            System.out.println("✅ System admin already exists, skipping initialization");
        }
        
        // Initialize hospital admins for each hospital
        initializeHospitalAdmins();
        
        // Initialize departments for each hospital
        initializeDepartments();
    }

    private void initializeHospitals() {
        Hospital[] hospitals = {
            Hospital.builder()
                .hospitalId("HOSP001")
                .name("City General Hospital")
                .streetAddress("123 Main Street")
                .city("New York")
                .state("NY")
                .zipCode("10001")
                .phoneNumber("(212) 555-0100")
                .website("www.citygeneralhospital.com")
                .status("OPERATIONAL")
                .build(),
            
            Hospital.builder()
                .hospitalId("HOSP002")
                .name("St. Mary Medical Center")
                .streetAddress("456 Oak Avenue")
                .city("Los Angeles")
                .state("CA")
                .zipCode("90210")
                .phoneNumber("(323) 555-0200")
                .website("www.stmarymedical.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP003")
                .name("Metropolitan Health System")
                .streetAddress("789 Pine Road")
                .city("Chicago")
                .state("IL")
                .zipCode("60601")
                .phoneNumber("(312) 555-0300")
                .website("www.metrohealth.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP004")
                .name("Riverside Community Hospital")
                .streetAddress("321 River Drive")
                .city("Houston")
                .state("TX")
                .zipCode("77001")
                .phoneNumber("(713) 555-0400")
                .website("www.riversidecommunity.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP005")
                .name("Phoenix Valley Medical")
                .streetAddress("654 Desert Blvd")
                .city("Phoenix")
                .state("AZ")
                .zipCode("85001")
                .phoneNumber("(602) 555-0500")
                .website("www.phoenixvalley.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP006")
                .name("Atlantic Coast Regional")
                .streetAddress("987 Coastal Highway")
                .city("Miami")
                .state("FL")
                .zipCode("33101")
                .phoneNumber("(305) 555-0600")
                .website("www.atlanticcoast.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP007")
                .name("Mountain View Hospital")
                .streetAddress("147 Summit Street")
                .city("Denver")
                .state("CO")
                .zipCode("80201")
                .phoneNumber("(303) 555-0700")
                .website("www.mountainviewhosp.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP008")
                .name("Pacific Northwest Medical")
                .streetAddress("258 Forest Lane")
                .city("Seattle")
                .state("WA")
                .zipCode("98101")
                .phoneNumber("(206) 555-0800")
                .website("www.pacificnwmed.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP009")
                .name("Sunshine State Hospital")
                .streetAddress("369 Palm Avenue")
                .city("Orlando")
                .state("FL")
                .zipCode("32801")
                .phoneNumber("(407) 555-0900")
                .website("www.sunshinestate.com")
                .status("OPERATIONAL")
                .build(),
                
            Hospital.builder()
                .hospitalId("HOSP010")
                .name("Great Lakes Medical Center")
                .streetAddress("741 Lakeshore Drive")
                .city("Detroit")
                .state("MI")
                .zipCode("48201")
                .phoneNumber("(313) 555-1000")
                .website("www.greatlakesmed.com")
                .status("OPERATIONAL")
                .build()
        };

        for (Hospital hospital : hospitals) {
            hospitalRepository.save(hospital);
        }
        
        System.out.println("✅ Initialized " + hospitals.length + " hospitals in the database");
    }
    
    private void initializeSystemAdmin() {
        User systemAdmin = User.builder()
                .fullName("System Administrator")
                .email("admin@medalert.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.SYSTEM_ADMIN)
                .isActive(true)
                .gender("Male")
                .build();
                
        userRepository.save(systemAdmin);
        System.out.println("✅ Created system admin account:");
        System.out.println("   📧 Email: admin@medalert.com");
        System.out.println("   🔑 Password: admin123");
    }
    
    private void initializeHospitalAdmins() {
        System.out.println("🏥 Creating hospital admin accounts...");
        
        // Get all hospitals
        var hospitals = hospitalRepository.findAll();
        int createdCount = 0;
        
        for (Hospital hospital : hospitals) {
            // Create email from hospital name (e.g., "City General Hospital" -> "admin@citygeneralhospital.com")
            String emailPrefix = hospital.getName()
                .toLowerCase()
                .replaceAll("[^a-z0-9]", ""); // Remove special characters and spaces
            String email = "admin@" + emailPrefix + ".com";
            
            // Check if admin already exists for this hospital
            if (userRepository.findByEmail(email).isEmpty()) {
                User hospitalAdmin = User.builder()
                        .fullName(hospital.getName() + " - Admin")
                        .email(email)
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.HOSPITAL_ADMIN)
                        .hospitalId(hospital.getHospitalId())
                        .isActive(true)
                        .gender("Male")
                        .build();
                        
                userRepository.save(hospitalAdmin);
                createdCount++;
                
                System.out.println("   ✅ Created admin for: " + hospital.getName());
                System.out.println("      📧 Email: " + email);
                System.out.println("      🔑 Password: admin123");
            }
        }
        
        if (createdCount > 0) {
            System.out.println("✅ Created " + createdCount + " hospital admin accounts");
        } else {
            System.out.println("✅ All hospital admin accounts already exist");
        }
    }
    
    private void initializeDepartments() {
        System.out.println("🏥 Creating departments for each hospital...");
        
        // Standard departments that every hospital should have
        String[] standardDepartments = {
            "Cardiology",
            "Neurology", 
            "Pediatrics",
            "Orthopedics",
            "Dermatology",
            "General Medicine",
            "Emergency Medicine",
            "Surgery",
            "Radiology",
            "Pathology",
            "Anesthesiology",
            "Psychiatry"
        };
        
        var hospitals = hospitalRepository.findAll();
        int totalCreated = 0;
        
        for (Hospital hospital : hospitals) {
            int createdForHospital = 0;
            
            for (String deptName : standardDepartments) {
                // Check if department already exists for this hospital
                var existingDepts = departmentRepository.findByHospitalId(hospital.getHospitalId());
                boolean exists = existingDepts.stream()
                    .anyMatch(dept -> dept.getName().equals(deptName));
                
                if (!exists) {
                    Department department = Department.builder()
                        .name(deptName)
                        .hospitalId(hospital.getHospitalId())
                        .description("Standard " + deptName + " department")
                        .isActive(true)
                        .build();
                    
                    departmentRepository.save(department);
                    createdForHospital++;
                    totalCreated++;
                }
            }
            
            if (createdForHospital > 0) {
                System.out.println("   ✅ Created " + createdForHospital + " departments for: " + hospital.getName());
            }
        }
        
        if (totalCreated > 0) {
            System.out.println("✅ Created " + totalCreated + " total departments across all hospitals");
        } else {
            System.out.println("✅ All departments already exist for all hospitals");
        }
    }
}