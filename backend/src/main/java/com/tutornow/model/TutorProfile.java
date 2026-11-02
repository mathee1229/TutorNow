package com.tutornow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tutor_profiles")
public class TutorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String university;
    private String degreeField;
    private BigDecimal hourlyRate;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String idProofUrl;
    private String marksheetProofUrl;

    private boolean isVerified = false;
    private Double ratingAvg = 0.0;
    private Integer totalReviews = 0;

    public TutorProfile() {}

    public TutorProfile(Long id, User user, String university, String degreeField, BigDecimal hourlyRate,
                        String bio, String idProofUrl, String marksheetProofUrl, boolean isVerified,
                        Double ratingAvg, Integer totalReviews) {
        this.id = id;
        this.user = user;
        this.university = university;
        this.degreeField = degreeField;
        this.hourlyRate = hourlyRate;
        this.bio = bio;
        this.idProofUrl = idProofUrl;
        this.marksheetProofUrl = marksheetProofUrl;
        this.isVerified = isVerified;
        this.ratingAvg = ratingAvg != null ? ratingAvg : 0.0;
        this.totalReviews = totalReviews != null ? totalReviews : 0;
    }

    public static TutorProfileBuilder builder() {
        return new TutorProfileBuilder();
    }

    public static class TutorProfileBuilder {
        private Long id;
        private User user;
        private String university;
        private String degreeField;
        private BigDecimal hourlyRate;
        private String bio;
        private String idProofUrl;
        private String marksheetProofUrl;
        private boolean isVerified = false;
        private Double ratingAvg = 0.0;
        private Integer totalReviews = 0;

        public TutorProfileBuilder id(Long id) { this.id = id; return this; }
        public TutorProfileBuilder user(User user) { this.user = user; return this; }
        public TutorProfileBuilder university(String university) { this.university = university; return this; }
        public TutorProfileBuilder degreeField(String degreeField) { this.degreeField = degreeField; return this; }
        public TutorProfileBuilder hourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; return this; }
        public TutorProfileBuilder bio(String bio) { this.bio = bio; return this; }
        public TutorProfileBuilder idProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; return this; }
        public TutorProfileBuilder marksheetProofUrl(String marksheetProofUrl) { this.marksheetProofUrl = marksheetProofUrl; return this; }
        public TutorProfileBuilder isVerified(boolean isVerified) { this.isVerified = isVerified; return this; }
        public TutorProfileBuilder ratingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; return this; }
        public TutorProfileBuilder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }

        public TutorProfile build() {
            return new TutorProfile(id, user, university, degreeField, hourlyRate, bio, idProofUrl, marksheetProofUrl, isVerified, ratingAvg, totalReviews);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }
    public String getDegreeField() { return degreeField; }
    public void setDegreeField(String degreeField) { this.degreeField = degreeField; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String idProofUrl() { return idProofUrl; }
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
