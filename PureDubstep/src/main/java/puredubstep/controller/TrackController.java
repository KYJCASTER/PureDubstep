package puredubstep.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.*;
import puredubstep.service.TrackService;

@Slf4j
@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @GetMapping
    public ResponseEntity<PageResponse<TrackDTO>> getAllTracks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String artistName,
            @RequestParam(required = false) Long artistId,
            @RequestParam(required = false) String genre) {

        log.info("Fetching tracks - page: {}, size: {}, sortBy: {}, sortDir: {}", page, size, sortBy, sortDir);
        int safeSize = Math.min(size, 50);
        Sort sort = sortDir.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, safeSize, sort);

        if (title != null || artistName != null || artistId != null || genre != null) {
            log.debug("Searching tracks - title: {}, artistName: {}, artistId: {}, genre: {}", title, artistName, artistId, genre);
            return ResponseEntity.ok(trackService.searchTracks(title, artistName, artistId, genre, pageable));
        }

        return ResponseEntity.ok(trackService.getAllTracks(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrackDTO> getTrackById(@PathVariable Long id) {
        log.debug("Fetching track by id: {}", id);
        return ResponseEntity.ok(trackService.getTrackById(id));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<PageResponse<TrackDTO>> getTracksByArtist(
            @PathVariable Long artistId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching tracks by artist: {} - page: {}, size: {}", artistId, page, safeSize);
        return ResponseEntity.ok(trackService.getTracksByArtist(artistId, createPageable(page, safeSize)));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<PageResponse<TrackDTO>> getTracksByGenre(
            @PathVariable String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching tracks by genre: {} - page: {}, size: {}", genre, page, safeSize);
        return ResponseEntity.ok(trackService.getTracksByGenre(genre, createPageable(page, safeSize)));
    }

    @GetMapping("/top")
    public ResponseEntity<PageResponse<TrackDTO>> getTopPlayedTracks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching top played tracks - page: {}, size: {}", page, safeSize);
        return ResponseEntity.ok(trackService.getTopPlayedTracks(createPageable(page, safeSize, "plays")));
    }

    @GetMapping("/latest")
    public ResponseEntity<PageResponse<TrackDTO>> getLatestTracks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching latest tracks - page: {}, size: {}", page, safeSize);
        return ResponseEntity.ok(trackService.getLatestTracks(createPageable(page, safeSize)));
    }

    @PostMapping
    public ResponseEntity<TrackDTO> createTrack(@Valid @RequestBody CreateTrackRequest request) {
        log.info("Creating track: {}", request.getTitle());
        return ResponseEntity.ok(trackService.createTrack(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrackDTO> updateTrack(
            @PathVariable Long id,
            @Valid @RequestBody CreateTrackRequest request) {
        log.info("Updating track id: {}", id);
        return ResponseEntity.ok(trackService.updateTrack(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable Long id) {
        log.info("Deleting track id: {}", id);
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<TrackDTO> incrementPlays(@PathVariable Long id) {
        log.debug("Incrementing plays for track id: {}", id);
        return ResponseEntity.ok(trackService.incrementPlays(id));
    }

    private Pageable createPageable(int page, int size) {
        return PageRequest.of(page, size, Sort.by("createdAt").descending());
    }

    private Pageable createPageable(int page, int size, String sortBy) {
        return PageRequest.of(page, size, Sort.by(sortBy).descending());
    }
}
