package com.project.backend.service;

import com.project.backend.request.PasswordUpdateRequest;
import com.project.backend.response.UserResponse;

public interface UserService {

    UserResponse getUserInfo();

    void deleteUser();

    void updatePassword(PasswordUpdateRequest passwordUpdateRequest);
}
