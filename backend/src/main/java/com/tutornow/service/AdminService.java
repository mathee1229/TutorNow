package com.tutornow.service;

import com.tutornow.dto.AdminDto;
import com.tutornow.model.*;
import com.tutornow.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final TutorWalletRepository tutorWalletRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final TutorApplicationRepository tutorApplicationRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        TutorProfileRepository tutorProfileRepository,
                        TutorWalletRepository tutorWalletRepository,
                        LessonRequestRepository lessonRequestRepository,
                        TutorApplicationRepository tutorApplicationRepository,
                        BookingRepository bookingRepository,
                        ReviewRepository reviewRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.tutorWalletRepository = tutorWalletRepository;
        this.lessonRequestRepository = lessonRequestRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminDto.PlatformStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
        long totalTutors = userRepository.countByRole(Role.ROLE_TUTOR);
        long totalAdmins = userRepository.countByRole(Role.ROLE_ADMIN);
        long activeUsers = userRepository.countByActive(true);
        long inactiveUsers = userRepository.countByActive(false);

        long totalRequests = lessonRequestRepository.count();
        long openRequests = lessonRequestRepository.countByStatus(RequestStatus.OPEN);
        long assignedRequests = lessonRequestRepository.countByStatus(RequestStatus.ASSIGNED);
        long completedRequests = lessonRequestRepository.countByStatus(RequestStatus.COMPLETED);
        long cancelledRequests = lessonRequestRepository.countByStatus(RequestStatus.CANCELLED);

        List<Booking> allBookings = bookingRepository.findAll();
        long totalBookings = allBookings.size();
        long pendingPaymentBookings = allBookings.stream().filter(b -> b.getPaymentStatus() == PaymentStatus.PENDING).count();
        long escrowHeldBookings = allBookings.stream().filter(b -> b.getPaymentStatus() == PaymentStatus.ESCROW_HELD).count();
        long releasedBookings = allBookings.stream().filter(b -> b.getPaymentStatus() == PaymentStatus.RELEASED_TO_TUTOR).count();

        BigDecimal totalEscrowVolume = BigDecimal.ZERO;
        BigDecimal totalPlatformRevenue = BigDecimal.ZERO;
        BigDecimal totalTutorEarnings = BigDecimal.ZERO;

        for (Booking b : allBookings) {
            if (b.getPaymentStatus() == PaymentStatus.ESCROW_HELD || b.getPaymentStatus() == PaymentStatus.RELEASED_TO_TUTOR) {
                totalEscrowVolume = totalEscrowVolume.add(b.getAgreedPrice() != null ? b.getAgreedPrice() : BigDecimal.ZERO);
                totalPlatformRevenue = totalPlatformRevenue.add(b.getPlatformFee() != null ? b.getPlatformFee() : BigDecimal.ZERO);
            }
            if (b.getPaymentStatus() == PaymentStatus.RELEASED_TO_TUTOR) {
                totalTutorEarnings = totalTutorEarnings.add(b.getTutorPayout() != null ? b.getTutorPayout() : BigDecimal.ZERO);
            }
        }

        long pendingVerifications = tutorProfileRepository.countByIsVerifiedFalse();
        long totalReviews = reviewRepository.count();

        return AdminDto.PlatformStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalTutors(totalTutors)
                .totalAdmins(totalAdmins)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .totalLessonRequests(totalRequests)
                .openLessonRequests(openRequests)
                .assignedLessonRequests(assignedRequests)
                .completedLessonRequests(completedRequests)
                .cancelledLessonRequests(cancelledRequests)
                .totalBookings(totalBookings)
                .pendingPaymentBookings(pendingPaymentBookings)
                .escrowHeldBookings(escrowHeldBookings)
                .releasedBookings(releasedBookings)
                .totalEscrowVolume(totalEscrowVolume)
                .totalPlatformRevenue(totalPlatformRevenue)
                .totalTutorEarnings(totalTutorEarnings)
                .pendingTutorVerifications(pendingVerifications)
                .totalReviews(totalReviews)
                .build();
    }

    public List<AdminDto.UserSummaryResponse> getAllUsers(String search, Role role, Boolean active) {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();

        return users.stream()
                .filter(u -> role == null || u.getRole() == role)
                .filter(u -> active == null || u.isActive() == active)
                .filter(u -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String s = search.toLowerCase().trim();
                    return (u.getFullName() != null && u.getFullName().toLowerCase().contains(s)) ||
                            (u.getEmail() != null && u.getEmail().toLowerCase().contains(s)) ||
                            (u.getPhoneNumber() != null && u.getPhoneNumber().contains(s));
                })
                .map(this::mapToUserSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDto.UserSummaryResponse toggleUserActive(Long userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new IllegalStateException("You cannot deactivate your own administrative account");
        }

        user.setActive(!user.isActive());
        user = userRepository.save(user);
        return mapToUserSummary(user);
    }

    @Transactional
    public AdminDto.UserSummaryResponse updateUserRole(Long userId, Role newRole, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (user.getEmail().equalsIgnoreCase(adminEmail) && newRole != Role.ROLE_ADMIN) {
            throw new IllegalStateException("You cannot remove your own admin role");
        }

        user.setRole(newRole);
        user = userRepository.save(user);

        if (newRole == Role.ROLE_TUTOR && tutorProfileRepository.findByUser(user).isEmpty()) {
            TutorProfile profile = TutorProfile.builder()
                    .user(user)
                    .university("Sri Lankan University")
                    .degreeField("Specialized Tutor")
                    .hourlyRate(BigDecimal.valueOf(2000.00))
                    .bio("Experienced Tutor")
                    .isVerified(false)
                    .ratingAvg(5.0)
                    .totalReviews(0)
                    .build();
            tutorProfileRepository.save(profile);

            if (tutorWalletRepository.findByTutor(user).isEmpty()) {
                TutorWallet wallet = TutorWallet.builder()
                        .tutor(user)
                        .availableBalance(BigDecimal.ZERO)
                        .pendingEscrowBalance(BigDecimal.ZERO)
                        .build();
                tutorWalletRepository.save(wallet);
            }
        }

        return mapToUserSummary(user);
    }

    @Transactional
    public AdminDto.UserSummaryResponse createUser(AdminDto.CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
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
                    .degreeField(request.getDegreeField() != null ? request.getDegreeField() : "Degree Field")
                    .hourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : BigDecimal.valueOf(2000.00))
                    .bio(request.getBio())
                    .isVerified(true) // Admin directly creating a tutor pre-verifies them
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

        return mapToUserSummary(user);
    }

    @Transactional
    public void deleteUser(Long userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new IllegalStateException("You cannot delete your own administrative account");
        }

        // Check if there are active bookings
        boolean hasBookings = !bookingRepository.findByStudentOrderByCreatedAtDesc(user).isEmpty() ||
                !bookingRepository.findByTutorOrderByCreatedAtDesc(user).isEmpty();
        if (hasBookings) {
            throw new IllegalStateException("Cannot permanently delete user who has existing booking records. Deactivate/block the user instead.");
        }

        // Clean up tutor profile and wallet if tutor
        tutorProfileRepository.findByUser(user).ifPresent(tutorProfileRepository::delete);
        tutorWalletRepository.findByTutor(user).ifPresent(tutorWalletRepository::delete);

        userRepository.delete(user);
    }

    public List<AdminDto.TutorVerificationItem> getTutorVerifications(Boolean pendingOnly) {
        List<TutorProfile> profiles = tutorProfileRepository.findAllByOrderByIdDesc();

        return profiles.stream()
                .filter(p -> pendingOnly == null || !pendingOnly || !p.isVerified())
                .map(this::mapToTutorVerification)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDto.TutorVerificationItem verifyTutor(Long profileId, boolean verified) {
        TutorProfile profile = tutorProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Tutor profile not found with ID: " + profileId));

        profile.setVerified(verified);
        profile = tutorProfileRepository.save(profile);
        return mapToTutorVerification(profile);
    }

    public List<AdminDto.AdminLessonRequestItem> getAllLessonRequests(String search, RequestStatus status) {
        List<LessonRequest> list = lessonRequestRepository.findAllByOrderByCreatedAtDesc();

        return list.stream()
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String s = search.toLowerCase().trim();
                    return (r.getSubject() != null && r.getSubject().toLowerCase().contains(s)) ||
                            (r.getLessonTopic() != null && r.getLessonTopic().toLowerCase().contains(s)) ||
                            (r.getStudent() != null && r.getStudent().getFullName().toLowerCase().contains(s)) ||
                            (r.getTownName() != null && r.getTownName().toLowerCase().contains(s));
                })
                .map(this::mapToAdminLessonRequest)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDto.AdminLessonRequestItem updateRequestStatus(Long requestId, RequestStatus status) {
        LessonRequest request = lessonRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson request not found with ID: " + requestId));

        request.setStatus(status);
        request = lessonRequestRepository.save(request);
        return mapToAdminLessonRequest(request);
    }

    @Transactional
    public void deleteLessonRequest(Long requestId) {
        LessonRequest request = lessonRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson request not found with ID: " + requestId));

        Optional<Booking> booking = bookingRepository.findByLessonRequestId(requestId);
        if (booking.isPresent()) {
            throw new IllegalStateException("Cannot delete lesson request associated with confirmed booking ID: " + booking.get().getId());
        }

        tutorApplicationRepository.deleteByLessonRequestId(requestId);
        lessonRequestRepository.delete(request);
    }

    public List<AdminDto.AdminBookingItem> getAllBookings(String search, PaymentStatus paymentStatus, BookingStatus bookingStatus) {
        List<Booking> list = bookingRepository.findAllByOrderByCreatedAtDesc();

        return list.stream()
                .filter(b -> paymentStatus == null || b.getPaymentStatus() == paymentStatus)
                .filter(b -> bookingStatus == null || b.getStatus() == bookingStatus)
                .filter(b -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String s = search.toLowerCase().trim();
                    return (b.getLessonRequest().getSubject() != null && b.getLessonRequest().getSubject().toLowerCase().contains(s)) ||
                            (b.getStudent().getFullName() != null && b.getStudent().getFullName().toLowerCase().contains(s)) ||
                            (b.getTutor().getFullName() != null && b.getTutor().getFullName().toLowerCase().contains(s));
                })
                .map(this::mapToAdminBooking)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDto.AdminBookingItem forceReleaseEscrow(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (booking.getPaymentStatus() != PaymentStatus.ESCROW_HELD) {
            throw new IllegalStateException("Payment status is not ESCROW_HELD. Current status: " + booking.getPaymentStatus());
        }

        booking.setPaymentStatus(PaymentStatus.RELEASED_TO_TUTOR);
        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);

        LessonRequest request = booking.getLessonRequest();
        request.setStatus(RequestStatus.COMPLETED);
        lessonRequestRepository.save(request);

        TutorWallet wallet = tutorWalletRepository.findByTutor(booking.getTutor())
                .orElseThrow(() -> new IllegalStateException("Tutor wallet not found"));

        wallet.setPendingEscrowBalance(wallet.getPendingEscrowBalance().subtract(booking.getTutorPayout()));
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(booking.getTutorPayout()));
        tutorWalletRepository.save(wallet);

        return mapToAdminBooking(booking);
    }

    @Transactional
    public AdminDto.AdminBookingItem refundEscrow(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (booking.getPaymentStatus() == PaymentStatus.ESCROW_HELD) {
            TutorWallet wallet = tutorWalletRepository.findByTutor(booking.getTutor()).orElse(null);
            if (wallet != null) {
                wallet.setPendingEscrowBalance(wallet.getPendingEscrowBalance().subtract(booking.getTutorPayout()));
                tutorWalletRepository.save(wallet);
            }
        }

        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        booking.setStatus(BookingStatus.DISPUTED);
        booking = bookingRepository.save(booking);

        LessonRequest request = booking.getLessonRequest();
        request.setStatus(RequestStatus.CANCELLED);
        lessonRequestRepository.save(request);

        return mapToAdminBooking(booking);
    }

    public List<AdminDto.AdminReviewItem> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(r -> AdminDto.AdminReviewItem.builder()
                        .id(r.getId())
                        .bookingId(r.getBooking() != null ? r.getBooking().getId() : null)
                        .reviewerId(r.getReviewer().getId())
                        .reviewerName(r.getReviewer().getFullName())
                        .reviewerEmail(r.getReviewer().getEmail())
                        .revieweeId(r.getReviewee().getId())
                        .revieweeName(r.getReviewee().getFullName())
                        .revieweeEmail(r.getReviewee().getEmail())
                        .rating(r.getRating())
                        .feedbackText(r.getFeedbackText())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + reviewId));

        User reviewee = review.getReviewee();
        reviewRepository.delete(review);

        tutorProfileRepository.findByUser(reviewee).ifPresent(profile -> {
            List<Review> remaining = reviewRepository.findByRevieweeOrderByCreatedAtDesc(reviewee);
            double avg = remaining.isEmpty() ? 5.0 : remaining.stream().mapToInt(Review::getRating).average().orElse(5.0);
            profile.setRatingAvg(Math.round(avg * 10.0) / 10.0);
            profile.setTotalReviews(remaining.size());
            tutorProfileRepository.save(profile);
        });
    }

    private AdminDto.UserSummaryResponse mapToUserSummary(User u) {
        Optional<TutorProfile> profile = u.getRole() == Role.ROLE_TUTOR ? tutorProfileRepository.findByUser(u) : Optional.empty();

        return AdminDto.UserSummaryResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .role(u.getRole())
                .active(u.isActive())
                .createdAt(u.getCreatedAt())
                .tutorProfileId(profile.map(TutorProfile::getId).orElse(null))
                .isVerifiedTutor(profile.map(TutorProfile::isVerified).orElse(null))
                .university(profile.map(TutorProfile::getUniversity).orElse(null))
                .degreeField(profile.map(TutorProfile::getDegreeField).orElse(null))
                .build();
    }

    private AdminDto.TutorVerificationItem mapToTutorVerification(TutorProfile p) {
        return AdminDto.TutorVerificationItem.builder()
                .profileId(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .phoneNumber(p.getUser().getPhoneNumber())
                .university(p.getUniversity())
                .degreeField(p.getDegreeField())
                .hourlyRate(p.getHourlyRate())
                .bio(p.getBio())
                .idProofUrl(p.getIdProofUrl())
                .marksheetProofUrl(p.getMarksheetProofUrl())
                .isVerified(p.isVerified())
                .ratingAvg(p.getRatingAvg())
                .totalReviews(p.getTotalReviews())
                .createdAt(p.getUser().getCreatedAt())
                .build();
    }

    private AdminDto.AdminLessonRequestItem mapToAdminLessonRequest(LessonRequest r) {
        long bidsCount = tutorApplicationRepository.countByLessonRequestId(r.getId());

        return AdminDto.AdminLessonRequestItem.builder()
                .id(r.getId())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getFullName())
                .studentEmail(r.getStudent().getEmail())
                .subject(r.getSubject())
                .lessonTopic(r.getLessonTopic())
                .studentGrade(r.getStudentGrade())
                .targetBudget(r.getTargetBudget())
                .deliveryMode(r.getDeliveryMode())
                .townName(r.getTownName())
                .fullAddress(r.getFullAddress())
                .attachmentUrls(r.getAttachmentUrls())
                .status(r.getStatus())
                .preferredSlot(r.getPreferredSlot())
                .createdAt(r.getCreatedAt())
                .bidsCount(bidsCount)
                .build();
    }

    private AdminDto.AdminBookingItem mapToAdminBooking(Booking b) {
        return AdminDto.AdminBookingItem.builder()
                .id(b.getId())
                .lessonRequestId(b.getLessonRequest().getId())
                .subject(b.getLessonRequest().getSubject())
                .lessonTopic(b.getLessonRequest().getLessonTopic())
                .studentId(b.getStudent().getId())
                .studentName(b.getStudent().getFullName())
                .studentEmail(b.getStudent().getEmail())
                .tutorId(b.getTutor().getId())
                .tutorName(b.getTutor().getFullName())
                .tutorEmail(b.getTutor().getEmail())
                .agreedPrice(b.getAgreedPrice())
                .platformFee(b.getPlatformFee())
                .tutorPayout(b.getTutorPayout())
                .paymentStatus(b.getPaymentStatus())
                .bookingStatus(b.getStatus())
                .payherePaymentId(b.getPayherePaymentId())
                .meetingLink(b.getMeetingLink())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
