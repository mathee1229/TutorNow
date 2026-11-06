package com.tutornow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ZoomService {

    private static final Logger logger = LoggerFactory.getLogger(ZoomService.class);

    @Value("${app.zoom.account-id:}")
    private String accountId;

    @Value("${app.zoom.client-id:}")
    private String clientId;

    @Value("${app.zoom.client-secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createMeeting(String topic, String agenda, int durationMinutes) {
        if (accountId == null || accountId.trim().isEmpty() ||
            clientId == null || clientId.trim().isEmpty() ||
            clientSecret == null || clientSecret.trim().isEmpty()) {
            logger.info("Zoom Server-to-Server OAuth credentials not configured in application.yml. Using fallback instant classroom URL.");
            return "https://meet.jit.si/tutornow-" + UUID.randomUUID().toString().substring(0, 8);
        }

        try {
            String accessToken = getAccessToken();
            if (accessToken == null) {
                logger.warn("Could not obtain Zoom access token. Falling back to default meeting URL.");
                return "https://meet.jit.si/tutornow-" + UUID.randomUUID().toString().substring(0, 8);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> meetingRequest = new HashMap<>();
            meetingRequest.put("topic", topic);
            meetingRequest.put("type", 2); // 2 = Scheduled meeting
            meetingRequest.put("duration", durationMinutes > 0 ? durationMinutes : 60);
            meetingRequest.put("timezone", "Asia/Colombo");
            meetingRequest.put("agenda", agenda != null ? agenda : "TutorNow Online Tutoring Session");

            Map<String, Object> settings = new HashMap<>();
            settings.put("host_video", true);
            settings.put("participant_video", true);
            settings.put("join_before_host", true);
            settings.put("mute_upon_entry", false);
            settings.put("waiting_room", false);

            meetingRequest.put("settings", settings);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(meetingRequest, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.zoom.us/v2/users/me/meetings",
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String joinUrl = root.path("join_url").asText(null);
                if (joinUrl != null && !joinUrl.isBlank()) {
                    logger.info("Zoom meeting created successfully: {}", joinUrl);
                    return joinUrl;
                }
            }
        } catch (Exception e) {
            logger.error("Failed to generate Zoom meeting via REST API: {}", e.getMessage());
        }

        return "https://meet.jit.si/tutornow-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String getAccessToken() {
        try {
            String tokenUrl = "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + accountId.trim();

            String auth = clientId.trim() + ":" + clientSecret.trim();
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedAuth);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("access_token").asText(null);
            }
        } catch (Exception e) {
            logger.error("Failed to fetch Zoom OAuth token: {}", e.getMessage());
        }
        return null;
    }
}
