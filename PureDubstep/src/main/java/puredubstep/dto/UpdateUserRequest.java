package puredubstep.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String email;
    private String avatar;
    private String password;
}
