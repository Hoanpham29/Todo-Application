package com.project.backend.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class TodoRequest {

    @Size(min = 3, max = 50, message = "Title must be at least 3 characters long")
    private String title;

    @Size(min = 3, max = 50, message = "Title must be at least 3 characters long")
    private String description;

    @Min(1)
    @Max(5)
    private int priority;

    public TodoRequest(String title, String description, int priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }
}
