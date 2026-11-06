package com.tutornow.dto;

import com.tutornow.model.BookingStatus;
import com.tutornow.model.DeliveryMode;
import com.tutornow.model.PaymentStatus;
import com.tutornow.model.RequestStatus;
import com.tutornow.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminDto {

    public static class PlatformStatsResponse {
        private long totalUsers;
        private long totalStudents;
        private long totalTutors;
        private long totalAdmins;
        private long activeUsers;
        private long inactiveUsers;
        private long totalLessonRequests;
        private long openLessonRequests;
        private long assignedLessonRequests;
        private long completedLessonRequests;
        private long cancelledLessonRequests;
        private long totalBookings;
        private long pendingPaymentBookings;
        private long escrowHeldBookings;
        private long releasedBookings;
        private BigDecimal totalEscrowVolume;
        private BigDecimal totalPlatformRevenue;
        private BigDecimal totalTutorEarnings;
        private long pendingTutorVerifications;
        private long totalReviews;

        public PlatformStatsResponse() {}

        public PlatformStatsResponse(long totalUsers, long totalStudents, long totalTutors, long totalAdmins,
                                     long activeUsers, long inactiveUsers, long totalLessonRequests,
                                     long openLessonRequests, long assignedLessonRequests,
                                     long completedLessonRequests, long cancelledLessonRequests,
                                     long totalBookings, long pendingPaymentBookings, long escrowHeldBookings,
                                     long releasedBookings, BigDecimal totalEscrowVolume,
                                     BigDecimal totalPlatformRevenue, BigDecimal totalTutorEarnings,
                                     long pendingTutorVerifications, long totalReviews) {
            this.totalUsers = totalUsers;
            this.totalStudents = totalStudents;
            this.totalTutors = totalTutors;
            this.totalAdmins = totalAdmins;
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.totalLessonRequests = totalLessonRequests;
            this.openLessonRequests = openLessonRequests;
            this.assignedLessonRequests = assignedLessonRequests;
            this.completedLessonRequests = completedLessonRequests;
            this.cancelledLessonRequests = cancelledLessonRequests;
            this.totalBookings = totalBookings;
            this.pendingPaymentBookings = pendingPaymentBookings;
            this.escrowHeldBookings = escrowHeldBookings;
            this.releasedBookings = releasedBookings;
            this.totalEscrowVolume = totalEscrowVolume;
            this.totalPlatformRevenue = totalPlatformRevenue;
            this.totalTutorEarnings = totalTutorEarnings;
            this.pendingTutorVerifications = pendingTutorVerifications;
            this.totalReviews = totalReviews;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private long totalUsers;
            private long totalStudents;
            private long totalTutors;
            private long totalAdmins;
            private long activeUsers;
            private long inactiveUsers;
            private long totalLessonRequests;
            private long openLessonRequests;
            private long assignedLessonRequests;
            private long completedLessonRequests;
            private long cancelledLessonRequests;
            private long totalBookings;
            private long pendingPaymentBookings;
            private long escrowHeldBookings;
            private long releasedBookings;
            private BigDecimal totalEscrowVolume = BigDecimal.ZERO;
            private BigDecimal totalPlatformRevenue = BigDecimal.ZERO;
            private BigDecimal totalTutorEarnings = BigDecimal.ZERO;
            private long pendingTutorVerifications;
            private long totalReviews;

            public Builder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
            public Builder totalStudents(long totalStudents) { this.totalStudents = totalStudents; return this; }
            public Builder totalTutors(long totalTutors) { this.totalTutors = totalTutors; return this; }
            public Builder totalAdmins(long totalAdmins) { this.totalAdmins = totalAdmins; return this; }
            public Builder activeUsers(long activeUsers) { this.activeUsers = activeUsers; return this; }
            public Builder inactiveUsers(long inactiveUsers) { this.inactiveUsers = inactiveUsers; return this; }
            public Builder totalLessonRequests(long totalLessonRequests) { this.totalLessonRequests = totalLessonRequests; return this; }
            public Builder openLessonRequests(long openLessonRequests) { this.openLessonRequests = openLessonRequests; return this; }
            public Builder assignedLessonRequests(long assignedLessonRequests) { this.assignedLessonRequests = assignedLessonRequests; return this; }
            public Builder completedLessonRequests(long completedLessonRequests) { this.completedLessonRequests = completedLessonRequests; return this; }
            public Builder cancelledLessonRequests(long cancelledLessonRequests) { this.cancelledLessonRequests = cancelledLessonRequests; return this; }
            public Builder totalBookings(long totalBookings) { this.totalBookings = totalBookings; return this; }
            public Builder pendingPaymentBookings(long pendingPaymentBookings) { this.pendingPaymentBookings = pendingPaymentBookings; return this; }
            public Builder escrowHeldBookings(long escrowHeldBookings) { this.escrowHeldBookings = escrowHeldBookings; return this; }
            public Builder releasedBookings(long releasedBookings) { this.releasedBookings = releasedBookings; return this; }
            public Builder totalEscrowVolume(BigDecimal totalEscrowVolume) { this.totalEscrowVolume = totalEscrowVolume; return this; }
            public Builder totalPlatformRevenue(BigDecimal totalPlatformRevenue) { this.totalPlatformRevenue = totalPlatformRevenue; return this; }
            public Builder totalTutorEarnings(BigDecimal totalTutorEarnings) { this.totalTutorEarnings = totalTutorEarnings; return this; }
            public Builder pendingTutorVerifications(long pendingTutorVerifications) { this.pendingTutorVerifications = pendingTutorVerifications; return this; }
            public Builder totalReviews(long totalReviews) { this.totalReviews = totalReviews; return this; }

            public PlatformStatsResponse build() {
                return new PlatformStatsResponse(totalUsers, totalStudents, totalTutors, totalAdmins, activeUsers,
                        inactiveUsers, totalLessonRequests, openLessonRequests, assignedLessonRequests,
                        completedLessonRequests, cancelledLessonRequests, totalBookings, pendingPaymentBookings,
                        escrowHeldBookings, releasedBookings, totalEscrowVolume, totalPlatformRevenue,
                        totalTutorEarnings, pendingTutorVerifications, totalReviews);
            }
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getTotalStudents() { return totalStudents; }
        public long getTotalTutors() { return totalTutors; }
        public long getTotalAdmins() { return totalAdmins; }
        public long getActiveUsers() { return activeUsers; }
        public long getInactiveUsers() { return inactiveUsers; }
        public long getTotalLessonRequests() { return totalLessonRequests; }
        public long getOpenLessonRequests() { return openLessonRequests; }
        public long getAssignedLessonRequests() { return assignedLessonRequests; }
        public long getCompletedLessonRequests() { return completedLessonRequests; }
        public long getCancelledLessonRequests() { return cancelledLessonRequests; }
        public long getTotalBookings() { return totalBookings; }
        public long getPendingPaymentBookings() { return pendingPaymentBookings; }
        public long getEscrowHeldBookings() { return escrowHeldBookings; }
        public long getReleasedBookings() { return releasedBookings; }
        public BigDecimal getTotalEscrowVolume() { return totalEscrowVolume; }
        public BigDecimal getTotalPlatformRevenue() { return totalPlatformRevenue; }
        public BigDecimal getTotalTutorEarnings() { return totalTutorEarnings; }
        public long getPendingTutorVerifications() { return pendingTutorVerifications; }
        public long getTotalReviews() { return totalReviews; }
    }

    public static class UserSummaryResponse {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private Role role;
        private boolean active;
        private LocalDateTime createdAt;
        private Long tutorProfileId;
        private Boolean isVerifiedTutor;
        private String university;
        private String degreeField;

        public UserSummaryResponse() {}

        public UserSummaryResponse(Long id, String fullName, String email, String phoneNumber, Role role,
                                   boolean active, LocalDateTime createdAt, Long tutorProfileId,
                                   Boolean isVerifiedTutor, String university, String degreeField) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.role = role;
            this.active = active;
            this.createdAt = createdAt;
            this.tutorProfileId = tutorProfileId;
            this.isVerifiedTutor = isVerifiedTutor;
            this.university = university;
            this.degreeField = degreeField;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long id;
            private String fullName;
            private String email;
            private String phoneNumber;
            private Role role;
            private boolean active;
            private LocalDateTime createdAt;
            private Long tutorProfileId;
            private Boolean isVerifiedTutor;
            private String university;
            private String degreeField;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder fullName(String fullName) { this.fullName = fullName; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
            public Builder role(Role role) { this.role = role; return this; }
            public Builder active(boolean active) { this.active = active; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public Builder tutorProfileId(Long tutorProfileId) { this.tutorProfileId = tutorProfileId; return this; }
            public Builder isVerifiedTutor(Boolean isVerifiedTutor) { this.isVerifiedTutor = isVerifiedTutor; return this; }
            public Builder university(String university) { this.university = university; return this; }
            public Builder degreeField(String degreeField) { this.degreeField = degreeField; return this; }

            public UserSummaryResponse build() {
                return new UserSummaryResponse(id, fullName, email, phoneNumber, role, active, createdAt,
                        tutorProfileId, isVerifiedTutor, university, degreeField);
            }
        }

        // Getters
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhoneNumber() { return phoneNumber; }
        public Role getRole() { return role; }
        public boolean isActive() { return active; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public Long getTutorProfileId() { return tutorProfileId; }
        public Boolean getIsVerifiedTutor() { return isVerifiedTutor; }
        public String getUniversity() { return university; }
        public String getDegreeField() { return degreeField; }
    }

    public static class CreateUserRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String phoneNumber;

        @NotNull(message = "Role is required")
        private Role role;

        private String university;
        private String degreeField;
        private BigDecimal hourlyRate;
        private String bio;

        public CreateUserRequest() {}

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
    }

    public static class UpdateRoleRequest {
        @NotNull(message = "Role is required")
        private Role role;

        public UpdateRoleRequest() {}
        public UpdateRoleRequest(Role role) { this.role = role; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }

    public static class TutorVerificationItem {
        private Long profileId;
        private Long userId;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String university;
        private String degreeField;
        private BigDecimal hourlyRate;
        private String bio;
        private String idProofUrl;
        private String marksheetProofUrl;
        private boolean isVerified;
        private Double ratingAvg;
        private Integer totalReviews;
        private LocalDateTime createdAt;

        public TutorVerificationItem() {}

        public TutorVerificationItem(Long profileId, Long userId, String fullName, String email,
                                     String phoneNumber, String university, String degreeField,
                                     BigDecimal hourlyRate, String bio, String idProofUrl,
                                     String marksheetProofUrl, boolean isVerified, Double ratingAvg,
                                     Integer totalReviews, LocalDateTime createdAt) {
            this.profileId = profileId;
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.university = university;
            this.degreeField = degreeField;
            this.hourlyRate = hourlyRate;
            this.bio = bio;
            this.idProofUrl = idProofUrl;
            this.marksheetProofUrl = marksheetProofUrl;
            this.isVerified = isVerified;
            this.ratingAvg = ratingAvg;
            this.totalReviews = totalReviews;
            this.createdAt = createdAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long profileId;
            private Long userId;
            private String fullName;
            private String email;
            private String phoneNumber;
            private String university;
            private String degreeField;
            private BigDecimal hourlyRate;
            private String bio;
            private String idProofUrl;
            private String marksheetProofUrl;
            private boolean isVerified;
            private Double ratingAvg;
            private Integer totalReviews;
            private LocalDateTime createdAt;

            public Builder profileId(Long profileId) { this.profileId = profileId; return this; }
            public Builder userId(Long userId) { this.userId = userId; return this; }
            public Builder fullName(String fullName) { this.fullName = fullName; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
            public Builder university(String university) { this.university = university; return this; }
            public Builder degreeField(String degreeField) { this.degreeField = degreeField; return this; }
            public Builder hourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; return this; }
            public Builder bio(String bio) { this.bio = bio; return this; }
            public Builder idProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; return this; }
            public Builder marksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; return this; }
            public Builder isVerified(boolean isVerified) { this.isVerified = isVerified; return this; }
            public Builder ratingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; return this; }
            public Builder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public TutorVerificationItem build() {
                return new TutorVerificationItem(profileId, userId, fullName, email, phoneNumber, university,
                        degreeField, hourlyRate, bio, idProofUrl, marksheetProofUrl, isVerified, ratingAvg,
                        totalReviews, createdAt);
            }
        }

        public Long getProfileId() { return profileId; }
        public Long getUserId() { return userId; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getUniversity() { return university; }
        public String getDegreeField() { return degreeField; }
        public BigDecimal getHourlyRate() { return hourlyRate; }
        public String getBio() { return bio; }
        public String getIdProofUrl() { return idProofUrl; }
        public String getMarksheetProofUrl() { return marksheetProofUrl; }
        public boolean isVerified() { return isVerified; }
        public Double getRatingAvg() { return ratingAvg; }
        public Integer getTotalReviews() { return totalReviews; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public static class AdminLessonRequestItem {
        private Long id;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String subject;
        private String lessonTopic;
        private String studentGrade;
        private BigDecimal targetBudget;
        private DeliveryMode deliveryMode;
        private String townName;
        private String fullAddress;
        private String attachmentUrls;
        private RequestStatus status;
        private LocalDateTime preferredSlot;
        private LocalDateTime createdAt;
        private long bidsCount;

        public AdminLessonRequestItem() {}

        public AdminLessonRequestItem(Long id, Long studentId, String studentName, String studentEmail,
                                      String subject, String lessonTopic, String studentGrade,
                                      BigDecimal targetBudget, DeliveryMode deliveryMode, String townName,
                                      String fullAddress, String attachmentUrls, RequestStatus status,
                                      LocalDateTime preferredSlot, LocalDateTime createdAt, long bidsCount) {
            this.id = id;
            this.studentId = studentId;
            this.studentName = studentName;
            this.studentEmail = studentEmail;
            this.subject = subject;
            this.lessonTopic = lessonTopic;
            this.studentGrade = studentGrade;
            this.targetBudget = targetBudget;
            this.deliveryMode = deliveryMode;
            this.townName = townName;
            this.fullAddress = fullAddress;
            this.attachmentUrls = attachmentUrls;
            this.status = status;
            this.preferredSlot = preferredSlot;
            this.createdAt = createdAt;
            this.bidsCount = bidsCount;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long studentId;
            private String studentName;
            private String studentEmail;
            private String subject;
            private String lessonTopic;
            private String studentGrade;
            private BigDecimal targetBudget;
            private DeliveryMode deliveryMode;
            private String townName;
            private String fullAddress;
            private String attachmentUrls;
            private RequestStatus status;
            private LocalDateTime preferredSlot;
            private LocalDateTime createdAt;
            private long bidsCount;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
            public Builder studentName(String studentName) { this.studentName = studentName; return this; }
            public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
            public Builder subject(String subject) { this.subject = subject; return this; }
            public Builder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
            public Builder studentGrade(String studentGrade) { this.studentGrade = studentGrade; return this; }
            public Builder targetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; return this; }
            public Builder deliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; return this; }
            public Builder townName(String townName) { this.townName = townName; return this; }
            public Builder fullAddress(String fullAddress) { this.fullAddress = fullAddress; return this; }
            public Builder attachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; return this; }
            public Builder status(RequestStatus status) { this.status = status; return this; }
            public Builder preferredSlot(LocalDateTime preferredSlot) { this.preferredSlot = preferredSlot; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public Builder bidsCount(long bidsCount) { this.bidsCount = bidsCount; return this; }

            public AdminLessonRequestItem build() {
                return new AdminLessonRequestItem(id, studentId, studentName, studentEmail, subject,
                        lessonTopic, studentGrade, targetBudget, deliveryMode, townName, fullAddress,
                        attachmentUrls, status, preferredSlot, createdAt, bidsCount);
            }
        }

        public Long getId() { return id; }
        public Long getStudentId() { return studentId; }
        public String getStudentName() { return studentName; }
        public String getStudentEmail() { return studentEmail; }
        public String getSubject() { return subject; }
        public String getLessonTopic() { return lessonTopic; }
        public String getStudentGrade() { return studentGrade; }
        public BigDecimal getTargetBudget() { return targetBudget; }
        public DeliveryMode getDeliveryMode() { return deliveryMode; }
        public String getTownName() { return townName; }
        public String getFullAddress() { return fullAddress; }
        public String getAttachmentUrls() { return attachmentUrls; }
        public RequestStatus getStatus() { return status; }
        public LocalDateTime getPreferredSlot() { return preferredSlot; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public long getBidsCount() { return bidsCount; }
    }

    public static class AdminBookingItem {
        private Long id;
        private Long lessonRequestId;
        private String subject;
        private String lessonTopic;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private Long tutorId;
        private String tutorName;
        private String tutorEmail;
        private BigDecimal agreedPrice;
        private BigDecimal platformFee;
        private BigDecimal tutorPayout;
        private PaymentStatus paymentStatus;
        private BookingStatus bookingStatus;
        private String payherePaymentId;
        private String meetingLink;
        private LocalDateTime createdAt;

        public AdminBookingItem() {}

        public AdminBookingItem(Long id, Long lessonRequestId, String subject, String lessonTopic,
                                Long studentId, String studentName, String studentEmail,
                                Long tutorId, String tutorName, String tutorEmail,
                                BigDecimal agreedPrice, BigDecimal platformFee, BigDecimal tutorPayout,
                                PaymentStatus paymentStatus, BookingStatus bookingStatus,
                                String payherePaymentId, String meetingLink, LocalDateTime createdAt) {
            this.id = id;
            this.lessonRequestId = lessonRequestId;
            this.subject = subject;
            this.lessonTopic = lessonTopic;
            this.studentId = studentId;
            this.studentName = studentName;
            this.studentEmail = studentEmail;
            this.tutorId = tutorId;
            this.tutorName = tutorName;
            this.tutorEmail = tutorEmail;
            this.agreedPrice = agreedPrice;
            this.platformFee = platformFee;
            this.tutorPayout = tutorPayout;
            this.paymentStatus = paymentStatus;
            this.bookingStatus = bookingStatus;
            this.payherePaymentId = payherePaymentId;
            this.meetingLink = meetingLink;
            this.createdAt = createdAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long lessonRequestId;
            private String subject;
            private String lessonTopic;
            private Long studentId;
            private String studentName;
            private String studentEmail;
            private Long tutorId;
            private String tutorName;
            private String tutorEmail;
            private BigDecimal agreedPrice;
            private BigDecimal platformFee;
            private BigDecimal tutorPayout;
            private PaymentStatus paymentStatus;
            private BookingStatus bookingStatus;
            private String payherePaymentId;
            private String meetingLink;
            private LocalDateTime createdAt;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder lessonRequestId(Long lessonRequestId) { this.lessonRequestId = lessonRequestId; return this; }
            public Builder subject(String subject) { this.subject = subject; return this; }
            public Builder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
            public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
            public Builder studentName(String studentName) { this.studentName = studentName; return this; }
            public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
            public Builder tutorId(Long tutorId) { this.tutorId = tutorId; return this; }
            public Builder tutorName(String tutorName) { this.tutorName = tutorName; return this; }
            public Builder tutorEmail(String tutorEmail) { this.tutorEmail = tutorEmail; return this; }
            public Builder agreedPrice(BigDecimal agreedPrice) { this.agreedPrice = agreedPrice; return this; }
            public Builder platformFee(BigDecimal platformFee) { this.platformFee = platformFee; return this; }
            public Builder tutorPayout(BigDecimal tutorPayout) { this.tutorPayout = tutorPayout; return this; }
            public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
            public Builder bookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; return this; }
            public Builder payherePaymentId(String payherePaymentId) { this.payherePaymentId = payherePaymentId; return this; }
            public Builder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public AdminBookingItem build() {
                return new AdminBookingItem(id, lessonRequestId, subject, lessonTopic, studentId, studentName,
                        studentEmail, tutorId, tutorName, tutorEmail, agreedPrice, platformFee, tutorPayout,
                        paymentStatus, bookingStatus, payherePaymentId, meetingLink, createdAt);
            }
        }

        public Long getId() { return id; }
        public Long getLessonRequestId() { return lessonRequestId; }
        public String getSubject() { return subject; }
        public String getLessonTopic() { return lessonTopic; }
        public Long getStudentId() { return studentId; }
        public String getStudentName() { return studentName; }
        public String getStudentEmail() { return studentEmail; }
        public Long getTutorId() { return tutorId; }
        public String getTutorName() { return tutorName; }
        public String getTutorEmail() { return tutorEmail; }
        public BigDecimal getAgreedPrice() { return agreedPrice; }
        public BigDecimal getPlatformFee() { return platformFee; }
        public BigDecimal getTutorPayout() { return tutorPayout; }
        public PaymentStatus getPaymentStatus() { return paymentStatus; }
        public BookingStatus getBookingStatus() { return bookingStatus; }
        public String getPayherePaymentId() { return payherePaymentId; }
        public String getMeetingLink() { return meetingLink; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public static class AdminReviewItem {
        private Long id;
        private Long bookingId;
        private Long reviewerId;
        private String reviewerName;
        private String reviewerEmail;
        private Long revieweeId;
        private String revieweeName;
        private String revieweeEmail;
        private Integer rating;
        private String feedbackText;
        private LocalDateTime createdAt;

        public AdminReviewItem() {}

        public AdminReviewItem(Long id, Long bookingId, Long reviewerId, String reviewerName,
                               String reviewerEmail, Long revieweeId, String revieweeName,
                               String revieweeEmail, Integer rating, String feedbackText,
                               LocalDateTime createdAt) {
            this.id = id;
            this.bookingId = bookingId;
            this.reviewerId = reviewerId;
            this.reviewerName = reviewerName;
            this.reviewerEmail = reviewerEmail;
            this.revieweeId = revieweeId;
            this.revieweeName = revieweeName;
            this.revieweeEmail = revieweeEmail;
            this.rating = rating;
            this.feedbackText = feedbackText;
            this.createdAt = createdAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long bookingId;
            private Long reviewerId;
            private String reviewerName;
            private String reviewerEmail;
            private Long revieweeId;
            private String revieweeName;
            private String revieweeEmail;
            private Integer rating;
            private String feedbackText;
            private LocalDateTime createdAt;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
            public Builder reviewerId(Long reviewerId) { this.reviewerId = reviewerId; return this; }
            public Builder reviewerName(String reviewerName) { this.reviewerName = reviewerName; return this; }
            public Builder reviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; return this; }
            public Builder revieweeId(Long revieweeId) { this.revieweeId = revieweeId; return this; }
            public Builder revieweeName(String revieweeName) { this.revieweeName = revieweeName; return this; }
            public Builder revieweeEmail(String revieweeEmail) { this.revieweeEmail = revieweeEmail; return this; }
            public Builder rating(Integer rating) { this.rating = rating; return this; }
            public Builder feedbackText(String feedbackText) { this.feedbackText = feedbackText; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public AdminReviewItem build() {
                return new AdminReviewItem(id, bookingId, reviewerId, reviewerName, reviewerEmail,
                        revieweeId, revieweeName, revieweeEmail, rating, feedbackText, createdAt);
            }
        }

        public Long getId() { return id; }
        public Long getBookingId() { return bookingId; }
        public Long getReviewerId() { return reviewerId; }
        public String getReviewerName() { return reviewerName; }
        public String getReviewerEmail() { return reviewerEmail; }
        public Long getRevieweeId() { return revieweeId; }
        public String getRevieweeName() { return revieweeName; }
        public String getRevieweeEmail() { return revieweeEmail; }
        public Integer getRating() { return rating; }
        public String getFeedbackText() { return feedbackText; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
}
