package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.ArtistDTO;
import puredubstep.dto.PageResponse;
import puredubstep.dto.TrackDTO;
import puredubstep.service.ArtistService;
import puredubstep.service.TrackService;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;
    private final TrackService trackService;

    @GetMapping
    public ResponseEntity<PageResponse<ArtistDTO>> getAllArtists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name) {
        int safeSize = Math.min(size, 50);
        Pageable pageable = PageRequest.of(page, safeSize, Sort.by("name").ascending());

        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(artistService.searchArtists(name, pageable));
        }

        return ResponseEntity.ok(artistService.getAllArtists(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistDTO> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    @GetMapping("/{id}/tracks")
    public ResponseEntity<PageResponse<TrackDTO>> getArtistTracks(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        Pageable pageable = PageRequest.of(page, safeSize, Sort.by("createdAt").descending());
        return ResponseEntity.ok(trackService.getTracksByArtist(id, pageable));
    }
}
