package com.project.backend.service;

import com.project.backend.request.TodoRequest;
import com.project.backend.response.TodoResponse;

import java.util.List;

public interface TodoService {
    List<TodoResponse> findAll();
    TodoResponse createTodo(TodoRequest request);
    TodoResponse toggleTodoCompletion(long id);
    TodoResponse updateTodo(long id, TodoRequest todoRequest);
    void deleteTodo(long id);
}
