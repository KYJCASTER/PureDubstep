package puredubstep.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import puredubstep.entity.Artist;
import puredubstep.entity.Track;
import puredubstep.entity.User;
import puredubstep.repository.ArtistRepository;
import puredubstep.repository.TrackRepository;
import puredubstep.repository.UserRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final TrackRepository trackRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = User.builder()
                    .username("admin")
                    .email("admin@puredubstep.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);

            // Create sample user
            User user = User.builder()
                    .username("user")
                    .email("user@puredubstep.com")
                    .password(passwordEncoder.encode("user123"))
                    .role("USER")
                    .build();
            userRepository.save(user);
        }

        if (artistRepository.count() == 0) {
            // Create sample artists with real Dubstep artist images
            List<Artist> artists = Arrays.asList(
                Artist.builder()
                    .name("Skrillex")
                    .bio("美国电子音乐制作人兼DJ，以其在Dubstep和电子舞曲领域的作品闻名。曾获格莱美奖，代表作《Scary Monsters and Nice Sprites》。")
                    .country("美国")
                    .imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Skrillex_%2816220263030%29.jpg/440px-Skrillex_%2816220263030%29.jpg")
                    .build(),
                Artist.builder()
                    .name("Nero")
                    .bio("英国电子音乐双人组合，由Joe和Dan Stephens兄弟组成。以其独特的Dubstep和电子音乐风格闻名。")
                    .country("英国")
                    .imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Nero_%28band%29_performing_live.jpg/440px-Nero_%28band%29_performing_live.jpg")
                    .build(),
                Artist.builder()
                    .name("Excision")
                    .bio("加拿大DJ兼音乐制作人，以其重低音Dubstep和Bass音乐闻名。拥有多张专辑，是Bass音乐界的传奇人物。")
                    .country("加拿大")
                    .imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Excision_at_Paradox_%282018%29_%28cropped%29.jpg/440px-Excision_at_Paradox_%282018%29_%28cropped%29.jpg")
                    .build(),
                Artist.builder()
                    .name("Zeds Dead")
                    .bio("加拿大电子音乐双人组合，来自多伦多。以其创新的Dubstep和电子音乐作品闻名。")
                    .country("加拿大")
                    .imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Zeds_Dead_at_Electric_Zoo_2013_%28cropped%29.jpg/440px-Zeds_Dead_at_Electric_Zoo_2013_%28cropped%29.jpg")
                    .build(),
                Artist.builder()
                    .name("Datsik")
                    .bio("加拿大DJ兼制作人，专注于Dubstep和电子音乐。是加拿大Bass音乐界的重要人物。")
                    .country("加拿大")
                    .imageUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .build(),
                Artist.builder()
                    .name("Doctor P")
                    .bio("英国Dubstep和电子音乐制作人，以其招牌性的Bass音乐风格闻名。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400")
                    .build(),
                Artist.builder()
                    .name("Flux Pavilion")
                    .bio("英国DJ兼制作人，Dubstep音乐的先驱之一。以其创新的音效和节奏闻名。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=400")
                    .build(),
                Artist.builder()
                    .name("Borgore")
                    .bio("以色列DJ兼制作人，以其独特的Dubstep和Dubstep融合风格闻名。")
                    .country("以色列")
                    .imageUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400")
                    .build(),
                Artist.builder()
                    .name("Skream")
                    .bio("英国Dubstep先驱，是Dubstep音乐的创始人之一。对Dubstep的发展产生了深远影响。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400")
                    .build(),
                Artist.builder()
                    .name("Rusko")
                    .bio("英国DJ兼制作人，Dubstep音乐的重要代表人物。以其高能量的现场表演闻名。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400")
                    .build(),
                Artist.builder()
                    .name("Caspa")
                    .bio("英国Dubstep制作人，是Dubstep音乐的创始人之一。对Dubstep风格的形成有重要贡献。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400")
                    .build(),
                Artist.builder()
                    .name("Subscape")
                    .bio("英国Dubstep制作人，以其黑暗和深沉的Bass音乐风格闻名。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400")
                    .build(),
                // New artists
                Artist.builder()
                    .name("Knife Party")
                    .bio("澳大利亚电子音乐双人组合，由Rob Swire和Gareth McGrillen组成。曾是Pendulum成员，以其Dubstep和EDM融合风格闻名。")
                    .country("澳大利亚")
                    .imageUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400")
                    .build(),
                Artist.builder()
                    .name("守信")
                    .bio("英国电子音乐制作人，以其深刻的Dubstep和氛围音乐闻名。是Dubstep界的重要人物。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400")
                    .build(),
                Artist.builder()
                    .name("Mala")
                    .bio("英国Dubstep制作人，Deep Medi Music创始人。对Dubstep的深沉和实验性方向有重要影响。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .build(),
                Artist.builder()
                    .name("Loefah")
                    .bio("英国Dubstep制作人，DMY UK创始人之一。对Dubstep的发展有重要贡献。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400")
                    .build(),
                Artist.builder()
                    .name("Truth")
                    .bio("英国Dubstep制作人双人组合，以其黑暗和深沉的Bass音乐闻名。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400")
                    .build(),
                Artist.builder()
                    .name("Friction")
                    .bio("英国DJ兼制作人，Dubstep和Drum & Bass音乐的重要代表。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=400")
                    .build(),
                Artist.builder()
                    .name("Alix Perez")
                    .bio("英国制作人，专注于Dubstep和Deep Bass音乐。是Shogun Audio创始人之一。")
                    .country("英国")
                    .imageUrl("https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400")
                    .build()
            );

            artists = artistRepository.saveAll(artists);

            // Create sample tracks
            List<Track> tracks = Arrays.asList(
                Track.builder()
                    .title("Scary Monsters and Nice Sprites")
                    .artist(artists.get(0))
                    .album("Scary Monsters and Nice Sprites")
                    .duration(248)
                    .coverUrl("https://upload.wikimedia.org/wikipedia/en/d/d6/Skrillex_-_Scary_Monsters_and_Nice_Sprites.png")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
                    .genre("Dubstep")
                    .bpm(174)
                    .releaseDate(LocalDate.of(2010, 10, 13))
                    .plays(1500)
                    .build(),
                Track.builder()
                    .title("First of the Year (Equinox)")
                    .artist(artists.get(0))
                    .album("Scary Monsters and Nice Sprites")
                    .duration(259)
                    .coverUrl("https://upload.wikimedia.org/wikipedia/en/d/d6/Skrillex_-_Scary_Monsters_and_Nice_Sprites.png")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2011, 6, 17))
                    .plays(1200)
                    .build(),
                Track.builder()
                    .title("Innertia")
                    .artist(artists.get(1))
                    .album("Welcome Reality")
                    .duration(294)
                    .coverUrl("https://upload.wikimedia.org/wikipedia/en/2/23/Nero_-_Welcome_Reality.png")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2011, 8, 15))
                    .plays(980)
                    .build(),
                Track.builder()
                    .title("Promises")
                    .artist(artists.get(1))
                    .album("Welcome Reality")
                    .duration(261)
                    .coverUrl("https://upload.wikimedia.org/wikipedia/en/2/23/Nero_-_Welcome_Reality.png")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2011, 8, 15))
                    .plays(850)
                    .build(),
                Track.builder()
                    .title("X")
                    .artist(artists.get(2))
                    .album("X")
                    .duration(282)
                    .coverUrl("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3")
                    .genre("Dubstep")
                    .bpm(150)
                    .releaseDate(LocalDate.of(2015, 3, 10))
                    .plays(720)
                    .build(),
                Track.builder()
                    .title("The Hub")
                    .artist(artists.get(2))
                    .album("The Hub")
                    .duration(201)
                    .coverUrl("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3")
                    .genre("Dubstep")
                    .bpm(150)
                    .releaseDate(LocalDate.of(2014, 10, 21))
                    .plays(650)
                    .build(),
                Track.builder()
                    .title("White Girls")
                    .artist(artists.get(3))
                    .album("White Girls")
                    .duration(256)
                    .coverUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2014, 8, 26))
                    .plays(580)
                    .build(),
                Track.builder()
                    .title("Too Close")
                    .artist(artists.get(3))
                    .album("White Girls")
                    .duration(233)
                    .coverUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2014, 8, 26))
                    .plays(520)
                    .build(),
                Track.builder()
                    .title("Firepower")
                    .artist(artists.get(4))
                    .album("Firepower")
                    .duration(253)
                    .coverUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3")
                    .genre("Dubstep")
                    .bpm(150)
                    .releaseDate(LocalDate.of(2013, 10, 22))
                    .plays(480)
                    .build(),
                Track.builder()
                    .title("Sweet Dreams")
                    .artist(artists.get(5))
                    .album("Sweet Dreams")
                    .duration(232)
                    .coverUrl("https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2012, 9, 4))
                    .plays(450)
                    .build(),
                // Additional tracks from new artists
                Track.builder()
                    .title("LRD - Twerk")
                    .artist(artists.get(12))
                    .album("Abandon Ship")
                    .duration(248)
                    .coverUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3")
                    .genre("Dubstep")
                    .bpm(150)
                    .releaseDate(LocalDate.of(2014, 11, 24))
                    .plays(680)
                    .build(),
                Track.builder()
                    .title("Centipede")
                    .artist(artists.get(12))
                    .album("Abandon Ship")
                    .duration(276)
                    .coverUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3")
                    .genre("Dubstep")
                    .bpm(150)
                    .releaseDate(LocalDate.of(2014, 11, 24))
                    .plays(620)
                    .build(),
                Track.builder()
                    .title("Midnight Request")
                    .artist(artists.get(13))
                    .album("Midnight Request")
                    .duration(294)
                    .coverUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2011, 3, 7))
                    .plays(520)
                    .build(),
                Track.builder()
                    .title("Oil")
                    .artist(artists.get(13))
                    .album("Oil")
                    .duration(245)
                    .coverUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2012, 5, 21))
                    .plays(480)
                    .build(),
                Track.builder()
                    .title("西湖")
                    .artist(artists.get(14))
                    .album("西湖")
                    .duration(320)
                    .coverUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2013, 6, 18))
                    .plays(850)
                    .build(),
                Track.builder()
                    .title("Numerical")
                    .artist(artists.get(14))
                    .album("Numerical")
                    .duration(278)
                    .coverUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2014, 9, 30))
                    .plays(420)
                    .build(),
                Track.builder()
                    .title("Horror Show")
                    .artist(artists.get(15))
                    .album("Horror Show")
                    .duration(256)
                    .coverUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2012, 10, 16))
                    .plays(390)
                    .build(),
                Track.builder()
                    .title("The Mountain")
                    .artist(artists.get(15))
                    .album("The Mountain")
                    .duration(312)
                    .coverUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2014, 4, 22))
                    .plays(360)
                    .build(),
                Track.builder()
                    .title("Animals")
                    .artist(artists.get(16))
                    .album("Animals")
                    .duration(298)
                    .coverUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3")
                    .genre("Drum & Bass")
                    .bpm(174)
                    .releaseDate(LocalDate.of(2012, 3, 5))
                    .plays(720)
                    .build(),
                Track.builder()
                    .title("Talk of the Town")
                    .artist(artists.get(16))
                    .album("Talk of the Town")
                    .duration(267)
                    .coverUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
                    .genre("Drum & Bass")
                    .bpm(174)
                    .releaseDate(LocalDate.of(2013, 7, 15))
                    .plays(540)
                    .build(),
                Track.builder()
                    .title("Make Way")
                    .artist(artists.get(17))
                    .album("Make Way")
                    .duration(284)
                    .coverUrl("https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2011, 8, 22))
                    .plays(480)
                    .build(),
                Track.builder()
                    .title("Phantoms")
                    .artist(artists.get(17))
                    .album("Phantoms")
                    .duration(312)
                    .coverUrl("https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=400")
                    .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3")
                    .genre("Dubstep")
                    .bpm(140)
                    .releaseDate(LocalDate.of(2013, 4, 8))
                    .plays(420)
                    .build()
            );

            trackRepository.saveAll(tracks);
        }
    }
}
