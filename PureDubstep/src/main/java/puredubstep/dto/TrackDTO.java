package puredubstep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackDTO {
    private Long id;
    private String title;
    private Long artistId;
    private String artistName;
    private String artistImageUrl;
    private String album;
    private Integer duration;
    private String coverUrl;
    private String audioUrl;
    private String genre;
    private Integer bpm;
    private LocalDate releaseDate;
    private Integer plays;
    private LocalDateTime createdAt;
    private Boolean isFavorite;
}
