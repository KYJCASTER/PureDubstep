package puredubstep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "play_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @Column(name = "played_at")
    @Builder.Default
    private LocalDateTime playedAt = LocalDateTime.now();
}
