package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Playlist;
import puredubstep.entity.User;

import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    Page<Playlist> findByUser(User user, Pageable pageable);
    Page<Playlist> findByIsPublicTrue(Pageable pageable);
    Optional<Playlist> findByIdAndUser(Long id, User user);
}
