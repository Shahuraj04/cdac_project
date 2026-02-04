package com.proj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proj.entity.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :userId1 AND m.recipientId = :userId2) OR " +
           "(m.senderId = :userId2 AND m.recipientId = :userId1) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(
        @Param("userId1") String userId1, 
        @Param("userId2") String userId2
    );
    
    List<ChatMessage> findByRecipientIdAndIsReadFalse(String recipientId);
    
    long countByRecipientIdAndIsReadFalse(String recipientId);
    
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "m.senderId = :userId OR m.recipientId = :userId " +
           "ORDER BY m.timestamp DESC")
    List<ChatMessage> findRecentMessages(@Param("userId") String userId);
    
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE " +
           "m.recipientId = :recipientId AND m.senderId = :senderId AND m.isRead = false")
    void markMessagesAsRead(
        @Param("recipientId") String recipientId, 
        @Param("senderId") String senderId
    );
}
