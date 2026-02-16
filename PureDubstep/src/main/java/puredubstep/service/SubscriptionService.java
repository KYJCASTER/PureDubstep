package puredubstep.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import puredubstep.entity.Subscription;
import puredubstep.repository.SubscriptionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public Subscription subscribe(String email) {
        if (subscriptionRepository.existsByEmail(email)) {
            Subscription existing = subscriptionRepository.findByEmail(email).get();
            existing.setIsActive(true);
            return subscriptionRepository.save(existing);
        }

        Subscription subscription = Subscription.builder()
                .email(email)
                .isActive(true)
                .build();
        return subscriptionRepository.save(subscription);
    }

    public void unsubscribe(String email) {
        subscriptionRepository.findByEmail(email).ifPresent(subscription -> {
            subscription.setIsActive(false);
            subscriptionRepository.save(subscription);
        });
    }

    public List<Subscription> getAllActiveSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .filter(Subscription::getIsActive)
                .toList();
    }
}
