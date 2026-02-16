package puredubstep.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import puredubstep.exception.BadRequestException;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("jpg", "jpeg", "png", "gif");
    private static final Set<String> ALLOWED_AUDIO_TYPES = Set.of("mp3", "wav", "ogg");
    private static final long MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
            log.info("Upload directory created: {}", this.uploadPath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file, String subDirectory) {
        validateFile(file, subDirectory);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        String filename = UUID.randomUUID().toString() + extension;

        Path targetDirectory = this.uploadPath.resolve(subDirectory);
        try {
            Files.createDirectories(targetDirectory);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create subdirectory: " + subDirectory, ex);
        }

        try {
            Path targetLocation = targetDirectory.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("File stored: {}", targetLocation);
            return "/uploads/" + subDirectory + "/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file", ex);
        }
    }

    private void validateFile(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty or null");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BadRequestException("Invalid file format");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

        if ("images".equals(subDirectory)) {
            if (!ALLOWED_IMAGE_TYPES.contains(extension)) {
                throw new BadRequestException("Invalid image type. Allowed types: " + ALLOWED_IMAGE_TYPES);
            }
            if (file.getSize() > MAX_IMAGE_SIZE) {
                throw new BadRequestException("Image size exceeds maximum allowed size of 2MB");
            }
        } else if ("audio".equals(subDirectory)) {
            if (!ALLOWED_AUDIO_TYPES.contains(extension)) {
                throw new BadRequestException("Invalid audio type. Allowed types: " + ALLOWED_AUDIO_TYPES);
            }
            if (file.getSize() > MAX_AUDIO_SIZE) {
                throw new BadRequestException("Audio size exceeds maximum allowed size of 50MB");
            }
        }
    }

    public String storeImage(MultipartFile file) {
        return storeFile(file, "images");
    }

    public String storeAudio(MultipartFile file) {
        return storeFile(file, "audio");
    }

    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }
        try {
            Path path = this.uploadPath.resolve(filePath.substring(1));
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            log.error("Could not delete file: {}", filePath, ex);
        }
    }
}
