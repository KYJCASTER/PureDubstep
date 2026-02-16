package puredubstep.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import puredubstep.service.SubscriptionService;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "邮箱不能为空"));
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "邮箱格式不正确"));
        }

        subscriptionService.subscribe(email);
        return ResponseEntity.ok(Map.of("message", "订阅成功！感谢您的支持。"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null) {
            subscriptionService.unsubscribe(email);
        }
        return ResponseEntity.ok(Map.of("message", "已取消订阅"));
    }
}
