package com.tutornow.dto;

import com.tutornow.model.DeliveryMode;
import com.tutornow.model.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LessonRequestDto {

    public static class CreateLessonRequest {
        @NotBlank(message = "Subject is required")
        private String subject;

        @NotBlank(message = "Topic is required")
        private String lessonTopic;

        private String studentGrade;

        @NotNull(message = "Target budget is required")
        private BigDecimal targetBudget;

        @NotNull(message = "Preferred slot time is required")
        private LocalDateTime preferredSlot;

        @NotNull(message = "Delivery mode is required")
        private DeliveryMode deliveryMode;

        private String townName;
        private Double latitude;
        private Double longitude;
        private String fullAddress;
        private String attachmentUrls;

        public CreateLessonRequest() {}

        public CreateLessonRequest(String subject, String lessonTopic, String studentGrade, BigDecimal targetBudget,
                                   LocalDateTime preferredSlot, DeliveryMode deliveryMode, String townName,
                                   Double latitude, Double longitude, String fullAddress, String attachmentUrls) {
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
        }

        public static CreateLessonRequestBuilder builder() {
            return new CreateLessonRequestBuilder();
        }

        public static class CreateLessonRequestBuilder {
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

            public CreateLessonRequestBuilder subject(String subject) { this.subject = subject; return this; }
            public CreateLessonRequestBuilder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
            public CreateLessonRequestBuilder studentGrade(String studentGrade) { this.studentGrade = studentGrade; return this; }
            public CreateLessonRequestBuilder targetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; return this; }
            public CreateLessonRequestBuilder preferredSlot(LocalDateTime preferredSlot) { this.preferredSlot = preferredSlot; return this; }
            public CreateLessonRequestBuilder deliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; return this; }
            public CreateLessonRequestBuilder townName(String townName) { this.townName = townName; return this; }
            public CreateLessonRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
            public CreateLessonRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
            public CreateLessonRequestBuilder fullAddress(String fullAddress) { this.fullAddress = fullAddress; return this; }
            public CreateLessonRequestBuilder attachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; return this; }

            public CreateLessonRequest build() {
                return new CreateLessonRequest(subject, lessonTopic, studentGrade, targetBudget, preferredSlot, deliveryMode, townName, latitude, longitude, fullAddress, attachmentUrls);
            }
        }

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
    }

    public static class LessonRequestResponse {
        private Long id;
        private Long studentId;
        private String studentName;
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
        private RequestStatus status;
        private int bidsCount;
        private LocalDateTime createdAt;

        public LessonRequestResponse() {}

        public LessonRequestResponse(Long id, Long studentId, String studentName, String subject, String lessonTopic,
                                     String studentGrade, BigDecimal targetBudget, LocalDateTime preferredSlot,
                                     DeliveryMode deliveryMode, String townName, Double latitude, Double longitude,
                                     String fullAddress, String attachmentUrls, RequestStatus status, int bidsCount,
                                     LocalDateTime createdAt) {
            this.id = id;
            this.studentId = studentId;
            this.studentName = studentName;
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
            this.status = status;
            this.bidsCount = bidsCount;
            this.createdAt = createdAt;
        }

        public static LessonRequestResponseBuilder builder() {
            return new LessonRequestResponseBuilder();
        }

        public static class LessonRequestResponseBuilder {
            private Long id;
            private Long studentId;
            private String studentName;
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
            private RequestStatus status;
            private int bidsCount;
            private LocalDateTime createdAt;

            public LessonRequestResponseBuilder id(Long id) { this.id = id; return this; }
            public LessonRequestResponseBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
            public LessonRequestResponseBuilder studentName(String studentName) { this.studentName = studentName; return this; }
            public LessonRequestResponseBuilder subject(String subject) { this.subject = subject; return this; }
            public LessonRequestResponseBuilder lessonTopic(String lessonTopic) { this.lessonTopic = lessonTopic; return this; }
            public LessonRequestResponseBuilder studentGrade(String studentGrade) { this.studentGrade = studentGrade; return this; }
            public LessonRequestResponseBuilder targetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; return this; }
            public LessonRequestResponseBuilder preferredSlot(LocalDateTime preferredSlot) { this.preferredSlot = preferredSlot; return this; }
            public LessonRequestResponseBuilder deliveryMode(DeliveryMode deliveryMode) { this.deliveryMode = deliveryMode; return this; }
            public LessonRequestResponseBuilder townName(String townName) { this.townName = townName; return this; }
            public LessonRequestResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
            public LessonRequestResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
            public LessonRequestResponseBuilder fullAddress(String fullAddress) { this.fullAddress = fullAddress; return this; }
            public LessonRequestResponseBuilder attachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; return this; }
            public LessonRequestResponseBuilder status(RequestStatus status) { this.status = status; return this; }
            public LessonRequestResponseBuilder bidsCount(int bidsCount) { this.bidsCount = bidsCount; return this; }
            public LessonRequestResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public LessonRequestResponse build() {
                return new LessonRequestResponse(id, studentId, studentName, subject, lessonTopic, studentGrade, targetBudget, preferredSlot, deliveryMode, townName, latitude, longitude, fullAddress, attachmentUrls, status, bidsCount, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
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
        public int getBidsCount() { return bidsCount; }
        public void setBidsCount(int bidsCount) { this.bidsCount = bidsCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
