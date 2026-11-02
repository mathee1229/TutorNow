package com.tutornow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReviewDto {

    public static class CreateReview {
        @NotNull
        private Long bookingId;

        @NotNull
        @Min(1)
        @Max(5)
        private Integer rating;

        private String feedbackText;

        public CreateReview() {}
        public CreateReview(Long bookingId, Integer rating, String feedbackText) {
            this.bookingId = bookingId;
            this.rating = rating;
            this.feedbackText = feedbackText;
        }

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getFeedbackText() { return feedbackText; }
        public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    }

    public static class ReviewResponse {
        private Long id;
        private Long bookingId;
        private Long reviewerId;
        private String reviewerName;
        private Long revieweeId;
        private String revieweeName;
        private Integer rating;
        private String feedbackText;
        private LocalDateTime createdAt;

        public ReviewResponse() {}
        public ReviewResponse(Long id, Long bookingId, Long reviewerId, String reviewerName, Long revieweeId,
                              String revieweeName, Integer rating, String feedbackText, LocalDateTime createdAt) {
            this.id = id;
            this.bookingId = bookingId;
            this.reviewerId = reviewerId;
            this.reviewerName = reviewerName;
            this.revieweeId = revieweeId;
            this.revieweeName = revieweeName;
            this.rating = rating;
            this.feedbackText = feedbackText;
            this.createdAt = createdAt;
        }

        public static ReviewResponseBuilder builder() {
            return new ReviewResponseBuilder();
        }

        public static class ReviewResponseBuilder {
            private Long id;
            private Long bookingId;
            private Long reviewerId;
            private String reviewerName;
            private Long revieweeId;
            private String revieweeName;
            private Integer rating;
            private String feedbackText;
            private LocalDateTime createdAt;

            public ReviewResponseBuilder id(Long id) { this.id = id; return this; }
            public ReviewResponseBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
            public ReviewResponseBuilder reviewerId(Long reviewerId) { this.reviewerId = reviewerId; return this; }
            public ReviewResponseBuilder reviewerName(String reviewerName) { this.reviewerName = reviewerName; return this; }
            public ReviewResponseBuilder revieweeId(Long revieweeId) { this.revieweeId = revieweeId; return this; }
            public ReviewResponseBuilder revieweeName(String revieweeName) { this.revieweeName = revieweeName; return this; }
            public ReviewResponseBuilder rating(Integer rating) { this.rating = rating; return this; }
            public ReviewResponseBuilder feedbackText(String feedbackText) { this.feedbackText = feedbackText; return this; }
            public ReviewResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public ReviewResponse build() {
                return new ReviewResponse(id, bookingId, reviewerId, reviewerName, revieweeId, revieweeName, rating, feedbackText, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public Long getReviewerId() { return reviewerId; }
        public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }
        public String getReviewerName() { return reviewerName; }
        public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }
        public Long getRevieweeId() { return revieweeId; }
        public void setRevieweeId(Long revieweeId) { this.revieweeId = revieweeId; }
        public String getRevieweeName() { return revieweeName; }
        public void setRevieweeName(String revieweeName) { this.revieweeName = revieweeName; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getFeedbackText() { return feedbackText; }
        public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
