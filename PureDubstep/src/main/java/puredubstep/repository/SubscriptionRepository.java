package puredubstep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import puredubstep.entity.Subscription;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByEmail(String email);
    boolean existsByEmail(String email);
}
