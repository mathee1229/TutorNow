package com.tutornow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String feedbackText;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(Long id, Booking booking, User reviewer, User reviewee, Integer rating, String feedbackText, LocalDateTime createdAt) {
        this.id = id;
        this.booking = booking;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.rating = rating;
        this.feedbackText = feedbackText;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public static class ReviewBuilder {
        private Long id;
        private Booking booking;
        private User reviewer;
        private User reviewee;
        private Integer rating;
        private String feedbackText;
        private LocalDateTime createdAt = LocalDateTime.now();

        public ReviewBuilder id(Long id) { this.id = id; return this; }
        public ReviewBuilder booking(Booking booking) { this.booking = booking; return this; }
        public ReviewBuilder reviewer(User reviewer) { this.reviewer = reviewer; return this; }
        public ReviewBuilder reviewee(User reviewee) { this.reviewee = reviewee; return this; }
        public ReviewBuilder rating(Integer rating) { this.rating = rating; return this; }
        public ReviewBuilder feedbackText(String feedbackText) { this.feedbackText = feedbackText; return this; }
        public ReviewBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Review build() {
            return new Review(id, booking, reviewer, reviewee, rating, feedbackText, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }
    public User getReviewee() { return reviewee; }
    public void setReviewee(User reviewee) { this.reviewee = reviewee; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
