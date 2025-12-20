package com.hospital.medalert.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hospital.medalert.dto.ChangePasswordRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }
    
    public UserResponse getUserProfile(User user) {
        return mapToResponse(user);
    }

    public UserStatsResponse getStats() {
        return UserStatsResponse.builder()
                .totalUsers(repository.count())
                .activeUsers(repository.countActiveUsers())
                .pendingUsers(repository.countPendingUsers())
                .build();
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role = Role.valueOf(request.getRole().toUpperCase().replace(" ", "_"));

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .hospitalId(request.getHospitalId())
                .isActive(true)
                .gender(request.getGender() != null ? request.getGender() : "Male") 
                .build();
        
        var savedUser = repository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponse updateUser(Long id, CreateUserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Role role = Role.valueOf(request.getRole().toUpperCase().replace(" ", "_"));
        user.setRole(role);
        user.setHospitalId(request.getHospitalId());
        
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        repository.save(user);
        return mapToResponse(user);
    }

    public void toggleStatus(Long id, boolean isActive) {
        var user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(isActive);
        repository.save(user);
    }

    public void deleteUser(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole().name().equals("SYSTEM_ADMIN")) {
            throw new RuntimeException("Action denied: Cannot delete the System Admin account.");
        }

        repository.deleteById(id);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .hospitalId(user.getHospitalId())
                .isActive(user.isActive())
                .gender(user.getGender())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();
    }
}