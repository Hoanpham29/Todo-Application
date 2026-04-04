package com.project.backend.repository;

import com.project.backend.entity.Todo;
import com.project.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends CrudRepository<Todo,Long> {
    List<Todo> findByOwner(User owner);
    Optional<Todo> findByIdAndOwner(Long id, User owner);
}
