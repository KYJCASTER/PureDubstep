package puredubstep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTrackRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Artist ID is required")
    private Long artistId;

    private String album;
    private Integer duration;
    private String coverUrl;

    @NotBlank(message = "Audio URL is required")
    private String audioUrl;

    private String genre;
    private Integer bpm;
    private LocalDate releaseDate;
}
