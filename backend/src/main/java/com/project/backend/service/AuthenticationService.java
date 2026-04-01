package com.project.backend.service;

import com.project.backend.request.AuthenticationRequest;
import com.project.backend.request.RegisterRequest;
import com.project.backend.response.AuthenticationResponse;

public interface AuthenticationService {
    void register(RegisterRequest input) throws Exception;
    AuthenticationResponse login(AuthenticationRequest request);
}
