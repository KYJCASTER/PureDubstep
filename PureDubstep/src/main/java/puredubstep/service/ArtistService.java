package puredubstep.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import puredubstep.dto.ArtistDTO;
import puredubstep.dto.PageResponse;
import puredubstep.entity.Artist;
import puredubstep.exception.ResourceNotFoundException;
import puredubstep.repository.ArtistRepository;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;

    public PageResponse<ArtistDTO> getAllArtists(Pageable pageable) {
        Page<Artist> artists = artistRepository.findAll(pageable);
        return mapToPageResponse(artists);
    }

    public PageResponse<ArtistDTO> searchArtists(String name, Pageable pageable) {
        Page<Artist> artists = artistRepository.searchArtists(name, pageable);
        return mapToPageResponse(artists);
    }

    public ArtistDTO getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));
        return mapToDTO(artist);
    }

    public PageResponse<ArtistDTO> getLatestArtists(Pageable pageable) {
        Page<Artist> artists = artistRepository.findAll(pageable);
        return mapToPageResponse(artists);
    }

    private ArtistDTO mapToDTO(Artist artist) {
        return ArtistDTO.builder()
                .id(artist.getId())
                .name(artist.getName())
                .bio(artist.getBio())
                .imageUrl(artist.getImageUrl())
                .country(artist.getCountry())
                .createdAt(artist.getCreatedAt())
                .trackCount(artist.getTracks() != null ? artist.getTracks().size() : 0)
                .build();
    }

    private PageResponse<ArtistDTO> mapToPageResponse(Page<Artist> page) {
        Page<ArtistDTO> dtoPage = page.map(this::mapToDTO);
        return PageResponse.<ArtistDTO>builder()
                .content(dtoPage.getContent())
                .page(dtoPage.getNumber())
                .size(dtoPage.getSize())
                .totalElements(dtoPage.getTotalElements())
                .totalPages(dtoPage.getTotalPages())
                .last(dtoPage.isLast())
                .build();
    }
}
