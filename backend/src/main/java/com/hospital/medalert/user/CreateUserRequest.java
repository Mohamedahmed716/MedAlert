package com.hospital.medalert.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;
    private String hospitalId;
    private String gender;
}