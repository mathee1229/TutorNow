package com.tutornow.config;

import com.tutornow.dto.AuthDto;
import com.tutornow.dto.BidDto;
import com.tutornow.dto.LessonRequestDto;
import com.tutornow.model.DeliveryMode;
import com.tutornow.model.Role;
import com.tutornow.repository.UserRepository;
import com.tutornow.service.AuthService;
import com.tutornow.service.BidService;
import com.tutornow.service.LessonRequestService;
import com.tutornow.service.TutorService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final LessonRequestService lessonRequestService;
    private final BidService bidService;
    private final TutorService tutorService;

    public DataInitializer(UserRepository userRepository, AuthService authService,
                           LessonRequestService lessonRequestService, BidService bidService,
                           TutorService tutorService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.lessonRequestService = lessonRequestService;
        this.bidService = bidService;
        this.tutorService = tutorService;
    }

    @Value("${app.demo-data.enabled:true}")
    private boolean demoDataEnabled;

    @Value("${app.bootstrap.admin-email:}")
    private String adminEmail;

    @Value("${app.bootstrap.admin-password:}")
    private String adminPassword;

    private void initializeAdmin() {
        if (userRepository.countByRole(Role.ROLE_ADMIN) > 0) {
            return;
        }

        if (adminEmail.isBlank() || adminPassword.length() < 16) {
            throw new IllegalStateException(
                    "Set TUTORNOW_ADMIN_EMAIL and a TUTORNOW_ADMIN_PASSWORD of at least 16 characters");
        }

        authService.register(AuthDto.RegisterRequest.builder()
                .fullName("TutorNow Admin")
                .email(adminEmail.strip())
                .password(adminPassword)
                .role(Role.ROLE_ADMIN)
                .build());
    }

    @Override
    public void run(String... args) {
        if (!demoDataEnabled) {
            initializeAdmin();
            return;
        }

        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Admin
        authService.register(AuthDto.RegisterRequest.builder()
                .fullName("TutorNow Admin")
                .email("admin@tutornow.lk")
                .password("admin123")
                .phoneNumber("0771234567")
                .role(Role.ROLE_ADMIN)
                .build());

        // 2. Create Sample Verified Tutors
        authService.register(AuthDto.RegisterRequest.builder()
                .fullName("Kavindu Perera")
                .email("kavindu@tutors.lk")
                .password("tutor123")
                .phoneNumber("0719876543")
                .role(Role.ROLE_TUTOR)
                .university("University of Moratuwa")
                .degreeField("BSc Eng (Hons) in Electronic & Telecommunication")
                .hourlyRate(BigDecimal.valueOf(2500.00))
                .bio("Specialized in A/L Combined Maths (Pure & Applied). 4+ years of tutoring experience with island-rank results.")
                .idProofUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?w=400")
                .marksheetProofUrl("https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400")
                .build());

        authService.register(AuthDto.RegisterRequest.builder()
                .fullName("Nethmi Senanayake")
                .email("nethmi@tutors.lk")
                .password("tutor123")
                .phoneNumber("0723456789")
                .role(Role.ROLE_TUTOR)
                .university("University of Colombo")
                .degreeField("BSc (Hons) in Chemistry & Molecular Biology")
                .hourlyRate(BigDecimal.valueOf(2200.00))
                .bio("Conducting target unit revisions and paper discussion for A/L & Cambridge Chemistry.")
                .idProofUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400")
                .marksheetProofUrl("https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400")
                .build());

        // Verify tutors
        tutorService.verifyTutor(1L, true);
        tutorService.verifyTutor(2L, true);

        // 3. Create Sample Student
        authService.register(AuthDto.RegisterRequest.builder()
                .fullName("Sandun Jayawardena")
                .email("sandun@student.lk")
                .password("student123")
                .phoneNumber("0775551234")
                .role(Role.ROLE_STUDENT)
                .build());

        // 4. Create Sample Lesson Requests
        var req1 = lessonRequestService.createRequest("sandun@student.lk", LessonRequestDto.CreateLessonRequest.builder()
                .subject("Combined Mathematics")
                .lessonTopic("Integration by Parts & Trigonometric Substitutions")
                .studentGrade("A/L 2026")
                .targetBudget(BigDecimal.valueOf(3000.00))
                .preferredSlot(LocalDateTime.now().plusDays(2).withHour(18).withMinute(0))
                .deliveryMode(DeliveryMode.ONLINE)
                .townName("Colombo / Online")
                .fullAddress("Online Session")
                .attachmentUrls("https://tutornow.lk/sample-pastpaper-q4.pdf")
                .build());

        var req2 = lessonRequestService.createRequest("sandun@student.lk", LessonRequestDto.CreateLessonRequest.builder()
                .subject("Physics")
                .lessonTopic("Current Electricity & Kirchhoff's Laws Circuit Analysis")
                .studentGrade("A/L 2026")
                .targetBudget(BigDecimal.valueOf(2800.00))
                .preferredSlot(LocalDateTime.now().plusDays(3).withHour(16).withMinute(30))
                .deliveryMode(DeliveryMode.PHYSICAL)
                .townName("Nugegoda")
                .latitude(6.8649)
                .longitude(79.8997)
                .fullAddress("No. 45/2, Chapel Road, Nugegoda (Exact residence)")
                .attachmentUrls(null)
                .build());

        // 5. Submit Initial Sample Bids
        bidService.submitBid("kavindu@tutors.lk", req1.getId(), new BidDto.CreateBid(
                BigDecimal.valueOf(2800.00),
                "Hi Sandun, I can cover the theory behind Integration by Parts and solve 5 standard past paper questions in a 2-hour focused session with whiteboard screen sharing.",
                LocalDateTime.now().plusDays(2).withHour(18).withMinute(0)
        ));

        bidService.submitBid("kavindu@tutors.lk", req2.getId(), new BidDto.CreateBid(
                BigDecimal.valueOf(2800.00),
                "I live near Nugegoda junction and can visit your study area for direct paper problem discussion with physical notes.",
                LocalDateTime.now().plusDays(3).withHour(16).withMinute(30)
        ));
    }
}
