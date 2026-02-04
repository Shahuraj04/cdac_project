package com.proj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicatorDTO {
    private String senderId;
    private String recipientId;
    private boolean isTyping;
}
