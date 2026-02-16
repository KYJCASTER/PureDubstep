package puredubstep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 50)
    private String country;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Track> tracks = new ArrayList<>();
}
