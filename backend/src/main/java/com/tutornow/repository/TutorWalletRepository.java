package com.tutornow.repository;

import com.tutornow.model.TutorWallet;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorWalletRepository extends JpaRepository<TutorWallet, Long> {
    Optional<TutorWallet> findByTutor(User tutor);
    Optional<TutorWallet> findByTutorId(Long tutorId);
}
