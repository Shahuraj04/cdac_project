import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const ChatWindow = ({ currentUser, recipient }) => {
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const { messages, isConnected, isTyping, error,loading,sendMessage,handleTyping,markAsRead} = useChat(currentUser.id, recipient.userId || recipient.id);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mark as read when window is visible or messages change
    useEffect(() => {
        if (messages.length > 0) {
            markAsRead();
        }
    }, [messages, markAsRead]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        await sendMessage(messageInput);
        setMessageInput('');
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        handleTyping();
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <UserCircleIcon className="w-12 h-12 text-indigo-600" />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{recipient.userName || recipient.name}</h3>
                        <p className="text-sm text-slate-500">
                            {isTyping ? 'Typing...' : (isConnected ? 'Online' : 'Connecting...')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p>No messages yet</p>
                        <p className="text-sm">Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwnMessage = String(message.senderId) === String(currentUser.id);

                        return (
                            <div
                                key={message.id || index}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                                        }`}
                                >
                                    <p className="text-sm break-words">{message.content}</p>
                                    <p
                                        className={`text-[10px] mt-1 text-right ${isOwnMessage ? 'text-indigo-200' : 'text-slate-400'
                                            }`}
                                    >
                                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200 shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && !isConnected && (
                <div className="px-6 py-2 bg-red-50 border-t border-red-200">
                    <p className="text-xs text-red-600">Connection error. Trying to reconnect...</p>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 px-6 py-4">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={messageInput}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim() || !isConnected}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
