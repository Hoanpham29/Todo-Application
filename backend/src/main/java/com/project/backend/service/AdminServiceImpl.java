package com.project.backend.service;

import com.project.backend.entity.Authority;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepsitory;
import com.project.backend.response.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class AdminServiceImpl implements AdminService{

    private UserRepsitory userRepsitory;

    public AdminServiceImpl(UserRepsitory userRepsitory) {
        this.userRepsitory = userRepsitory;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUser() {
        return StreamSupport.stream(userRepsitory.findAll().spliterator(),false)
                .map(this::convertToUserResponse).toList();
    }

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities().stream().map(auth -> (Authority) auth).toList()
        );
    }

    @Override
    @Transactional
    public UserResponse promoteToAdmin(long userId) {
        Optional<User> user = userRepsitory.findById(userId);

        if(user.isEmpty() || user.get().getAuthorities()
                .stream().anyMatch(authority ->"ROLE_ADMIN".equals(authority.getAuthority()))){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST    ,"User does not exist or already admin");
        }
        List<Authority> authorities = new ArrayList<>();
        authorities.add(new Authority("ROLE_ADMIN"));
        authorities.add(new Authority("ROLE_EMPLOYEE"));
        user.get().setAuthorities(authorities);

        User saveUser = userRepsitory.save(user.get());

        return convertToUserResponse(saveUser);
    }

    @Override
    @Transactional
    public void deleteNonAdminUser(long userId) {
        Optional<User> user = userRepsitory.findById(userId);

        if(user.isEmpty() || user.get().getAuthorities().stream().anyMatch(authority -> "ROLE_ADMIN"
                .equals(authority.getAuthority()))){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User does not exist or already admin");
        }

        userRepsitory.delete(user.get());
    }
}
