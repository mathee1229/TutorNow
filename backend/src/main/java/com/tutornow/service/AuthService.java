package com.tutornow.service;

import com.tutornow.dto.AuthDto;
import com.tutornow.model.Role;
import com.tutornow.model.TutorProfile;
import com.tutornow.model.TutorWallet;
import com.tutornow.model.User;
import com.tutornow.repository.TutorProfileRepository;
import com.tutornow.repository.TutorWalletRepository;
import com.tutornow.repository.UserRepository;
import com.tutornow.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final TutorWalletRepository tutorWalletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, TutorProfileRepository tutorProfileRepository,
                       TutorWalletRepository tutorWalletRepository, PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.tutorWalletRepository = tutorWalletRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .active(true)
                .build();

        user = userRepository.save(user);

        if (request.getRole() == Role.ROLE_TUTOR) {
            TutorProfile profile = TutorProfile.builder()
                    .user(user)
                    .university(request.getUniversity() != null ? request.getUniversity() : "Sri Lankan University")
                    .degreeField(request.getDegreeField() != null ? request.getDegreeField() : "Undergraduate")
                    .hourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : BigDecimal.valueOf(2000.00))
                    .bio(request.getBio())
                    .idProofUrl(request.getIdProofUrl())
                    .marksheetProofUrl(request.getMarksheetProofUrl())
                    .isVerified(false)
                    .ratingAvg(5.0)
                    .totalReviews(0)
                    .build();
            tutorProfileRepository.save(profile);

            TutorWallet wallet = TutorWallet.builder()
                    .tutor(user)
                    .availableBalance(BigDecimal.ZERO)
                    .pendingEscrowBalance(BigDecimal.ZERO)
                    .build();
            tutorWalletRepository.save(wallet);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("User registered successfully")
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful")
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }
}
