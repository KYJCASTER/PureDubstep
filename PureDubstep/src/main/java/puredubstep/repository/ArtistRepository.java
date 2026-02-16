package puredubstep.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Artist;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Page<Artist> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE " +
           "(:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Artist> searchArtists(@Param("name") String name, Pageable pageable);
}
