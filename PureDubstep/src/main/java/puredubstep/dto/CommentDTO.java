package puredubstep.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {

    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String userAvatar;
    private Long trackId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
