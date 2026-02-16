package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import puredubstep.entity.PlayHistory;
import puredubstep.entity.User;

import java.util.List;

@Repository
public interface PlayHistoryRepository extends JpaRepository<PlayHistory, Long> {

    Page<PlayHistory> findByUserOrderByPlayedAtDesc(User user, Pageable pageable);

    List<PlayHistory> findByUserOrderByPlayedAtDesc(User user);

    void deleteByUser(User user);
}
