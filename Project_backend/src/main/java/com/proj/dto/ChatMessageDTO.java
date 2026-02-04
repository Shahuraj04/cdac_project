package com.proj.dto;

import java.time.LocalDateTime;
import com.proj.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;
    private String senderId;
    private String senderName;
    private String recipientId;
    private String recipientName;
    private String content;
    private MessageType messageType;
    private LocalDateTime timestamp;
    private Boolean isRead;
}
