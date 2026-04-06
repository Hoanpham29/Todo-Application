package com.project.backend.controller;

import com.project.backend.entity.User;
import com.project.backend.request.TodoRequest;
import com.project.backend.response.TodoResponse;
import com.project.backend.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.websocket.OnOpen;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@Tag(name = "Todo REST API Endpoints", description = "Operation for mapping use todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @Operation(summary = "Get all todos for user", description = "Fetch all todos from sign in")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<TodoResponse> findAll(){
        return todoService.findAll();
    }

    @Operation(summary = "Find todo", description = "Find todo by ID")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public TodoResponse findByid(@Min(1) @PathVariable long id){
        return todoService.findById(id);
    }

    @Operation(summary = "Create todo for user", description = "Create new todo for sign in")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public TodoResponse createTodo(@Valid @RequestBody TodoRequest todoRequest){
        return todoService.createTodo(todoRequest);
    }

    @Operation(summary = "Toggle completion todo", description = "Change completion status")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/toggleComplete/{id}")
    public TodoResponse toggleCompletion(@Min(1) @PathVariable long id){
        return todoService.toggleTodoCompletion(id);
    }

    @Operation(summary = "Delete todo", description = "Delete todo for login user")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    public void deleteTodo(@Min(1) @PathVariable long id){
        todoService.deleteTodo(id);
    }

    @Operation(summary = "Update todo", description = "Update todo details for login user")
    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    public TodoResponse updateTodo(
            @Min(1) @PathVariable long id,
            @RequestBody TodoRequest todoRequest){
        return todoService.updateTodo(id,todoRequest);
    }
}
