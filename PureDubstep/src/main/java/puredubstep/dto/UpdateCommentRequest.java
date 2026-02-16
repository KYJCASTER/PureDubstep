package puredubstep.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCommentRequest {

    @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
    private String content;
}
