package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.PageResponse;
import puredubstep.dto.TrackDTO;
import puredubstep.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<PageResponse<TrackDTO>> getUserFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int safeSize = Math.min(size, 50);
        Pageable pageable = PageRequest.of(page, safeSize, Sort.by("createdAt").descending());
        return ResponseEntity.ok(favoriteService.getUserFavorites(pageable));
    }

    @PostMapping("/{trackId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long trackId) {
        favoriteService.addFavorite(trackId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{trackId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long trackId) {
        favoriteService.removeFavorite(trackId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{trackId}/check")
    public ResponseEntity<Boolean> checkFavorite(@PathVariable Long trackId) {
        return ResponseEntity.ok(favoriteService.isFavorite(trackId));
    }
}
