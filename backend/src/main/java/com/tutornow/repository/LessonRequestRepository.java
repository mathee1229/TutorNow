package com.tutornow.repository;

import com.tutornow.model.DeliveryMode;
import com.tutornow.model.LessonRequest;
import com.tutornow.model.RequestStatus;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRequestRepository extends JpaRepository<LessonRequest, Long> {
    List<LessonRequest> findByStudentOrderByCreatedAtDesc(User student);
    List<LessonRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<LessonRequest> findByDeliveryModeAndStatus(DeliveryMode deliveryMode, RequestStatus status);
    List<LessonRequest> findBySubjectContainingIgnoreCaseAndStatus(String subject, RequestStatus status);
    long countByStatus(RequestStatus status);
    List<LessonRequest> findAllByOrderByCreatedAtDesc();
}
