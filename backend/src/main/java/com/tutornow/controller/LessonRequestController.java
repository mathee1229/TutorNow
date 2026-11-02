package com.tutornow.controller;

import com.tutornow.dto.LessonRequestDto;
import com.tutornow.model.DeliveryMode;
import com.tutornow.service.LessonRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
public class LessonRequestController {

    private final LessonRequestService lessonRequestService;

    public LessonRequestController(LessonRequestService lessonRequestService) {
        this.lessonRequestService = lessonRequestService;
    }

    @PostMapping
    public ResponseEntity<LessonRequestDto.LessonRequestResponse> createRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LessonRequestDto.CreateLessonRequest request
    ) {
        return ResponseEntity.ok(lessonRequestService.createRequest(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<LessonRequestDto.LessonRequestResponse>> getAllOpenRequests(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) DeliveryMode mode
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(lessonRequestService.getAllOpenRequests(subject, mode, email));
    }

    @GetMapping("/my")
    public ResponseEntity<List<LessonRequestDto.LessonRequestResponse>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(lessonRequestService.getMyRequests(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonRequestDto.LessonRequestResponse> getRequestById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(lessonRequestService.getRequestById(id, email));
    }
}
