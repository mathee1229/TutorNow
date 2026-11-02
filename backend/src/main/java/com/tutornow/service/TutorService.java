package com.tutornow.service;

import com.tutornow.dto.TutorProfileDto;
import com.tutornow.model.TutorProfile;
import com.tutornow.repository.TutorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorService {

    private final TutorProfileRepository tutorProfileRepository;

    public TutorService(TutorProfileRepository tutorProfileRepository) {
        this.tutorProfileRepository = tutorProfileRepository;
    }

    public List<TutorProfileDto.TutorProfileResponse> getVerifiedTutors() {
        return tutorProfileRepository.findByIsVerifiedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TutorProfileDto.TutorProfileResponse> getAllTutors() {
        return tutorProfileRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TutorProfileDto.TutorProfileResponse getTutorProfile(Long tutorId) {
        TutorProfile profile = tutorProfileRepository.findByUserId(tutorId)
                .or(() -> tutorProfileRepository.findById(tutorId))
                .orElseThrow(() -> new IllegalArgumentException("Tutor profile not found for user ID or profile ID: " + tutorId));
        return mapToResponse(profile);
    }

    @Transactional
    public TutorProfileDto.TutorProfileResponse verifyTutor(Long profileId, boolean verified) {
        TutorProfile profile = tutorProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Tutor profile not found with ID: " + profileId));
        profile.setVerified(verified);
        profile = tutorProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    private TutorProfileDto.TutorProfileResponse mapToResponse(TutorProfile p) {
        return TutorProfileDto.TutorProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .university(p.getUniversity())
                .degreeField(p.getDegreeField())
                .hourlyRate(p.getHourlyRate())
                .bio(p.getBio())
                .idProofUrl(p.getIdProofUrl())
                .marksheetProofUrl(p.getMarksheetProofUrl())
                .isVerified(p.isVerified())
                .ratingAvg(p.getRatingAvg())
                .totalReviews(p.getTotalReviews())
                .build();
    }
}
