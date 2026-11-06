package com.tutornow.repository;

import com.tutornow.model.Role;
import com.tutornow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByActive(boolean active);
    List<User> findAllByOrderByCreatedAtDesc();
}
