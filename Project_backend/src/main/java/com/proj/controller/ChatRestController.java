package com.proj.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.ChatMessageDTO;
import com.proj.dto.ConversationDTO;
import com.proj.dto.UserSummaryDTO;
import com.proj.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ChatRestController {
    
    @Autowired
    private ChatService chatService;
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getConversationHistory(
            @PathVariable String userId,
            @RequestParam String currentUserId) {
        return ResponseEntity.ok(chatService.getConversationHistory(currentUserId, userId));
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getRecentConversations(
            @RequestParam String userId) {
        return ResponseEntity.ok(chatService.getRecentConversations(userId));
    }
    
    @PutMapping("/read/{senderId}")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String senderId,
            @RequestParam String recipientId) {
        chatService.markMessagesAsRead(recipientId, senderId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam String userId) {
        return ResponseEntity.ok(chatService.getUnreadCount(userId));
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam String currentUserId) {
        return ResponseEntity.ok(chatService.searchUsers(query, currentUserId));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserSummaryDTO>> getSuggestions(
            @RequestParam String userId) {
        return ResponseEntity.ok(chatService.getChatSuggestions(userId));
    }
}
