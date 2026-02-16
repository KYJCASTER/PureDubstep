package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import puredubstep.service.FileStorageService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeImage(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadAudio(
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeAudio(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }
}
