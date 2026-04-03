package com.project.backend.service;

import com.project.backend.entity.Authority;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepsitory;
import com.project.backend.request.PasswordUpdateRequest;
import com.project.backend.response.UserResponse;
import com.project.backend.util.FindAuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepsitory userRepsitory;
    private final FindAuthenticatedUser findAuthenticatedUser;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepsitory userRepsitory, FindAuthenticatedUser findAuthenticatedUser, PasswordEncoder passwordEncoder) {
        this.userRepsitory = userRepsitory;
        this.findAuthenticatedUser = findAuthenticatedUser;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserInfo() {
        User user = findAuthenticatedUser.getAuthenticatedUser();

        return new UserResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities().stream().map(auth -> (Authority) auth).toList()
        );
    }

    @Override
    @Transactional
    public void deleteUser() {
        User user = findAuthenticatedUser.getAuthenticatedUser();

        if(isTheLastAdmin(user)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Admin can not delete itself");
        }

        userRepsitory.delete(user);
    }

    @Override
    @Transactional
    public void updatePassword(PasswordUpdateRequest passwordUpdateRequest) {
        User user = findAuthenticatedUser.getAuthenticatedUser();

        if(!isPasswordCorrect(user.getPassword(),passwordUpdateRequest.getOldPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if(!isNewPasswordConfirmed(passwordUpdateRequest.getNewPassword(),
                passwordUpdateRequest.getNewPassword2())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"New passwords do not match");
        }

        if(!isPasswordDifferent(passwordUpdateRequest.getOldPassword(),
                passwordUpdateRequest.getNewPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Old & new Password mus be different");
        }
    }

    private boolean isPasswordDifferent(String oldPassword, String newPassword) {
        return !oldPassword.equals(newPassword);
    }

    private boolean isNewPasswordConfirmed(String newPassword, String newPasswordConfirmed) {
        return newPassword.equals(newPasswordConfirmed);
    }

    private boolean isPasswordCorrect(String currentPassword, String oldPassword) {
        return passwordEncoder.matches(oldPassword, currentPassword);
    }

    private boolean isTheLastAdmin(User user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if(isAdmin){
            long adminCount = userRepsitory.countAdminUsers();
            return adminCount<=1;
        }
        return false;
    }

}
