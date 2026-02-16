package puredubstep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistDTO {
    private Long id;
    private String name;
    private String description;
    private String coverUrl;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
    private Integer trackCount;
    private List<TrackDTO> tracks;
}
