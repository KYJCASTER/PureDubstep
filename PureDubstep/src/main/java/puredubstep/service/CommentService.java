package puredubstep.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import puredubstep.dto.CommentDTO;
import puredubstep.dto.CreateCommentRequest;
import puredubstep.dto.PageResponse;
import puredubstep.entity.Comment;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.CommentRepository;
import puredubstep.repository.TrackRepository;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TrackRepository trackRepository;
    private final UserService userService;

    @Transactional
    public CommentDTO createComment(CreateCommentRequest request) {
        User user = userService.getCurrentUserEntity();
        Track track = trackRepository.findById(request.getTrackId())
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + request.getTrackId()));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .track(track)
                .build();

        comment = commentRepository.save(comment);
        log.info("User {} commented on track {}", user.getUsername(), track.getTitle());
        return mapToDTO(comment);
    }

    public PageResponse<CommentDTO> getTrackComments(Long trackId, Pageable pageable) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        Page<Comment> comments = commentRepository.findByTrackOrderByCreatedAtDesc(track, pageable);
        return mapToPageResponse(comments);
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, String content) {
        User user = userService.getCurrentUserEntity();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Comment not found with id: " + commentId);
        }

        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        comment = commentRepository.save(comment);
        log.info("User {} updated comment {}", user.getUsername(), commentId);
        return mapToDTO(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        User user = userService.getCurrentUserEntity();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Comment not found with id: " + commentId);
        }

        commentRepository.delete(comment);
        log.info("User {} deleted comment {}", user.getUsername(), commentId);
    }

    private CommentDTO mapToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .userAvatar(comment.getUser().getAvatar())
                .trackId(comment.getTrack().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private PageResponse<CommentDTO> mapToPageResponse(Page<Comment> page) {
        Page<CommentDTO> dtoPage = page.map(this::mapToDTO);
        return PageResponse.<CommentDTO>builder()
                .content(dtoPage.getContent())
                .page(dtoPage.getNumber())
                .size(dtoPage.getSize())
                .totalElements(dtoPage.getTotalElements())
                .totalPages(dtoPage.getTotalPages())
                .last(dtoPage.isLast())
                .build();
    }
}
