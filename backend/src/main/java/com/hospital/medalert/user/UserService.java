package com.hospital.medalert.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        if (!repository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        repository.deleteById(id);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .hospitalId(user.getHospitalId())
                .isActive(user.isActive())
                .build();
    }
}