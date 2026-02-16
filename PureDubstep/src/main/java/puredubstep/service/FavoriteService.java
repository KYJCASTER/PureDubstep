package puredubstep.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import puredubstep.dto.PageResponse;
import puredubstep.dto.TrackDTO;
import puredubstep.entity.Favorite;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.exception.BadRequestException;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.FavoriteRepository;
import puredubstep.repository.TrackRepository;
import puredubstep.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public PageResponse<TrackDTO> getUserFavorites(Pageable pageable) {
        User user = userService.getCurrentUserEntity();
        Page<Favorite> favorites = favoriteRepository.findByUser(user, pageable);
        return mapToPageResponse(favorites);
    }

    @Transactional
    public void addFavorite(Long trackId) {
        User user = userService.getCurrentUserEntity();
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        if (favoriteRepository.existsByUserAndTrack(user, track)) {
            throw new BadRequestException("Track is already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .track(track)
                .build();

        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long trackId) {
        User user = userService.getCurrentUserEntity();
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        if (!favoriteRepository.existsByUserAndTrack(user, track)) {
            throw new BadRequestException("Track is not in favorites");
        }

        favoriteRepository.deleteByUserAndTrack(user, track);
    }

    public boolean isFavorite(Long trackId) {
        User user = userService.getCurrentUserEntity();
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));
        return favoriteRepository.existsByUserAndTrack(user, track);
    }

    private TrackDTO mapToDTO(Favorite favorite) {
        Track track = favorite.getTrack();
        return TrackDTO.builder()
                .id(track.getId())
                .title(track.getTitle())
                .artistId(track.getArtist().getId())
                .artistName(track.getArtist().getName())
                .artistImageUrl(track.getArtist().getImageUrl())
                .album(track.getAlbum())
                .duration(track.getDuration())
                .coverUrl(track.getCoverUrl())
                .audioUrl(track.getAudioUrl())
                .genre(track.getGenre())
                .bpm(track.getBpm())
                .releaseDate(track.getReleaseDate())
                .plays(track.getPlays())
                .createdAt(track.getCreatedAt())
                .isFavorite(true)
                .build();
    }

    private PageResponse<TrackDTO> mapToPageResponse(Page<Favorite> page) {
        Page<TrackDTO> dtoPage = page.map(this::mapToDTO);
        return PageResponse.<TrackDTO>builder()
                .content(dtoPage.getContent())
                .page(dtoPage.getNumber())
                .size(dtoPage.getSize())
                .totalElements(dtoPage.getTotalElements())
                .totalPages(dtoPage.getTotalPages())
                .last(dtoPage.isLast())
                .build();
    }
}
