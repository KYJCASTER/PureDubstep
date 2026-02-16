package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.UpdateUserRequest;
import puredubstep.dto.UserDTO;
import puredubstep.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateCurrentUser(request));
    }
}
