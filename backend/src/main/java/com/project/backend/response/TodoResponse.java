package com.project.backend.response;

import java.util.Date;

public class TodoResponse {
    private long id;
    private String title;
    private String description;
    private int priority;
    private boolean complete;
    private Date created_at;

    public TodoResponse(long id, String title, String description, int priority, boolean complete, Date created_at) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.complete = complete;
        this.created_at = created_at;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public boolean isComplete() {
        return complete;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }
}
