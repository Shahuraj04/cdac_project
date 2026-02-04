import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
    
import ConversationList from '../../components/ConversationList';
import ChatWindow from '../../components/ChatWindow';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const ChatPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
        } else {
            const user = JSON.parse(userJson);
            setUserData(user);
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!userData) return null;

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar onLogout={handleLogout} userData={userData} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
                    <div className="flex items-center space-x-2">
                        <ChatBubbleLeftIcon className="w-5 h-5 text-indigo-600" />
                        <h1 className="text-lg font-bold text-slate-800">Messages</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{userData.email.split('@')[0]}</p>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{userData.role.replace('ROLE_', '')}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold border-2 border-white">
                                {String(userData.email).charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Conversation List Sidebar */}
                    <div className="w-80 flex-shrink-0 flex flex-col h-full border-r border-slate-200 bg-white">
                        <ConversationList
                            currentUserId={String(userData.id)}
                            onSelectConversation={setSelectedConversation}
                        />
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
                        {selectedConversation ? (
                            <ChatWindow
                                currentUser={{
                                    id: String(userData.id),
                                    name: userData.email.split('@')[0]
                                }}
                                recipient={selectedConversation}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400 bg-white">
                                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ChatBubbleLeftIcon className="w-10 h-10 text-indigo-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Select a conversation</h3>
                                    <p className="max-w-xs mx-auto text-slate-500 text-sm">
                                        Use the search bar on the left to find colleagues and start a real-time conversation.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
