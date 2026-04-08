package com.project.backend.controller;

import com.project.backend.response.UserResponse;
import com.project.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin REST API Endpoints", description = "Operation related to a admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Operation(summary = "Get all users", description = "Fetch all user's accounts")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<UserResponse> findAll(){
        return adminService.getAllUser();
    }

    @Operation(summary = "Promote new admin", description = "Promote user to admin")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/promoted/{userId}")
    public UserResponse promoteToAdmin(@Min(1) @PathVariable long userId){
        return adminService.promoteToAdmin(userId);
    }

    @Operation(summary = "Delete non-admin users", description = "Delete non-admin users")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{userId}")
    public void deleteUser(@Min(1) @PathVariable long userId){
        adminService.deleteNonAdminUser(userId);
    }
}
