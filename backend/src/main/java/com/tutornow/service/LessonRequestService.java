package com.tutornow.service;

import com.tutornow.dto.LessonRequestDto;
import com.tutornow.model.*;
import com.tutornow.repository.BookingRepository;
import com.tutornow.repository.LessonRequestRepository;
import com.tutornow.repository.TutorApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LessonRequestService {

    private final LessonRequestRepository lessonRequestRepository;
    private final TutorApplicationRepository tutorApplicationRepository;
    private final BookingRepository bookingRepository;
    private final AuthService authService;

    public LessonRequestService(LessonRequestRepository lessonRequestRepository,
                                TutorApplicationRepository tutorApplicationRepository,
                                BookingRepository bookingRepository,
                                AuthService authService) {
        this.lessonRequestRepository = lessonRequestRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.bookingRepository = bookingRepository;
        this.authService = authService;
    }

    @Transactional
    public LessonRequestDto.LessonRequestResponse createRequest(String studentEmail, LessonRequestDto.CreateLessonRequest dto) {
        User student = authService.getUserByEmail(studentEmail);
        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new IllegalStateException("Only registered students can create lesson requests");
        }

        LessonRequest request = LessonRequest.builder()
                .student(student)
                .subject(dto.getSubject())
                .lessonTopic(dto.getLessonTopic())
                .studentGrade(dto.getStudentGrade() != null ? dto.getStudentGrade() : "A/L")
                .targetBudget(dto.getTargetBudget())
                .preferredSlot(dto.getPreferredSlot())
                .deliveryMode(dto.getDeliveryMode())
                .townName(dto.getTownName())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .fullAddress(dto.getFullAddress())
                .attachmentUrls(dto.getAttachmentUrls())
                .status(RequestStatus.OPEN)
                .build();

        request = lessonRequestRepository.save(request);
        return mapToResponse(request, studentEmail);
    }

    public List<LessonRequestDto.LessonRequestResponse> getAllOpenRequests(String subject, DeliveryMode deliveryMode, String currentUserEmail) {
        List<LessonRequest> requests;
        if (subject != null && !subject.isBlank()) {
            requests = lessonRequestRepository.findBySubjectContainingIgnoreCaseAndStatus(subject, RequestStatus.OPEN);
        } else if (deliveryMode != null) {
            requests = lessonRequestRepository.findByDeliveryModeAndStatus(deliveryMode, RequestStatus.OPEN);
        } else {
            requests = lessonRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN);
        }

        return requests.stream()
                .map(r -> mapToResponse(r, currentUserEmail))
                .collect(Collectors.toList());
    }

    public List<LessonRequestDto.LessonRequestResponse> getMyRequests(String studentEmail) {
        User student = authService.getUserByEmail(studentEmail);
        return lessonRequestRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(r -> mapToResponse(r, studentEmail))
                .collect(Collectors.toList());
    }

    public LessonRequestDto.LessonRequestResponse getRequestById(Long id, String currentUserEmail) {
        LessonRequest request = lessonRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson request not found with ID: " + id));
        return mapToResponse(request, currentUserEmail);
    }

    public LessonRequest getEntityById(Long id) {
        return lessonRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson request not found with ID: " + id));
    }

    private LessonRequestDto.LessonRequestResponse mapToResponse(LessonRequest r, String currentUserEmail) {
        int bidsCount = tutorApplicationRepository.findByLessonRequestId(r.getId()).size();

        boolean canViewFullAddress = false;
        if (currentUserEmail != null) {
            if (r.getStudent().getEmail().equalsIgnoreCase(currentUserEmail)) {
                canViewFullAddress = true;
            } else {
                Optional<Booking> booking = bookingRepository.findByLessonRequestId(r.getId());
                if (booking.isPresent() && booking.get().getTutor().getEmail().equalsIgnoreCase(currentUserEmail)) {
                    canViewFullAddress = true;
                }
            }
        }

        String visibleAddress = canViewFullAddress ? r.getFullAddress() :
                (r.getDeliveryMode() == DeliveryMode.PHYSICAL ? "[Protected: Revealed upon booking confirmation]" : "N/A (Online Class)");

        return LessonRequestDto.LessonRequestResponse.builder()
                .id(r.getId())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getFullName())
                .subject(r.getSubject())
                .lessonTopic(r.getLessonTopic())
                .studentGrade(r.getStudentGrade())
                .targetBudget(r.getTargetBudget())
                .preferredSlot(r.getPreferredSlot())
                .deliveryMode(r.getDeliveryMode())
                .townName(r.getTownName())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .fullAddress(visibleAddress)
                .attachmentUrls(r.getAttachmentUrls())
                .status(r.getStatus())
                .bidsCount(bidsCount)
                .createdAt(r.getCreatedAt())
                .build();
    }
}
