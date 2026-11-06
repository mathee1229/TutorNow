package com.tutornow.repository;

import com.tutornow.model.Booking;
import com.tutornow.model.Review;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeOrderByCreatedAtDesc(User reviewee);
    List<Review> findByBooking(Booking booking);
    List<Review> findAllByOrderByCreatedAtDesc();
}
