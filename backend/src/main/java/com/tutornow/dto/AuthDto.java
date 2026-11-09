package com.tutornow.dto;

import com.tutornow.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class AuthDto {

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "[0-9]{10}", message = "Phone number must contain exactly 10 digits")
        private String phoneNumber;

        @NotNull(message = "Role is required")
        private Role role;

        private String university;
        private String degreeField;
        private BigDecimal hourlyRate;
        private String bio;
        private String idProofUrl;
        private String marksheetProofUrl;

        public RegisterRequest() {}

        public RegisterRequest(String fullName, String email, String password, String phoneNumber, Role role,
                               String university, String degreeField, BigDecimal hourlyRate, String bio,
                               String idProofUrl, String marksheetProofUrl) {
            this.fullName = fullName;
            this.email = email;
            this.password = password;
            this.phoneNumber = phoneNumber;
            this.role = role;
            this.university = university;
            this.degreeField = degreeField;
            this.hourlyRate = hourlyRate;
            this.bio = bio;
            this.idProofUrl = idProofUrl;
            this.marksheetProofUrl = marksheetProofUrl;
        }

        public static RegisterRequestBuilder builder() {
            return new RegisterRequestBuilder();
        }

        public static class RegisterRequestBuilder {
            private String fullName;
            private String email;
            private String password;
            private String phoneNumber;
            private Role role;
            private String university;
            private String degreeField;
            private BigDecimal hourlyRate;
            private String bio;
            private String idProofUrl;
            private String marksheetProofUrl;

            public RegisterRequestBuilder fullName(String fullName) { this.fullName = fullName; return this; }
            public RegisterRequestBuilder email(String email) { this.email = email; return this; }
            public RegisterRequestBuilder password(String password) { this.password = password; return this; }
            public RegisterRequestBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
            public RegisterRequestBuilder role(Role role) { this.role = role; return this; }
            public RegisterRequestBuilder university(String university) { this.university = university; return this; }
            public RegisterRequestBuilder degreeField(String degreeField) { this.degreeField = degreeField; return this; }
            public RegisterRequestBuilder hourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; return this; }
            public RegisterRequestBuilder bio(String bio) { this.bio = bio; return this; }
            public RegisterRequestBuilder idProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; return this; }
            public RegisterRequestBuilder marksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; return this; }

            public RegisterRequest build() {
                return new RegisterRequest(fullName, email, password, phoneNumber, role, university, degreeField, hourlyRate, bio, idProofUrl, marksheetProofUrl);
            }
        }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getUniversity() { return university; }
        public void setUniversity(String university) { this.university = university; }
        public String getDegreeField() { return degreeField; }
        public void setDegreeField(String degreeField) { this.degreeField = degreeField; }
        public BigDecimal getHourlyRate() { return hourlyRate; }
        public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getIdProofUrl() { return idProofUrl; }
        public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }
        public String getMarksheetProofUrl() { return marksheetProofUrl; }
        public void setMarksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String message;

        public AuthResponse() {}
        public AuthResponse(String token, Long id, String fullName, String email, String role, String message) {
            this.token = token;
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.message = message;
        }

        public static AuthResponseBuilder builder() {
            return new AuthResponseBuilder();
        }

        public static class AuthResponseBuilder {
            private String token;
            private Long id;
            private String fullName;
            private String email;
            private String role;
            private String message;

            public AuthResponseBuilder token(String token) { this.token = token; return this; }
            public AuthResponseBuilder id(Long id) { this.id = id; return this; }
            public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
            public AuthResponseBuilder email(String email) { this.email = email; return this; }
            public AuthResponseBuilder role(String role) { this.role = role; return this; }
            public AuthResponseBuilder message(String message) { this.message = message; return this; }

            public AuthResponse build() {
                return new AuthResponse(token, id, fullName, email, role, message);
            }
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
