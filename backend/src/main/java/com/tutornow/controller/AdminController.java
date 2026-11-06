package com.tutornow.controller;

import com.tutornow.dto.AdminDto;
import com.tutornow.model.BookingStatus;
import com.tutornow.model.PaymentStatus;
import com.tutornow.model.RequestStatus;
import com.tutornow.model.Role;
import com.tutornow.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDto.PlatformStatsResponse> getPlatformStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminDto.UserSummaryResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(search, role, active));
    }

    @PostMapping("/users")
    public ResponseEntity<AdminDto.UserSummaryResponse> createUser(
            @Valid @RequestBody AdminDto.CreateUserRequest request
    ) {
        return new ResponseEntity<>(adminService.createUser(request), HttpStatus.CREATED);
    }

    @PatchMapping("/users/{userId}/toggle-active")
    public ResponseEntity<AdminDto.UserSummaryResponse> toggleUserActive(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(adminService.toggleUserActive(userId, userDetails.getUsername()));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<AdminDto.UserSummaryResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody AdminDto.UpdateRoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, request.getRole(), userDetails.getUsername()));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        adminService.deleteUser(userId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutors")
    public ResponseEntity<List<AdminDto.TutorVerificationItem>> getTutorVerifications(
            @RequestParam(required = false) Boolean pendingOnly
    ) {
        return ResponseEntity.ok(adminService.getTutorVerifications(pendingOnly));
    }

    @PatchMapping("/tutors/{profileId}/verify")
    public ResponseEntity<AdminDto.TutorVerificationItem> verifyTutor(
            @PathVariable Long profileId,
            @RequestParam boolean verified
    ) {
        return ResponseEntity.ok(adminService.verifyTutor(profileId, verified));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<AdminDto.AdminLessonRequestItem>> getAllLessonRequests(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RequestStatus status
    ) {
        return ResponseEntity.ok(adminService.getAllLessonRequests(search, status));
    }

    @PatchMapping("/requests/{requestId}/status")
    public ResponseEntity<AdminDto.AdminLessonRequestItem> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam RequestStatus status
    ) {
        return ResponseEntity.ok(adminService.updateRequestStatus(requestId, status));
    }

    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<Void> deleteLessonRequest(@PathVariable Long requestId) {
        adminService.deleteLessonRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<AdminDto.AdminBookingItem>> getAllBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) BookingStatus bookingStatus
    ) {
        return ResponseEntity.ok(adminService.getAllBookings(search, paymentStatus, bookingStatus));
    }

    @PostMapping("/bookings/{bookingId}/force-release")
    public ResponseEntity<AdminDto.AdminBookingItem> forceReleaseEscrow(@PathVariable Long bookingId) {
        return ResponseEntity.ok(adminService.forceReleaseEscrow(bookingId));
    }

    @PostMapping("/bookings/{bookingId}/refund")
    public ResponseEntity<AdminDto.AdminBookingItem> refundEscrow(@PathVariable Long bookingId) {
        return ResponseEntity.ok(adminService.refundEscrow(bookingId));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<AdminDto.AdminReviewItem>> getAllReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        adminService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
