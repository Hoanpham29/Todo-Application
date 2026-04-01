package com.project.backend.repository;

import com.project.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepsitory extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
