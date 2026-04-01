package com.project.backend.controller;

import com.project.backend.request.AuthenticationRequest;
import com.project.backend.request.RegisterRequest;
import com.project.backend.response.AuthenticationResponse;
import com.project.backend.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication REST API Endpoints", description = "Operations related to register & login")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Operation(summary = "Register a user", description = "Create new user in database")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public void register(@Valid @RequestBody RegisterRequest registerRequest) throws  Exception{
        authenticationService.register(registerRequest);
    }

    @Operation(summary = "Login a user", description = "Submit email & password to login")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    public AuthenticationResponse login(@Valid @RequestBody AuthenticationRequest authenticationRequest){
        return authenticationService.login(authenticationRequest);
    }
}
