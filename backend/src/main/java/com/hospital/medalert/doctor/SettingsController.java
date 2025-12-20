package com.hospital.medalert.doctor;

import com.hospital.medalert.user.User;
import com.hospital.medalert.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final UserRepository userRepository;

    @GetMapping("/loadData")
    public ResponseEntity<User> loadData(Authentication authentication) {
        return ResponseEntity.ok(
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"))
        );
    }

    @PostMapping("/saveSettings")
    public ResponseEntity<User> saveSettings(Authentication authentication, @RequestBody User incomingUpdates) {
        User existingUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Helper method to check if a string is valid (not null AND not empty)
        // You can also use: StringUtils.hasText(str) if you have Spring Framework utils imported

        // 1. Full Name
        if (incomingUpdates.getFullName() != null && !incomingUpdates.getFullName().trim().isEmpty()) {
            existingUser.setFullName(incomingUpdates.getFullName());
        }

        // 2. Phone
        if (incomingUpdates.getPhoneNumber() != null && !incomingUpdates.getPhoneNumber().trim().isEmpty()) {
            existingUser.setPhoneNumber(incomingUpdates.getPhoneNumber());
        }

        // 3. Address
        if (incomingUpdates.getAddress() != null && !incomingUpdates.getAddress().trim().isEmpty()) {
            existingUser.setAddress(incomingUpdates.getAddress());
        }

        // 4. Date of Birth (Objects are just null checked)
        if (incomingUpdates.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(incomingUpdates.getDateOfBirth());
        }

        // 5. Email (Strict Check)
        if (incomingUpdates.getEmail() != null
                && !incomingUpdates.getEmail().trim().isEmpty()
                && !incomingUpdates.getEmail().equals(existingUser.getEmail())) {

            if (userRepository.findByEmail(incomingUpdates.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use.");
            }
            existingUser.setEmail(incomingUpdates.getEmail());
        }

        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }
}