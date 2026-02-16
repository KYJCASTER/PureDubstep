package puredubstep.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.dto.CommentDTO;
import puredubstep.dto.CreateCommentRequest;
import puredubstep.dto.PageResponse;
import puredubstep.dto.UpdateCommentRequest;
import puredubstep.service.CommentService;

@Slf4j
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@Valid @RequestBody CreateCommentRequest request) {
        log.info("Creating comment for track id: {}", request.getTrackId());
        return ResponseEntity.ok(commentService.createComment(request));
    }

    @GetMapping("/track/{trackId}")
    public ResponseEntity<PageResponse<CommentDTO>> getTrackComments(
            @PathVariable Long trackId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safeSize = Math.min(size, 50);
        log.info("Fetching comments for track id: {} - page: {}, size: {}", trackId, page, safeSize);
        Pageable pageable = PageRequest.of(page, safeSize);
        return ResponseEntity.ok(commentService.getTrackComments(trackId, pageable));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request) {
        log.info("Updating comment id: {}", commentId);
        return ResponseEntity.ok(commentService.updateComment(commentId, request.getContent()));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        log.info("Deleting comment id: {}", commentId);
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
