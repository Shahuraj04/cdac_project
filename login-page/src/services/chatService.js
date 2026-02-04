import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class ChatService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.onMessageReceived = null;
        this.onTypingReceived = null;
        this.userId = null;
    }

    connect(userId, onMessageReceived, onTypingReceived, onError, onConnect) {
        this.onMessageReceived = onMessageReceived;
        this.onTypingReceived = onTypingReceived;
        this.userId = userId;

        if (this.stompClient && this.isConnected) {
            if (onConnect) onConnect();
            return;
        }

        // Pass userId as query param for UserHandshakeHandler
        const socket = new SockJS(`http://localhost:8080/ws?userId=${userId}`);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                // console.log(str);
            },
            reconnectDelay: 2000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.stompClient.onConnect = (frame) => {
            this.isConnected = true;
            console.log('STOMP Connected: ' + userId);

            // Subscribe to private message queue
            // Note: Standard user destination subscription is /user/queue/messages
            this.stompClient.subscribe(`/user/queue/messages`, (message) => {
                if (this.onMessageReceived) {
                    this.onMessageReceived(JSON.parse(message.body));
                }
            });

            // Subscribe to private typing indicator queue
            this.stompClient.subscribe(`/user/queue/typing`, (message) => {
                if (this.onTypingReceived) {
                    this.onTypingReceived(JSON.parse(message.body));
                }
            });

            if (onConnect) onConnect();
        };

        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error', frame);
            if (onError) onError(frame.headers['message']);
        };

        this.stompClient.onWebSocketClose = () => {
            this.isConnected = false;
            console.log('WebSocket closed for user: ' + userId);
        };

        this.stompClient.activate();
    }

    sendMessage(messageDTO) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(messageDTO),
            });
        }
    }

    sendTypingIndicator(senderId, recipientId, isTyping) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.publish({
                destination: '/app/chat.typing',
                body: JSON.stringify({ senderId, recipientId, isTyping }),
            });
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.isConnected = false;
        }
    }

    isServiceConnected() {
        return this.isConnected;
    }

    updateCallbacks(onMessageReceived, onTypingReceived) {
        this.onMessageReceived = onMessageReceived;
        this.onTypingReceived = onTypingReceived;
    }
}

const chatInstance = new ChatService();
export default chatInstance;
