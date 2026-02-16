package puredubstep.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import puredubstep.dto.*;
import puredubstep.entity.Artist;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.ArtistRepository;
import puredubstep.repository.FavoriteRepository;
import puredubstep.repository.TrackRepository;
import puredubstep.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

    public PageResponse<TrackDTO> getAllTracks(Pageable pageable) {
        Page<Track> tracks = trackRepository.findAll(pageable);
        return mapToPageResponse(tracks);
    }

    public PageResponse<TrackDTO> searchTracks(String title, String artistName, Long artistId, String genre, Pageable pageable) {
        Page<Track> tracks = trackRepository.searchTracks(title, artistName, artistId, genre, pageable);
        return mapToPageResponse(tracks);
    }

    public TrackDTO getTrackById(Long id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + id));
        return mapToDTO(track);
    }

    public PageResponse<TrackDTO> getTracksByArtist(Long artistId, Pageable pageable) {
        Page<Track> tracks = trackRepository.findByArtistId(artistId, pageable);
        return mapToPageResponse(tracks);
    }

    public PageResponse<TrackDTO> getTracksByGenre(String genre, Pageable pageable) {
        Page<Track> tracks = trackRepository.findByGenre(genre, pageable);
        return mapToPageResponse(tracks);
    }

    public PageResponse<TrackDTO> getTopPlayedTracks(Pageable pageable) {
        Page<Track> tracks = trackRepository.findTopPlayed(pageable);
        return mapToPageResponse(tracks);
    }

    public PageResponse<TrackDTO> getLatestTracks(Pageable pageable) {
        Page<Track> tracks = trackRepository.findLatest(pageable);
        return mapToPageResponse(tracks);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public TrackDTO createTrack(CreateTrackRequest request) {
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + request.getArtistId()));

        Track track = Track.builder()
                .title(request.getTitle())
                .artist(artist)
                .album(request.getAlbum())
                .duration(request.getDuration())
                .coverUrl(request.getCoverUrl())
                .audioUrl(request.getAudioUrl())
                .genre(request.getGenre())
                .bpm(request.getBpm())
                .releaseDate(request.getReleaseDate())
                .plays(0)
                .build();

        track = trackRepository.save(track);
        return mapToDTO(track);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public TrackDTO updateTrack(Long id, CreateTrackRequest request) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + id));

        if (request.getArtistId() != null) {
            Artist artist = artistRepository.findById(request.getArtistId())
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + request.getArtistId()));
            track.setArtist(artist);
        }

        if (request.getTitle() != null) track.setTitle(request.getTitle());
        if (request.getAlbum() != null) track.setAlbum(request.getAlbum());
        if (request.getDuration() != null) track.setDuration(request.getDuration());
        if (request.getCoverUrl() != null) track.setCoverUrl(request.getCoverUrl());
        if (request.getAudioUrl() != null) track.setAudioUrl(request.getAudioUrl());
        if (request.getGenre() != null) track.setGenre(request.getGenre());
        if (request.getBpm() != null) track.setBpm(request.getBpm());
        if (request.getReleaseDate() != null) track.setReleaseDate(request.getReleaseDate());

        track = trackRepository.save(track);
        return mapToDTO(track);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTrack(Long id) {
        if (!trackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Track not found with id: " + id);
        }
        trackRepository.deleteById(id);
    }

    @Transactional
    public TrackDTO incrementPlays(Long id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + id));
        track.setPlays(track.getPlays() + 1);
        track = trackRepository.save(track);
        return mapToDTO(track);
    }

    private TrackDTO mapToDTO(Track track) {
        boolean isFavorite = false;
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                User user = userRepository.findByUsername(auth.getName()).orElse(null);
                if (user != null) {
                    isFavorite = favoriteRepository.existsByUserAndTrack(user, track);
                }
            }
        } catch (Exception ignored) {}

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
                .isFavorite(isFavorite)
                .build();
    }

    private PageResponse<TrackDTO> mapToPageResponse(Page<Track> page) {
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
