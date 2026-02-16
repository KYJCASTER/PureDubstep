package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Track;

import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {

    Page<Track> findByArtistId(Long artistId, Pageable pageable);

    Page<Track> findByGenre(String genre, Pageable pageable);

    @Query("SELECT t FROM Track t WHERE " +
           "(:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:artistName IS NULL OR LOWER(t.artist.name) LIKE LOWER(CONCAT('%', :artistName, '%'))) AND " +
           "(:artistId IS NULL OR t.artist.id = :artistId) AND " +
           "(:genre IS NULL OR LOWER(t.genre) LIKE LOWER(CONCAT('%', :genre, '%')))")
    Page<Track> searchTracks(
        @Param("title") String title,
        @Param("artistName") String artistName,
        @Param("artistId") Long artistId,
        @Param("genre") String genre,
        Pageable pageable
    );

    @Query("SELECT t FROM Track t ORDER BY t.plays DESC")
    Page<Track> findTopPlayed(Pageable pageable);

    @Query("SELECT t FROM Track t ORDER BY t.createdAt DESC")
    Page<Track> findLatest(Pageable pageable);

    List<Track> findByIdIn(List<Long> ids);
}
