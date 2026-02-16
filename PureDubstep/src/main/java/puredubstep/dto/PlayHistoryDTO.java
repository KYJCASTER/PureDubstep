package puredubstep.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayHistoryDTO {

    private Long id;
    private Long userId;
    private String username;
    private Long trackId;
    private String trackTitle;
    private String artistName;
    private String artistImageUrl;
    private String coverUrl;
    private String audioUrl;
    private Integer duration;
    private LocalDateTime playedAt;
}
