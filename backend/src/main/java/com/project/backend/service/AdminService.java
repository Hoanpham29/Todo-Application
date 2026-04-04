package com.project.backend.service;

import com.project.backend.response.UserResponse;

import java.util.List;

public interface AdminService {
    List<UserResponse> getAllUser();
    UserResponse promoteToAdmin(long userId);
    void deleteNonAdminUser(long userId);
}
