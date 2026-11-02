package com.tutornow.dto;

import java.math.BigDecimal;

public class TutorProfileDto {

    public static class TutorProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String university;
        private String degreeField;
        private BigDecimal hourlyRate;
        private String bio;
        private String idProofUrl;
        private String marksheetProofUrl;
        private boolean isVerified;
        private Double ratingAvg;
        private Integer totalReviews;

        public TutorProfileResponse() {}

        public TutorProfileResponse(Long id, Long userId, String fullName, String email, String university,
                                    String degreeField, BigDecimal hourlyRate, String bio, String idProofUrl,
                                    String marksheetProofUrl, boolean isVerified, Double ratingAvg, Integer totalReviews) {
            this.id = id;
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
            this.university = university;
            this.degreeField = degreeField;
            this.hourlyRate = hourlyRate;
            this.bio = bio;
            this.idProofUrl = idProofUrl;
            this.marksheetProofUrl = marksheetProofUrl;
            this.isVerified = isVerified;
            this.ratingAvg = ratingAvg;
            this.totalReviews = totalReviews;
        }

        public static TutorProfileResponseBuilder builder() {
            return new TutorProfileResponseBuilder();
        }

        public static class TutorProfileResponseBuilder {
            private Long id;
            private Long userId;
            private String fullName;
            private String email;
            private String university;
            private String degreeField;
            private BigDecimal hourlyRate;
            private String bio;
            private String idProofUrl;
            private String marksheetProofUrl;
            private boolean isVerified;
            private Double ratingAvg;
            private Integer totalReviews;

            public TutorProfileResponseBuilder id(Long id) { this.id = id; return this; }
            public TutorProfileResponseBuilder userId(Long userId) { this.userId = userId; return this; }
            public TutorProfileResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
            public TutorProfileResponseBuilder email(String email) { this.email = email; return this; }
            public TutorProfileResponseBuilder university(String university) { this.university = university; return this; }
            public TutorProfileResponseBuilder degreeField(String degreeField) { this.degreeField = degreeField; return this; }
            public TutorProfileResponseBuilder hourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; return this; }
            public TutorProfileResponseBuilder bio(String bio) { this.bio = bio; return this; }
            public TutorProfileResponseBuilder idProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; return this; }
            public TutorProfileResponseBuilder marksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; return this; }
            public TutorProfileResponseBuilder isVerified(boolean isVerified) { this.isVerified = isVerified; return this; }
            public TutorProfileResponseBuilder ratingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; return this; }
            public TutorProfileResponseBuilder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }

            public TutorProfileResponse build() {
                return new TutorProfileResponse(id, userId, fullName, email, university, degreeField, hourlyRate, bio, idProofUrl, marksheetProofUrl, isVerified, ratingAvg, totalReviews);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUniversity() { return university; }
        public void setUniversity(String university) { this.university = university; }
        public String getDegreeField() { return degreeField; }
        public void setDegreeField(String degreeField) { this.degreeField = degreeField; }
        public BigDecimal getHourlyRate() { return hourlyRate; }
        public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getIdProofUrl() { return idProofUrl; }
        public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }
        public String getMarksheetProofUrl() { return marksheetProofUrl; }
        public void setMarksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; }
        public boolean isVerified() { return isVerified; }
        public void setVerified(boolean verified) { isVerified = verified; }
        public Double getRatingAvg() { return ratingAvg; }
        public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }
        public Integer getTotalReviews() { return totalReviews; }
        public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    }
}
