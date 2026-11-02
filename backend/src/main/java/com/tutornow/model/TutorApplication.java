package com.tutornow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tutor_applications")
public class TutorApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_request_id", nullable = false)
    private LessonRequest lessonRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    @Column(nullable = false)
    private BigDecimal proposedPrice;

    @Column(columnDefinition = "TEXT")
    private String coverNote;

    @Column(nullable = false)
    private LocalDateTime availableSlot;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public TutorApplication() {}

    public TutorApplication(Long id, LessonRequest lessonRequest, User tutor, BigDecimal proposedPrice,
                            String coverNote, LocalDateTime availableSlot, ApplicationStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.lessonRequest = lessonRequest;
        this.tutor = tutor;
        this.proposedPrice = proposedPrice;
        this.coverNote = coverNote;
        this.availableSlot = availableSlot;
        this.status = status != null ? status : ApplicationStatus.PENDING;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static TutorApplicationBuilder builder() {
        return new TutorApplicationBuilder();
    }

    public static class TutorApplicationBuilder {
        private Long id;
        private LessonRequest lessonRequest;
        private User tutor;
        private BigDecimal proposedPrice;
        private String coverNote;
        private LocalDateTime availableSlot;
        private ApplicationStatus status = ApplicationStatus.PENDING;
        private LocalDateTime createdAt = LocalDateTime.now();

        public TutorApplicationBuilder id(Long id) { this.id = id; return this; }
        public TutorApplicationBuilder lessonRequest(LessonRequest lessonRequest) { this.lessonRequest = lessonRequest; return this; }
        public TutorApplicationBuilder tutor(User tutor) { this.tutor = tutor; return this; }
        public TutorApplicationBuilder proposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; return this; }
        public TutorApplicationBuilder coverNote(String coverNote) { this.coverNote = coverNote; return this; }
        public TutorApplicationBuilder availableSlot(LocalDateTime availableSlot) { this.availableSlot = availableSlot; return this; }
        public TutorApplicationBuilder status(ApplicationStatus status) { this.status = status; return this; }
        public TutorApplicationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TutorApplication build() {
            return new TutorApplication(id, lessonRequest, tutor, proposedPrice, coverNote, availableSlot, status, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LessonRequest getLessonRequest() { return lessonRequest; }
    public void setLessonRequest(LessonRequest lessonRequest) { this.lessonRequest = lessonRequest; }
    public User getTutor() { return tutor; }
    public void setTutor(User tutor) { this.tutor = tutor; }
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
