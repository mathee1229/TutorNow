package com.tutornow.repository;

import com.tutornow.model.Booking;
import com.tutornow.model.BookingStatus;
import com.tutornow.model.PaymentStatus;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByLessonRequestId(Long lessonRequestId);
    List<Booking> findByStudentOrderByCreatedAtDesc(User student);
    List<Booking> findByTutorOrderByCreatedAtDesc(User tutor);
    Optional<Booking> findByPayherePaymentId(String payherePaymentId);
    long countByStatus(BookingStatus status);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByPaymentStatus(PaymentStatus paymentStatus);
}
