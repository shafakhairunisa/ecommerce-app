package my.stiwk2124.qurba.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String email;
    private String currentPassword;  // Required for password change
    private String newPassword;      // Optional, only if changing password
    private String gender;
    private String bio;
    private String address;
    private String phoneNumber;
    private LocalDate dateOfBirth;
}