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
import puredubstep.exception.BadRequestException;
import puredubstep.service.PlaylistService;
import puredubstep.service.UserService;

@Slf4j
@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<PageResponse<PlaylistDTO>> getUserPlaylists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching user playlists - page: {}, size: {}", page, safeSize);
        return ResponseEntity.ok(playlistService.getUserPlaylists(createPageable(page, safeSize)));
    }

    @GetMapping("/public")
    public ResponseEntity<PageResponse<PlaylistDTO>> getPublicPlaylists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching public playlists - page: {}, size: {}", page, safeSize);
        return ResponseEntity.ok(playlistService.getPublicPlaylists(createPageable(page, safeSize)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaylistDTO> getPlaylistById(@PathVariable Long id) {
        log.debug("Fetching playlist by id: {}", id);
        return ResponseEntity.ok(playlistService.getPlaylistById(id));
    }

    @PostMapping
    public ResponseEntity<PlaylistDTO> createPlaylist(@Valid @RequestBody CreatePlaylistRequest request) {
        log.info("Creating playlist: {}", request.getName());
        return ResponseEntity.ok(playlistService.createPlaylist(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaylistDTO> updatePlaylist(
            @PathVariable Long id,
            @Valid @RequestBody CreatePlaylistRequest request) {
        log.info("Updating playlist id: {}", id);
        return ResponseEntity.ok(playlistService.updatePlaylist(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Long id) {
        log.info("Deleting playlist id: {}", id);
        playlistService.deletePlaylist(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/tracks/{trackId}")
    public ResponseEntity<PlaylistDTO> addTrackToPlaylist(
            @PathVariable Long id,
            @PathVariable Long trackId) {
        log.info("Adding track {} to playlist {}", trackId, id);
        return ResponseEntity.ok(playlistService.addTrackToPlaylist(id, trackId));
    }

    @DeleteMapping("/{id}/tracks/{trackId}")
    public ResponseEntity<PlaylistDTO> removeTrackFromPlaylist(
            @PathVariable Long id,
            @PathVariable Long trackId) {
        log.info("Removing track {} from playlist {}", trackId, id);
        return ResponseEntity.ok(playlistService.removeTrackFromPlaylist(id, trackId));
    }

    private Pageable createPageable(int page, int size) {
        return PageRequest.of(page, size, Sort.by("createdAt").descending());
    }
}
