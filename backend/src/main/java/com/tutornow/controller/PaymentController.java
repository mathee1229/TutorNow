package com.tutornow.controller;

import com.tutornow.dto.BookingDto;
import com.tutornow.dto.PaymentDto;
import com.tutornow.model.TutorWallet;
import com.tutornow.service.EscrowPaymentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final EscrowPaymentService escrowPaymentService;

    public PaymentController(EscrowPaymentService escrowPaymentService) {
        this.escrowPaymentService = escrowPaymentService;
    }

    @GetMapping("/checkout-params/{bookingId}")
    public ResponseEntity<PaymentDto.PayHereCheckoutParams> getCheckoutParams(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(escrowPaymentService.getPaymentParams(userDetails.getUsername(), bookingId));
    }

    @PostMapping(value = "/ipn", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handlePayHereIpn(PaymentDto.PayHereIpnPayload payload) {
        escrowPaymentService.processIpnNotification(payload);
        return ResponseEntity.ok("IPN received");
    }

    @PostMapping("/simulate-escrow/{bookingId}")
    public ResponseEntity<BookingDto.BookingResponse> simulateEscrow(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(escrowPaymentService.simulateEscrowCapture(userDetails.getUsername(), bookingId));
    }

    @PostMapping("/complete/{bookingId}")
    public ResponseEntity<BookingDto.BookingResponse> completeLesson(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(escrowPaymentService.completeLessonAndReleaseEscrow(userDetails.getUsername(), bookingId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BookingDto.BookingResponse> getBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(escrowPaymentService.getBookingDetails(bookingId, userDetails.getUsername()));
    }

    @GetMapping("/wallet")
    public ResponseEntity<TutorWallet> getTutorWallet(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(escrowPaymentService.getTutorWallet(userDetails.getUsername()));
    }
}
