import { useState, useEffect, useCallback, useRef } from 'react';
import chatService from '../services/chatService';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/chat';

export const useChat = (currentUserId, recipientId) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const typingTimeoutRef = useRef(null);

    const loadHistory = useCallback(async () => {
        if (!recipientId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/history/${recipientId}`, {
                params: { currentUserId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading history:', err);
            setError('Failed to load chat history');
            setLoading(false);
        }
    }, [currentUserId, recipientId]);

    const onMessageReceived = useCallback((message) => {
        // Only add if it belongs to current conversation
        const msgSenderId = String(message.senderId);
        const msgRecipientId = String(message.recipientId);
        const activeRecipientId = String(recipientId);

        if (msgSenderId === activeRecipientId || msgRecipientId === activeRecipientId) {
            setMessages((prev) => [...prev, message]);
        }
    }, [recipientId]);

    const onTypingReceived = useCallback((status) => {
        if (String(status.senderId) === String(recipientId)) {
            setIsTyping(status.isTyping);
        }
    }, [recipientId]);

    useEffect(() => {
        if (!currentUserId) return;

        chatService.connect(
            currentUserId,
            onMessageReceived,
            onTypingReceived,
            (err) => {
                setError(err);
                setIsConnected(false);
            },
            () => {
                setIsConnected(true);
                setError(null);
            }
        );

        // Ensure callbacks are updated if the hook is reused without reconnecting
        chatService.updateCallbacks(onMessageReceived, onTypingReceived);

        return () => {
            // We don't necessarily want to disconnect on every unmount if we move between chats
            // but for this specific hook use case, we can.
        };
    }, [currentUserId, onMessageReceived, onTypingReceived]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const sendMessage = useCallback(async (content, messageType = 'CHAT') => {
        if (!content.trim() || !recipientId) return;

        const messageDTO = {
            senderId: currentUserId,
            recipientId: recipientId,
            content: content,
            messageType: messageType,
            timestamp: new Date().toISOString()
        };

        // Optimistic update
        setMessages((prev) => [...prev, messageDTO]);

        chatService.sendMessage(messageDTO);
    }, [currentUserId, recipientId]);

    const handleTyping = useCallback(() => {
        if (!recipientId) return;

        chatService.sendTypingIndicator(currentUserId, recipientId, true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            chatService.sendTypingIndicator(currentUserId, recipientId, false);
        }, 3000);
    }, [currentUserId, recipientId]);

    const markAsRead = useCallback(async () => {
        if (!recipientId) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/read/${recipientId}`, null, {
                params: { recipientId: currentUserId },
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    }, [currentUserId, recipientId]);

    return {
        messages,
        isConnected,
        isTyping,
        error,
        loading,
        sendMessage,
        handleTyping,
        markAsRead,
        loadHistory
    };
};
