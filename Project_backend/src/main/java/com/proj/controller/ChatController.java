package com.proj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.proj.dto.ChatMessageDTO;
import com.proj.dto.TypingIndicatorDTO;
import com.proj.service.ChatService;

@Controller
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO messageDTO, 
                           SimpMessageHeaderAccessor headerAccessor) {
        // Save and send to recipient
        chatService.saveAndSendMessage(messageDTO);
        
        // Also send confirmation back to sender (optional, but good for sync)
        // messagingTemplate.convertAndSendToUser(messageDTO.getSenderId(), "/queue/messages", response);
    }
    
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicatorDTO typingDTO) {
        messagingTemplate.convertAndSendToUser(
            typingDTO.getRecipientId(), 
            "/queue/typing", 
            typingDTO
        );
    }
    
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageDTO messageDTO,
                        SimpMessageHeaderAccessor headerAccessor) {
        // Add username to WebSocket session
        headerAccessor.getSessionAttributes().put("username", messageDTO.getSenderId());
        
        // Broadcast join if needed
        messagingTemplate.convertAndSend("/topic/public", messageDTO);
    }
}
