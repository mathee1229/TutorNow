package com.tutornow.dto;

import com.tutornow.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BidDto {

    public static class CreateBid {
        @NotNull(message = "Proposed price is required")
        private BigDecimal proposedPrice;

        private String coverNote;

        @NotNull(message = "Available slot is required")
        private LocalDateTime availableSlot;

        public CreateBid() {}
        public CreateBid(BigDecimal proposedPrice, String coverNote, LocalDateTime availableSlot) {
            this.proposedPrice = proposedPrice;
            this.coverNote = coverNote;
            this.availableSlot = availableSlot;
        }

        public BigDecimal getProposedPrice() { return proposedPrice; }
        public void setProposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; }
        public String getCoverNote() { return coverNote; }
        public void setCoverNote(String coverNote) { this.coverNote = coverNote; }
        public LocalDateTime getAvailableSlot() { return availableSlot; }
        public void setAvailableSlot(LocalDateTime availableSlot) { this.availableSlot = availableSlot; }
    }

    public static class BidResponse {
        private Long id;
        private Long lessonRequestId;
        private Long tutorId;
        private String tutorName;
        private String tutorUniversity;
        private String tutorDegree;
        private Double tutorRating;
        private Integer totalReviews;
        private boolean isVerified;
        private BigDecimal proposedPrice;
        private String coverNote;
        private LocalDateTime availableSlot;
        private ApplicationStatus status;
        private LocalDateTime createdAt;

        public BidResponse() {}

        public BidResponse(Long id, Long lessonRequestId, Long tutorId, String tutorName, String tutorUniversity,
                           String tutorDegree, Double tutorRating, Integer totalReviews, boolean isVerified,
                           BigDecimal proposedPrice, String coverNote, LocalDateTime availableSlot,
                           ApplicationStatus status, LocalDateTime createdAt) {
            this.id = id;
            this.lessonRequestId = lessonRequestId;
            this.tutorId = tutorId;
            this.tutorName = tutorName;
            this.tutorUniversity = tutorUniversity;
            this.tutorDegree = tutorDegree;
            this.tutorRating = tutorRating;
            this.totalReviews = totalReviews;
            this.isVerified = isVerified;
            this.proposedPrice = proposedPrice;
            this.coverNote = coverNote;
            this.availableSlot = availableSlot;
            this.status = status;
            this.createdAt = createdAt;
        }

        public static BidResponseBuilder builder() {
            return new BidResponseBuilder();
        }

        public static class BidResponseBuilder {
            private Long id;
            private Long lessonRequestId;
            private Long tutorId;
            private String tutorName;
            private String tutorUniversity;
            private String tutorDegree;
            private Double tutorRating;
            private Integer totalReviews;
            private boolean isVerified;
            private BigDecimal proposedPrice;
            private String coverNote;
            private LocalDateTime availableSlot;
            private ApplicationStatus status;
            private LocalDateTime createdAt;

            public BidResponseBuilder id(Long id) { this.id = id; return this; }
            public BidResponseBuilder lessonRequestId(Long lessonRequestId) { this.lessonRequestId = lessonRequestId; return this; }
            public BidResponseBuilder tutorId(Long tutorId) { this.tutorId = tutorId; return this; }
            public BidResponseBuilder tutorName(String tutorName) { this.tutorName = tutorName; return this; }
            public BidResponseBuilder tutorUniversity(String tutorUniversity) { this.tutorUniversity = tutorUniversity; return this; }
            public BidResponseBuilder tutorDegree(String tutorDegree) { this.tutorDegree = tutorDegree; return this; }
            public BidResponseBuilder tutorRating(Double tutorRating) { this.tutorRating = tutorRating; return this; }
            public BidResponseBuilder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }
            public BidResponseBuilder isVerified(boolean isVerified) { this.isVerified = isVerified; return this; }
            public BidResponseBuilder proposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; return this; }
            public BidResponseBuilder coverNote(String coverNote) { this.coverNote = coverNote; return this; }
            public BidResponseBuilder availableSlot(LocalDateTime availableSlot) { this.availableSlot = availableSlot; return this; }
            public BidResponseBuilder status(ApplicationStatus status) { this.status = status; return this; }
            public BidResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public BidResponse build() {
                return new BidResponse(id, lessonRequestId, tutorId, tutorName, tutorUniversity, tutorDegree, tutorRating, totalReviews, isVerified, proposedPrice, coverNote, availableSlot, status, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getLessonRequestId() { return lessonRequestId; }
        public void setLessonRequestId(Long lessonRequestId) { this.lessonRequestId = lessonRequestId; }
        public Long getTutorId() { return tutorId; }
        public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
        public String getTutorName() { return tutorName; }
        public void setTutorName(String tutorName) { this.tutorName = tutorName; }
        public String getTutorUniversity() { return tutorUniversity; }
        public void setTutorUniversity(String tutorUniversity) { this.tutorUniversity = tutorUniversity; }
        public String getTutorDegree() { return tutorDegree; }
        public void setTutorDegree(String tutorDegree) { this.tutorDegree = tutorDegree; }
        public Double getTutorRating() { return tutorRating; }
        public void setTutorRating(Double tutorRating) { this.tutorRating = tutorRating; }
        public Integer getTotalReviews() { return totalReviews; }
        public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
        public boolean isVerified() { return isVerified; }
        public void setVerified(boolean verified) { isVerified = verified; }
        public BigDecimal getProposedPrice() { return proposedPrice; }
        public void setProposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; }
        public String getCoverNote() { return coverNote; }
        public void setCoverNote(String coverNote) { this.coverNote = coverNote; }
        public LocalDateTime getAvailableSlot() { return availableSlot; }
        public void setAvailableSlot(LocalDateTime availableSlot) { this.availableSlot = availableSlot; }
        public ApplicationStatus getStatus() { return status; }
        public void setStatus(ApplicationStatus status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
