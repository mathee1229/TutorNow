package com.tutornow.repository;

import com.tutornow.model.TutorProfile;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long> {
    Optional<TutorProfile> findByUser(User user);
    Optional<TutorProfile> findByUserId(Long userId);
    List<TutorProfile> findByIsVerifiedTrue();
    long countByIsVerifiedFalse();
    List<TutorProfile> findAllByOrderByIdDesc();
}
