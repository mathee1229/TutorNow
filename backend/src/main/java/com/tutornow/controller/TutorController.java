package com.tutornow.controller;

import com.tutornow.dto.TutorProfileDto;
import com.tutornow.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tutors")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @GetMapping
    public ResponseEntity<List<TutorProfileDto.TutorProfileResponse>> getVerifiedTutors() {
        return ResponseEntity.ok(tutorService.getVerifiedTutors());
    }

    @GetMapping("/all")
    public ResponseEntity<List<TutorProfileDto.TutorProfileResponse>> getAllTutors() {
        return ResponseEntity.ok(tutorService.getAllTutors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorProfileDto.TutorProfileResponse> getTutorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.getTutorProfile(id));
    }

    @PatchMapping("/admin/{profileId}/verify")
    public ResponseEntity<TutorProfileDto.TutorProfileResponse> verifyTutor(
            @PathVariable Long profileId,
            @RequestParam boolean verified
    ) {
        return ResponseEntity.ok(tutorService.verifyTutor(profileId, verified));
    }
}
