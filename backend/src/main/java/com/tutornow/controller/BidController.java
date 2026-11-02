package com.tutornow.controller;

import com.tutornow.dto.BidDto;
import com.tutornow.dto.BookingDto;
import com.tutornow.model.Booking;
import com.tutornow.service.BidService;
import com.tutornow.service.EscrowPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bids")
public class BidController {

    private final BidService bidService;
    private final EscrowPaymentService escrowPaymentService;

    public BidController(BidService bidService, EscrowPaymentService escrowPaymentService) {
        this.bidService = bidService;
        this.escrowPaymentService = escrowPaymentService;
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<BidDto.BidResponse> submitBid(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long requestId,
            @Valid @RequestBody BidDto.CreateBid bid
    ) {
        return ResponseEntity.ok(bidService.submitBid(userDetails.getUsername(), requestId, bid));
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<BidDto.BidResponse>> getBidsForRequest(
            @PathVariable Long requestId
    ) {
        return ResponseEntity.ok(bidService.getBidsForRequest(requestId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BidDto.BidResponse>> getMyBids(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(bidService.getMyBids(userDetails.getUsername()));
    }

    @PostMapping("/{bidId}/accept")
    public ResponseEntity<BookingDto.BookingResponse> acceptBid(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bidId
    ) {
        Booking booking = bidService.acceptBid(userDetails.getUsername(), bidId);
        return ResponseEntity.ok(escrowPaymentService.mapToBookingResponse(booking, userDetails.getUsername()));
    }
}
