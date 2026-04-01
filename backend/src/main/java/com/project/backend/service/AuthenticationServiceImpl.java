package com.project.backend.service;

import com.project.backend.entity.Authority;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepsitory;
import com.project.backend.request.AuthenticationRequest;
import com.project.backend.request.RegisterRequest;
import com.project.backend.response.AuthenticationResponse;
import jakarta.validation.constraints.Size;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class AuthenticationServiceImpl implements AuthenticationService{

    private final UserRepsitory userRepsitory;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationServiceImpl(UserRepsitory userRepsitory, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepsitory = userRepsitory;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public void register(RegisterRequest input) throws Exception {
        if(isEmailTaken(input.getEmail())){
            throw new Exception("Email is already taken");
        }

        User user = buildNewUser(input);
        userRepsitory.save(user);

    }

    @Override
    @Transactional
    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepsitory.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String jwtToken = jwtService.generateToken(new HashMap<>(),user);

        return new AuthenticationResponse(jwtToken);
    }

    private User buildNewUser(RegisterRequest input) {
        User user = new User();
        user.setId(0);
        user.setFirstName(input.getFirstName());
        user.setLastName(input.getLastName());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setAuthorities(initialAuthoity());
        return user;
    }

    private List<Authority> initialAuthoity() {
        boolean isFirstUser = userRepsitory.count()==0;
        List<Authority> authorities = new ArrayList<>();
        authorities.add(new Authority("ROLE_EMPLOYEE"));

        if(isFirstUser){
            authorities.add(new Authority("ROLE_ADMIN"));
        }

        return authorities;
    }

    private boolean isEmailTaken(String email) {
        return userRepsitory.findByEmail(email).isPresent();
    }
    
    
}
