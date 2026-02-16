package puredubstep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDTO {
    private Long id;
    private String name;
    private String bio;
    private String imageUrl;
    private String country;
    private LocalDateTime createdAt;
    private Integer trackCount;
}
