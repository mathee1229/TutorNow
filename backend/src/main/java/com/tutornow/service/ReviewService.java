package com.tutornow.service;

import com.tutornow.dto.ReviewDto;
import com.tutornow.model.Booking;
import com.tutornow.model.Review;
import com.tutornow.model.User;
import com.tutornow.repository.BookingRepository;
import com.tutornow.repository.ReviewRepository;
import com.tutornow.repository.TutorProfileRepository;
import com.tutornow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository,
                         TutorProfileRepository tutorProfileRepository, UserRepository userRepository,
                         AuthService authService) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @Transactional
    public ReviewDto.ReviewResponse submitReview(String reviewerEmail, ReviewDto.CreateReview dto) {
        User reviewer = authService.getUserByEmail(reviewerEmail);
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        User reviewee = booking.getStudent().getId().equals(reviewer.getId()) ?
                booking.getTutor() : booking.getStudent();

        Review review = Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(dto.getRating())
                .feedbackText(dto.getFeedbackText())
                .build();

        review = reviewRepository.save(review);

        if (booking.getTutor().getId().equals(reviewee.getId())) {
            tutorProfileRepository.findByUser(reviewee).ifPresent(profile -> {
                List<Review> tutorReviews = reviewRepository.findByRevieweeOrderByCreatedAtDesc(reviewee);
                double avg = tutorReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
                profile.setRatingAvg(Math.round(avg * 10.0) / 10.0);
                profile.setTotalReviews(tutorReviews.size());
                tutorProfileRepository.save(profile);
            });
        }

        return ReviewDto.ReviewResponse.builder()
                .id(review.getId())
                .bookingId(booking.getId())
                .reviewerId(reviewer.getId())
                .reviewerName(reviewer.getFullName())
                .revieweeId(reviewee.getId())
                .revieweeName(reviewee.getFullName())
                .rating(review.getRating())
                .feedbackText(review.getFeedbackText())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public List<ReviewDto.ReviewResponse> getReviewsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return reviewRepository.findByRevieweeOrderByCreatedAtDesc(user).stream()
                .map(r -> ReviewDto.ReviewResponse.builder()
                        .id(r.getId())
                        .bookingId(r.getBooking().getId())
                        .reviewerId(r.getReviewer().getId())
                        .reviewerName(r.getReviewer().getFullName())
                        .revieweeId(r.getReviewee().getId())
                        .revieweeName(r.getReviewee().getFullName())
                        .rating(r.getRating())
                        .feedbackText(r.getFeedbackText())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
