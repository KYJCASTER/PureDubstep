package puredubstep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotNull(message = "Track ID is required")
    private Long trackId;

    @NotBlank(message = "Content is required")
    private String content;
}
