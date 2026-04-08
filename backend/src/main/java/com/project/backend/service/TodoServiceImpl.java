package com.project.backend.service;

import com.project.backend.entity.Todo;
import com.project.backend.entity.User;
import com.project.backend.repository.TodoRepository;
import com.project.backend.request.TodoRequest;
import com.project.backend.response.TodoResponse;
import com.project.backend.util.FindAuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class TodoServiceImpl implements TodoService{

    private final TodoRepository todoRepository;
    private final FindAuthenticatedUser findAuthenticatedUser;

    public TodoServiceImpl(TodoRepository todoRepository, FindAuthenticatedUser findAuthenticatedUser) {
        this.todoRepository = todoRepository;
        this.findAuthenticatedUser = findAuthenticatedUser;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> findAll() {
        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        return todoRepository.findByOwner(currentUser)
                .stream()
                .sorted(Comparator.comparing(Todo::getCreatedAt).reversed())
                .map(this::convertTodoResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse findById(long id) {

        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        Optional<Todo> todo = todoRepository.findByIdAndOwner(id, currentUser);

        if(todo.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Todo not found");
        }

        return convertTodoResponse(todo.get());
    }

    @Override
    @Transactional
    public TodoResponse createTodo(TodoRequest request) {
        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        Todo todo = new Todo(
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                false,
                currentUser
        );
        Todo saveTodo = todoRepository.save(todo);
        return convertTodoResponse(saveTodo);
    }

    @Override
    @Transactional
    public TodoResponse toggleTodoCompletion(long id) {
        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        Optional<Todo> todo = todoRepository.findByIdAndOwner(id, currentUser);

        if(todo.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Todo not found");
        }
        todo.get().setComplete(!todo.get().isComplete());
        Todo updateTodo = todoRepository.save(todo.get());
        return convertTodoResponse(updateTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateTodo(long id, TodoRequest todoRequest) {
        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        Todo todo = todoRepository.findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todo not found"));

        if (todoRequest.getTitle() != null) {
            todo.setTitle(todoRequest.getTitle());
        }

        if (todoRequest.getDescription() != null) {
            todo.setDescription(todoRequest.getDescription());
        }

        if (todoRequest.getPriority() != 0) {
            todo.setPriority(todoRequest.getPriority());
        }

        Todo savedTodo = todoRepository.save(todo);
        return convertTodoResponse(savedTodo);
    }

    @Override
    @Transactional
    public void deleteTodo(long id) {
        User currentUser = findAuthenticatedUser.getAuthenticatedUser();

        Optional<Todo> todo = todoRepository.findByIdAndOwner(id, currentUser);

        if(todo.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todo not found");
        }

        todoRepository.delete(todo.get());
    }

    private TodoResponse convertTodoResponse(Todo todo){
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getPriority(),
                todo.isComplete(),
                todo.getCreatedAt()
        );
    }
}
