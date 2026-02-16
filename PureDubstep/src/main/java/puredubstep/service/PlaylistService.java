package puredubstep.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import puredubstep.dto.*;
import puredubstep.entity.Playlist;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.exception.BadRequestException;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.PlaylistRepository;
import puredubstep.repository.TrackRepository;
import puredubstep.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public PageResponse<PlaylistDTO> getUserPlaylists(Pageable pageable) {
        User user = userService.getCurrentUserEntity();
        Page<Playlist> playlists = playlistRepository.findByUser(user, pageable);
        return mapToPageResponse(playlists);
    }

    public PageResponse<PlaylistDTO> getPublicPlaylists(Pageable pageable) {
        Page<Playlist> playlists = playlistRepository.findByIsPublicTrue(pageable);
        return mapToPageResponse(playlists);
    }

    public PlaylistDTO getPlaylistById(Long id) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + id));

        // Check if playlist is public or owned by current user
        if (!playlist.getIsPublic()) {
            User currentUser = userService.getCurrentUserEntity();
            if (!playlist.getUser().getId().equals(currentUser.getId())) {
                throw new ResourceNotFoundException("Playlist not found with id: " + id);
            }
        }

        return mapToDTO(playlist);
    }

    @Transactional
    public PlaylistDTO createPlaylist(CreatePlaylistRequest request) {
        User user = userService.getCurrentUserEntity();

        Playlist playlist = Playlist.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .coverUrl(request.getCoverUrl())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .build();

        playlist = playlistRepository.save(playlist);
        return mapToDTO(playlist);
    }

    @Transactional
    public PlaylistDTO updatePlaylist(Long id, CreatePlaylistRequest request) {
        User user = userService.getCurrentUserEntity();
        Playlist playlist = playlistRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + id));

        if (request.getName() != null) playlist.setName(request.getName());
        if (request.getDescription() != null) playlist.setDescription(request.getDescription());
        if (request.getCoverUrl() != null) playlist.setCoverUrl(request.getCoverUrl());
        if (request.getIsPublic() != null) playlist.setIsPublic(request.getIsPublic());

        playlist = playlistRepository.save(playlist);
        return mapToDTO(playlist);
    }

    @Transactional
    public void deletePlaylist(Long id) {
        User user = userService.getCurrentUserEntity();
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + id));

        // Allow deletion if user is owner or admin
        if (!user.getId().equals(playlist.getUser().getId()) && !userService.isAdmin()) {
            throw new ResourceNotFoundException("Playlist not found with id: " + id);
        }

        playlistRepository.delete(playlist);
    }

    @Transactional
    public PlaylistDTO addTrackToPlaylist(Long playlistId, Long trackId) {
        User user = userService.getCurrentUserEntity();
        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        if (playlist.getTracks().contains(track)) {
            throw new BadRequestException("Track is already in playlist");
        }

        playlist.getTracks().add(track);
        playlist = playlistRepository.save(playlist);
        return mapToDTO(playlist);
    }

    @Transactional
    public PlaylistDTO removeTrackFromPlaylist(Long playlistId, Long trackId) {
        User user = userService.getCurrentUserEntity();
        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));

        playlist.getTracks().remove(track);
        playlist = playlistRepository.save(playlist);
        return mapToDTO(playlist);
    }

    private PlaylistDTO mapToDTO(Playlist playlist) {
        List<TrackDTO> trackDTOs = playlist.getTracks().stream()
                .map(track -> TrackDTO.builder()
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
                        .build())
                .collect(Collectors.toList());

        return PlaylistDTO.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .description(playlist.getDescription())
                .coverUrl(playlist.getCoverUrl())
                .isPublic(playlist.getIsPublic())
                .createdAt(playlist.getCreatedAt())
                .userId(playlist.getUser().getId())
                .username(playlist.getUser().getUsername())
                .trackCount(playlist.getTracks().size())
                .tracks(trackDTOs)
                .build();
    }

    private PageResponse<PlaylistDTO> mapToPageResponse(Page<Playlist> page) {
        Page<PlaylistDTO> dtoPage = page.map(this::mapToDTO);
        return PageResponse.<PlaylistDTO>builder()
                .content(dtoPage.getContent())
                .page(dtoPage.getNumber())
                .size(dtoPage.getSize())
                .totalElements(dtoPage.getTotalElements())
                .totalPages(dtoPage.getTotalPages())
                .last(dtoPage.isLast())
                .build();
    }
}
