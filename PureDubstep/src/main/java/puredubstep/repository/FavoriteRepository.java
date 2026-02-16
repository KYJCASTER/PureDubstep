package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Favorite;
import puredubstep.entity.Track;
import puredubstep.entity.User;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndTrack(User user, Track track);
    boolean existsByUserAndTrack(User user, Track track);
    void deleteByUserAndTrack(User user, Track track);
    Page<Favorite> findByUser(User user, Pageable pageable);
}
