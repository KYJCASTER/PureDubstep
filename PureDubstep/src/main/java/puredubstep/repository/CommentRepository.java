package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Comment;
import puredubstep.entity.Track;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByTrackOrderByCreatedAtDesc(Track track, Pageable pageable);

    Long countByTrack(Track track);
}
