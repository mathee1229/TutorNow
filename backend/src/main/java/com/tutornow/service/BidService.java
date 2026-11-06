package com.tutornow.service;

import com.tutornow.dto.BidDto;
import com.tutornow.model.*;
import com.tutornow.repository.BookingRepository;
import com.tutornow.repository.LessonRequestRepository;
import com.tutornow.repository.TutorApplicationRepository;
import com.tutornow.repository.TutorProfileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BidService {

    private final TutorApplicationRepository tutorApplicationRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final BookingRepository bookingRepository;
    private final AuthService authService;
    private final ZoomService zoomService;

    @Value("${app.platform.commission-percentage:10.0}")
    private double commissionPercentage;

    public BidService(TutorApplicationRepository tutorApplicationRepository,
                      LessonRequestRepository lessonRequestRepository,
                      TutorProfileRepository tutorProfileRepository,
                      BookingRepository bookingRepository,
                      AuthService authService,
                      ZoomService zoomService) {
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.lessonRequestRepository = lessonRequestRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.bookingRepository = bookingRepository;
        this.authService = authService;
        this.zoomService = zoomService;
    }

    @Transactional
    public BidDto.BidResponse submitBid(String tutorEmail, Long lessonRequestId, BidDto.CreateBid dto) {
        User tutor = authService.getUserByEmail(tutorEmail);
        if (tutor.getRole() != Role.ROLE_TUTOR) {
            throw new IllegalStateException("Only registered tutors can submit bids");
        }

        LessonRequest request = lessonRequestRepository.findById(lessonRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson request not found with ID: " + lessonRequestId));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new IllegalStateException("Lesson request is no longer open for bidding");
        }

        if (tutorApplicationRepository.findByLessonRequestAndTutor(request, tutor).isPresent()) {
            throw new IllegalStateException("You have already submitted a bid for this request");
        }

        TutorApplication application = TutorApplication.builder()
                .lessonRequest(request)
                .tutor(tutor)
                .proposedPrice(dto.getProposedPrice())
                .coverNote(dto.getCoverNote())
                .availableSlot(dto.getAvailableSlot())
                .status(ApplicationStatus.PENDING)
                .build();

        application = tutorApplicationRepository.save(application);
        return mapToResponse(application);
    }

    public List<BidDto.BidResponse> getBidsForRequest(Long lessonRequestId) {
        return tutorApplicationRepository.findByLessonRequestId(lessonRequestId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BidDto.BidResponse> getMyBids(String tutorEmail) {
        User tutor = authService.getUserByEmail(tutorEmail);
        return tutorApplicationRepository.findByTutorOrderByCreatedAtDesc(tutor).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Booking acceptBid(String studentEmail, Long bidId) {
        User student = authService.getUserByEmail(studentEmail);
        TutorApplication bid = tutorApplicationRepository.findById(bidId)
                .orElseThrow(() -> new IllegalArgumentException("Bid not found with ID: " + bidId));

        LessonRequest request = bid.getLessonRequest();
        if (!request.getStudent().getId().equals(student.getId())) {
            throw new IllegalStateException("You are not authorized to accept bids for this request");
        }

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new IllegalStateException("Request is already assigned or closed");
        }

        bid.setStatus(ApplicationStatus.ACCEPTED);
        tutorApplicationRepository.save(bid);

        List<TutorApplication> allBids = tutorApplicationRepository.findByLessonRequestId(request.getId());
        for (TutorApplication otherBid : allBids) {
            if (!otherBid.getId().equals(bid.getId()) && otherBid.getStatus() == ApplicationStatus.PENDING) {
                otherBid.setStatus(ApplicationStatus.REJECTED);
                tutorApplicationRepository.save(otherBid);
            }
        }

        request.setStatus(RequestStatus.ASSIGNED);
        lessonRequestRepository.save(request);

        BigDecimal agreedPrice = bid.getProposedPrice();
        BigDecimal platformCommissionRatio = BigDecimal.valueOf(commissionPercentage / 100.0);
        BigDecimal platformFee = agreedPrice.multiply(platformCommissionRatio).setScale(2, RoundingMode.HALF_UP);
        BigDecimal tutorPayout = agreedPrice.subtract(platformFee);

        String meetingLink = null;
        if (request.getDeliveryMode() == DeliveryMode.ONLINE) {
            String topic = "TutorNow: " + request.getSubject() + " (" + request.getLessonTopic() + ")";
            String agenda = "Online session for student " + student.getFullName() + " with tutor " + bid.getTutor().getFullName();
            meetingLink = zoomService.createMeeting(topic, agenda, 60);
        }

        Booking booking = Booking.builder()
                .lessonRequest(request)
                .student(student)
                .tutor(bid.getTutor())
                .agreedPrice(agreedPrice)
                .platformFee(platformFee)
                .tutorPayout(tutorPayout)
                .paymentStatus(PaymentStatus.PENDING)
                .meetingLink(meetingLink)
                .status(BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }

    private BidDto.BidResponse mapToResponse(TutorApplication app) {
        TutorProfile profile = tutorProfileRepository.findByUser(app.getTutor()).orElse(null);

        return BidDto.BidResponse.builder()
                .id(app.getId())
                .lessonRequestId(app.getLessonRequest().getId())
                .tutorId(app.getTutor().getId())
                .tutorName(app.getTutor().getFullName())
                .tutorUniversity(profile != null ? profile.getUniversity() : "Sri Lankan University")
                .tutorDegree(profile != null ? profile.getDegreeField() : "Verified Tutor")
                .tutorRating(profile != null ? profile.getRatingAvg() : 5.0)
                .totalReviews(profile != null ? profile.getTotalReviews() : 0)
                .isVerified(profile != null && profile.isVerified())
                .proposedPrice(app.getProposedPrice())
                .coverNote(app.getCoverNote())
                .availableSlot(app.getAvailableSlot())
                .status(app.getStatus())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
