package com.tutornow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_request_id", nullable = false, unique = true)
    private LessonRequest lessonRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    @Column(nullable = false)
    private BigDecimal agreedPrice;

    @Column(nullable = false)
    private BigDecimal platformFee;

    @Column(nullable = false)
    private BigDecimal tutorPayout;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String payherePaymentId;
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.CONFIRMED;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public Booking(Long id, LessonRequest lessonRequest, User student, User tutor, BigDecimal agreedPrice,
                   BigDecimal platformFee, BigDecimal tutorPayout, PaymentStatus paymentStatus,
                   String payherePaymentId, String meetingLink, BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.lessonRequest = lessonRequest;
        this.student = student;
        this.tutor = tutor;
        this.agreedPrice = agreedPrice;
        this.platformFee = platformFee;
        this.tutorPayout = tutorPayout;
        this.paymentStatus = paymentStatus != null ? paymentStatus : PaymentStatus.PENDING;
        this.payherePaymentId = payherePaymentId;
        this.meetingLink = meetingLink;
        this.status = status != null ? status : BookingStatus.CONFIRMED;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private Long id;
        private LessonRequest lessonRequest;
        private User student;
        private User tutor;
        private BigDecimal agreedPrice;
        private BigDecimal platformFee;
        private BigDecimal tutorPayout;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private String payherePaymentId;
        private String meetingLink;
        private BookingStatus status = BookingStatus.CONFIRMED;
        private LocalDateTime createdAt = LocalDateTime.now();

        public BookingBuilder id(Long id) { this.id = id; return this; }
        public BookingBuilder lessonRequest(LessonRequest lessonRequest) { this.lessonRequest = lessonRequest; return this; }
        public BookingBuilder student(User student) { this.student = student; return this; }
        public BookingBuilder tutor(User tutor) { this.tutor = tutor; return this; }
        public BookingBuilder agreedPrice(BigDecimal agreedPrice) { this.agreedPrice = agreedPrice; return this; }
        public BookingBuilder platformFee(BigDecimal platformFee) { this.platformFee = platformFee; return this; }
        public BookingBuilder tutorPayout(BigDecimal tutorPayout) { this.tutorPayout = tutorPayout; return this; }
        public BookingBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public BookingBuilder payherePaymentId(String payherePaymentId) { this.payherePaymentId = payherePaymentId; return this; }
        public BookingBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Booking build() {
            return new Booking(id, lessonRequest, student, tutor, agreedPrice, platformFee, tutorPayout, paymentStatus, payherePaymentId, meetingLink, status, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LessonRequest getLessonRequest() { return lessonRequest; }
    public void setLessonRequest(LessonRequest lessonRequest) { this.lessonRequest = lessonRequest; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public User getTutor() { return tutor; }
    public void setTutor(User tutor) { this.tutor = tutor; }
    public BigDecimal getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(BigDecimal agreedPrice) { this.agreedPrice = agreedPrice; }
    public BigDecimal getPlatformFee() { return platformFee; }
    public void setPlatformFee(BigDecimal platformFee) { this.platformFee = platformFee; }
    public BigDecimal getTutorPayout() { return tutorPayout; }
    public void setTutorPayout(BigDecimal tutorPayout) { this.tutorPayout = tutorPayout; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPayherePaymentId() { return payherePaymentId; }
    public void setPayherePaymentId(String payherePaymentId) { this.payherePaymentId = payherePaymentId; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
