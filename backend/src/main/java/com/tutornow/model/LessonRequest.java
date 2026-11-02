package com.tutornow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_requests")
public class LessonRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String lessonTopic;

    private String studentGrade;

    @Column(nullable = false)
    private BigDecimal targetBudget;

    @Column(nullable = false)
    private LocalDateTime preferredSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryMode deliveryMode;

    private String townName;
    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String fullAddress;

    @Column(columnDefinition = "TEXT")
    private String attachmentUrls;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();

    public LessonRequest() {}

    public LessonRequest(Long id, User student, String subject, String lessonTopic, String studentGrade,
                         BigDecimal targetBudget, LocalDateTime preferredSlot, DeliveryMode deliveryMode,
                         String townName, Double latitude, Double longitude, String fullAddress,
                         String attachmentUrls, RequestStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.lessonTopic = lessonTopic;
        this.studentGrade = studentGrade;
        this.targetBudget = targetBudget;
        this.preferredSlot = preferredSlot;
        this.deliveryMode = deliveryMode;
        this.townName = townName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fullAddress = fullAddress;
        this.attachmentUrls = attachmentUrls;
        this.status = status != null ? status : RequestStatus.OPEN;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static LessonRequestBuilder builder() {
        return new LessonRequestBuilder();
    }

    public static class LessonRequestBuilder {
        private Long id;
        private User student;
        private String subject;
        private String lessonTopic;
        private String studentGrade;
        private BigDecimal targetBudget;
        private LocalDateTime preferredSlot;
        private DeliveryMode deliveryMode;
        private String townName;
        private Double latitude;
        private Double longitude;
        private String fullAddress;
        private String attachmentUrls;
        private RequestStatus status = RequestStatus.OPEN;
        private LocalDateTime createdAt = LocalDateTime.now();

        public LessonRequestBuilder id(Long id) { this.id = id; return this; }
        public LessonRequestBuilder student(User student) { this.student = student; return this; }
        public LessonRequestBuilder subject(String subject) { this.subject = subject; return this; }
        public LessonRequestBuilder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
        public LessonRequestBuilder studentGrade(String studentGrade) { this.studentGrade = studentGrade; return this; }
        public LessonRequestBuilder targetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; return this; }
        public LessonRequestBuilder preferredSlot(LocalDateTime preferredSlot) { this.preferredSlot = preferredSlot; return this; }
        public LessonRequestBuilder deliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; return this; }
        public LessonRequestBuilder townName(String townName) { this.townName = townName; return this; }
        public LessonRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public LessonRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public LessonRequestBuilder fullAddress(String fullAddress) { this.fullAddress = fullAddress; return this; }
        public LessonRequestBuilder attachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; return this; }
        public LessonRequestBuilder status(RequestStatus status) { this.status = status; return this; }
        public LessonRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public LessonRequest build() {
            return new LessonRequest(id, student, subject, lessonTopic, studentGrade, targetBudget, preferredSlot, deliveryMode, townName, latitude, longitude, fullAddress, attachmentUrls, status, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getLessonTopic() { return lessonTopic; }
    public void setLessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; }
    public String getStudentGrade() { return studentGrade; }
    public void setStudentGrade(String studentGrade) { this.studentGrade = studentGrade; }
    public BigDecimal getTargetBudget() { return targetBudget; }
    public void setTargetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; }
    public LocalDateTime getPreferredSlot() { return preferredSlot; }
    public void setPreferredSlot(LocalDateTime preferredSlot) { this.preferredSlot = preferredSlot; }
    public DeliveryMode getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; }
    public String getTownName() { return townName; }
    public void setTownName(String townName) { this.townName = townName; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getFullAddress() { return fullAddress; }
    public void setFullAddress(String fullAddress) { this.fullAddress = fullAddress; }
    public String getAttachmentUrls() { return attachmentUrls; }
    public void setAttachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
