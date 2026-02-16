package puredubstep.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import puredubstep.dto.PageResponse;
import puredubstep.dto.PlayHistoryDTO;
import puredubstep.entity.PlayHistory;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.PlayHistoryRepository;
import puredubstep.repository.TrackRepository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlayHistoryService {

    private final PlayHistoryRepository playHistoryRepository;
    private final TrackRepository trackRepository;
    private final UserService userService;

    @Transactional
    public PlayHistoryDTO addPlayHistory(Long trackId) {
        User user = userService.getCurrentUserEntity();
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        PlayHistory playHistory = PlayHistory.builder()
                .user(user)
                .track(track)
                .build();

        playHistory = playHistoryRepository.save(playHistory);
        log.info("Added play history for user {} and track {}", user.getUsername(), track.getTitle());
        return mapToDTO(playHistory);
    }

    public PageResponse<PlayHistoryDTO> getUserPlayHistory(Pageable pageable) {
        User user = userService.getCurrentUserEntity();
        Page<PlayHistory> history = playHistoryRepository.findByUserOrderByPlayedAtDesc(user, pageable);
        return mapToPageResponse(history);
    }

    public List<PlayHistoryDTO> getRecentPlays(int limit) {
        User user = userService.getCurrentUserEntity();
        List<PlayHistory> history = playHistoryRepository.findByUserOrderByPlayedAtDesc(user);
        return history.stream()
                .limit(limit)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearPlayHistory() {
        User user = userService.getCurrentUserEntity();
        playHistoryRepository.deleteByUser(user);
        log.info("Cleared play history for user {}", user.getUsername());
    }

    private PlayHistoryDTO mapToDTO(PlayHistory playHistory) {
        Track track = playHistory.getTrack();
        return PlayHistoryDTO.builder()
                .id(playHistory.getId())
                .userId(playHistory.getUser().getId())
                .username(playHistory.getUser().getUsername())
                .trackId(track.getId())
                .trackTitle(track.getTitle())
                .artistName(track.getArtist().getName())
                .artistImageUrl(track.getArtist().getImageUrl())
                .coverUrl(track.getCoverUrl())
                .audioUrl(track.getAudioUrl())
                .duration(track.getDuration())
                .playedAt(playHistory.getPlayedAt())
                .build();
    }

    private PageResponse<PlayHistoryDTO> mapToPageResponse(Page<PlayHistory> page) {
        Page<PlayHistoryDTO> dtoPage = page.map(this::mapToDTO);
        return PageResponse.<PlayHistoryDTO>builder()
                .content(dtoPage.getContent())
                .page(dtoPage.getNumber())
                .size(dtoPage.getSize())
                .totalElements(dtoPage.getTotalElements())
                .totalPages(dtoPage.getTotalPages())
                .last(dtoPage.isLast())
                .build();
    }
}
