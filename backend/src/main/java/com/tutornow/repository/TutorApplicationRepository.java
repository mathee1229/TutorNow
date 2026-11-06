package com.tutornow.repository;

import com.tutornow.model.ApplicationStatus;
import com.tutornow.model.LessonRequest;
import com.tutornow.model.TutorApplication;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorApplicationRepository extends JpaRepository<TutorApplication, Long> {
    List<TutorApplication> findByLessonRequestId(Long lessonRequestId);
    List<TutorApplication> findByTutorOrderByCreatedAtDesc(User tutor);
    Optional<TutorApplication> findByLessonRequestAndTutor(LessonRequest lessonRequest, User tutor);
    List<TutorApplication> findByLessonRequestIdAndStatus(Long lessonRequestId, ApplicationStatus status);
    long countByLessonRequestId(Long lessonRequestId);
    void deleteByLessonRequestId(Long lessonRequestId);
}
