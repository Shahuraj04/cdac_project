import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    UserCircleIcon,
    ChatBubbleLeftIcon,
    MagnifyingGlassIcon,
    UserPlusIcon,
    UserIcon,
    UserGroupIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/solid';

const ConversationList = ({ currentUserId, onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadConversations();
        loadSuggestions();
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, [currentUserId]);

    const loadConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/chat/conversations?userId=${currentUserId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setLoading(false);
        }
    };

    const loadSuggestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/chat/suggestions?userId=${currentUserId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error loading suggestions:', error);
        }
    };

    const searchGlobalUsers = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/chat/users?query=${query}&currentUserId=${currentUserId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const existingIds = new Set(conversations.map(c => String(c.userId)));
            setSearchResults(response.data.filter(u => !existingIds.has(String(u.userId))));
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setSearching(false);
        }
    }, [currentUserId, conversations]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) searchGlobalUsers(searchTerm);
            else setSearchResults([]);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchGlobalUsers]);

    const handleSelectConversation = (conversation) => {
        setSelectedId(conversation.userId);
        onSelectConversation(conversation);
    };

    const handleSelectNewUser = (user) => {
        const conversation = {
            userId: user.userId,
            userName: user.userName,
            lastMessage: 'Start a new conversation',
            lastMessageTime: null,
            unreadCount: 0
        };
        handleSelectConversation(conversation);
        setSearchTerm('');
        setSearchResults([]);
    };

    const filteredConversations = conversations.filter(c =>
        c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(c.userId).includes(searchTerm)
    );

    const getIconForRole = (role) => {
        if (role === 'HR') return <ShieldCheckIcon className="w-10 h-10 text-emerald-500 p-2 bg-emerald-50 rounded-full border border-emerald-100" />;
        if (role === 'TEAMMATE') return <UserGroupIcon className="w-10 h-10 text-indigo-500 p-2 bg-indigo-50 rounded-full border border-indigo-100" />;
        return <UserIcon className="w-10 h-10 text-blue-500 p-2 bg-blue-50 rounded-full border border-blue-100" />;
    };

    const filteredSuggestions = suggestions.filter(s => {
        const alreadyInRecents = conversations.some(c => String(c.userId) === String(s.userId));
        return !alreadyInRecents;
    });

    return (
        <div className="h-full bg-white border-r border-slate-200 flex flex-col">
            <div className="px-4 py-4 border-b border-slate-200 bg-slate-50/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-6 h-6 text-indigo-600" />
                        Messages
                    </h2>
                </div>

                <div className="relative">
                    <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${searching ? 'animate-pulse text-indigo-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search people or messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {/* Search Results (Global) */}
                {searchResults.length > 0 && (
                    <div className="bg-indigo-50/30">
                        <div className="px-4 py-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            Global Search Results
                        </div>
                        {searchResults.map((user) => (
                            <button
                                key={user.userId}
                                onClick={() => handleSelectNewUser(user)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white transition-colors text-left"
                            >
                                <div className="flex-shrink-0">
                                    <UserPlusIcon className="w-10 h-10 text-indigo-400 p-2 bg-white rounded-full border border-indigo-100" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {user.userName}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Suggestions Section - Only shown if no search term */}
                {!searchTerm && filteredSuggestions.length > 0 && (
                    <div className="bg-slate-50/30">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Suggested Contacts
                        </div>
                        {filteredSuggestions.map((user) => (
                            <button
                                key={user.userId}
                                onClick={() => handleSelectNewUser(user)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white transition-colors text-left group"
                            >
                                <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {getIconForRole(user.role)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {user.userName}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate">{user.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Recent Conversations */}
                {loading && conversations.length === 0 ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredConversations.length === 0 && searchResults.length === 0 && !searchTerm ? (
                    null
                ) : filteredConversations.length === 0 && searchResults.length === 0 && searchTerm ? (
                    <div className="px-4 py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MagnifyingGlassIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">No results found</p>
                        <p className="text-xs text-slate-400 mt-1">Try searching for a name or email</p>
                    </div>
                ) : (
                    <>
                        {conversations.length > 0 && !searchTerm && (
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Recent Conversations
                            </div>
                        )}
                        {filteredConversations.map((conversation) => (
                            <button
                                key={conversation.userId}
                                onClick={() => handleSelectConversation(conversation)}
                                className={`w-full px-4 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left relative group ${selectedId === conversation.userId ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <UserCircleIcon className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                    {conversation.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`font-semibold text-slate-900 truncate ${conversation.unreadCount > 0 ? 'text-indigo-600' : ''}`}>
                                            {conversation.userName}
                                        </h3>
                                        <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">
                                            {formatTimestamp(conversation.lastMessageTime)}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                        {conversation.lastMessage}
                                    </p>
                                </div>

                                {selectedId === conversation.userId && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                                )}
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default ConversationList;
