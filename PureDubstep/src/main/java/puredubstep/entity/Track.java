package puredubstep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @Column(length = 200)
    private String album;

    private Integer duration;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "audio_url", nullable = false, length = 500)
    private String audioUrl;

    @Column(length = 50)
    private String genre;

    private Integer bpm;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Builder.Default
    private Integer plays = 0;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
