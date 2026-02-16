package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.PageResponse;
import puredubstep.dto.PlayHistoryDTO;
import puredubstep.service.PlayHistoryService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class PlayHistoryController {

    private final PlayHistoryService playHistoryService;

    @PostMapping("/{trackId}")
    public ResponseEntity<PlayHistoryDTO> addPlayHistory(@PathVariable Long trackId) {
        log.info("Recording play history for track id: {}", trackId);
        return ResponseEntity.ok(playHistoryService.addPlayHistory(trackId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PlayHistoryDTO>> getPlayHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching play history - page: {}, size: {}", page, safeSize);
        Pageable pageable = PageRequest.of(page, safeSize);
        return ResponseEntity.ok(playHistoryService.getUserPlayHistory(pageable));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PlayHistoryDTO>> getRecentPlays(
            @RequestParam(defaultValue = "10") int limit) {
        int safeLimit = Math.min(limit, 50);
        log.debug("Fetching recent {} plays", safeLimit);
        return ResponseEntity.ok(playHistoryService.getRecentPlays(safeLimit));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearPlayHistory() {
        log.info("Clearing play history");
        playHistoryService.clearPlayHistory();
        return ResponseEntity.noContent().build();
    }
}
