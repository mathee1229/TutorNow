package com.tutornow.dto;

import com.tutornow.model.BookingStatus;
import com.tutornow.model.DeliveryMode;
import com.tutornow.model.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingDto {

    public static class BookingResponse {
        private Long id;
        private Long lessonRequestId;
        private String subject;
        private String lessonTopic;
        private DeliveryMode deliveryMode;
        private Long studentId;
        private String studentName;
        private String studentPhone;
        private Long tutorId;
        private String tutorName;
        private String tutorPhone;
        private BigDecimal agreedPrice;
        private BigDecimal platformFee;
        private BigDecimal tutorPayout;
        private PaymentStatus paymentStatus;
        private String payherePaymentId;
        private String meetingLink;
        private BookingStatus status;
        private String fullAddress;
        private LocalDateTime createdAt;

        public BookingResponse() {}

        public BookingResponse(Long id, Long lessonRequestId, String subject, String lessonTopic, DeliveryMode deliveryMode,
                               Long studentId, String studentName, String studentPhone, Long tutorId, String tutorName,
                               String tutorPhone, BigDecimal agreedPrice, BigDecimal platformFee, BigDecimal tutorPayout,
                               PaymentStatus paymentStatus, String payherePaymentId, String meetingLink,
                               BookingStatus status, String fullAddress, LocalDateTime createdAt) {
            this.id = id;
            this.lessonRequestId = lessonRequestId;
            this.subject = subject;
            this.lessonTopic = lessonTopic;
            this.deliveryMode = deliveryMode;
            this.studentId = studentId;
            this.studentName = studentName;
            this.studentPhone = studentPhone;
            this.tutorId = tutorId;
            this.tutorName = tutorName;
            this.tutorPhone = tutorPhone;
            this.agreedPrice = agreedPrice;
            this.platformFee = platformFee;
            this.tutorPayout = tutorPayout;
            this.paymentStatus = paymentStatus;
            this.payherePaymentId = payherePaymentId;
            this.meetingLink = meetingLink;
            this.status = status;
            this.fullAddress = fullAddress;
            this.createdAt = createdAt;
        }

        public static BookingResponseBuilder builder() {
            return new BookingResponseBuilder();
        }

        public static class BookingResponseBuilder {
            private Long id;
            private Long lessonRequestId;
            private String subject;
            private String lessonTopic;
            private DeliveryMode deliveryMode;
            private Long studentId;
            private String studentName;
            private String studentPhone;
            private Long tutorId;
            private String tutorName;
            private String tutorPhone;
            private BigDecimal agreedPrice;
            private BigDecimal platformFee;
            private BigDecimal tutorPayout;
            private PaymentStatus paymentStatus;
            private String payherePaymentId;
            private String meetingLink;
            private BookingStatus status;
            private String fullAddress;
            private LocalDateTime createdAt;

            public BookingResponseBuilder id(Long id) { this.id = id; return this; }
            public BookingResponseBuilder lessonRequestId(Long lessonRequestId) { this.lessonRequestId = lessonRequestId; return this; }
            public BookingResponseBuilder subject(String subject) { this.subject = subject; return this; }
            public BookingResponseBuilder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
            public BookingResponseBuilder deliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; return this; }
            public BookingResponseBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
            public BookingResponseBuilder studentName(String studentName) { this.studentName = studentName; return this; }
            public BookingResponseBuilder studentPhone(String studentPhone) { this.studentPhone = studentPhone; return this; }
            public BookingResponseBuilder tutorId(Long tutorId) { this.tutorId = tutorId; return this; }
            public BookingResponseBuilder tutorName(String tutorName) { this.tutorName = tutorName; return this; }
            public BookingResponseBuilder tutorPhone(String tutorPhone) { this.tutorPhone = tutorPhone; return this; }
            public BookingResponseBuilder agreedPrice(BigDecimal agreedPrice) { this.agreedPrice = agreedPrice; return this; }
            public BookingResponseBuilder platformFee(BigDecimal platformFee) { this.platformFee = platformFee; return this; }
            public BookingResponseBuilder tutorPayout(BigDecimal tutorPayout) { this.tutorPayout = tutorPayout; return this; }
            public BookingResponseBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
            public BookingResponseBuilder payherePaymentId(String payherePaymentId) { this.payherePaymentId = payherePaymentId; return this; }
            public BookingResponseBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
            public BookingResponseBuilder status(BookingStatus status) { this.status = status; return this; }
            public BookingResponseBuilder fullAddress(String fullAddress) { this.fullAddress = fullAddress; return this; }
            public BookingResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public BookingResponse build() {
                return new BookingResponse(id, lessonRequestId, subject, lessonTopic, deliveryMode, studentId, studentName, studentPhone, tutorId, tutorName, tutorPhone, agreedPrice, platformFee, tutorPayout, paymentStatus, payherePaymentId, meetingLink, status, fullAddress, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getLessonRequestId() { return lessonRequestId; }
        public void setLessonRequestId(Long lessonRequestId) { this.lessonRequestId = lessonRequestId; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getLessonTopic() { return lessonTopic; }
        public void setLessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; }
        public DeliveryMode getDeliveryMode() { return deliveryMode; }
        public void setDeliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getStudentPhone() { return studentPhone; }
        public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }
        public Long getTutorId() { return tutorId; }
        public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
        public String getTutorName() { return tutorName; }
        public void setTutorName(String tutorName) { this.tutorName = tutorName; }
        public String getTutorPhone() { return tutorPhone; }
        public void setTutorPhone(String tutorPhone) { this.tutorPhone = tutorPhone; }
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
        public String getFullAddress() { return fullAddress; }
        public void setFullAddress(String fullAddress) { this.fullAddress = fullAddress; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
