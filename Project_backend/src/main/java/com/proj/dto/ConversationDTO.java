package com.proj.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String userId;
    private String userName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
}
