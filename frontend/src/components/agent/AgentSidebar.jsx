import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEV_MODE } from '../../lib/devAuth';
import { useAuth, useUser } from '../../hooks/useAuthContext';
import { SignOutButton as ClerkSignOutButton } from '@clerk/react';
import {
    MessageSquare, Plus, Search, Trash2, Pencil,
    ChevronLeft, ChevronRight, LogOut, User, FileText,
    Clock, Archive
} from 'lucide-react';
import useChatStore from '../../store/chatStore';
import useUIStore from '../../store/uiStore';
import { useConversations, useDeleteConversation, useUpdateConversationTitle } from '../../hooks/useChat';
import ScrollArea from '../ui/ScrollArea';

const AgentSidebar = () => {
    const { isSignedIn, signOut } = useAuth();
    const { user } = useUser();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();
    const {
        currentConversationId, setCurrentConversationId, setMessages,
        searchQuery, setSearchQuery, clearChat, getFilteredConversations,
    } = useChatStore();

    const { data: conversationsData, isLoading } = useConversations();
    const deleteConversation = useDeleteConversation();
    const updateTitle = useUpdateConversationTitle();

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const conversations = conversationsData?.conversations || conversationsData || [];
    const filteredConversations = getFilteredConversations();

    const handleSelectConversation = (conv) => {
        setCurrentConversationId(conv._id || conv.id);
        setMessages(conv.messages || []);
    };

    const handleNewChat = () => {
        clearChat();
    };

    const handleDeleteConversation = async (id, e) => {
        e.stopPropagation();
        await deleteConversation.mutateAsync(id);
    };

    const handleStartRename = (conv) => {
        setEditingId(conv._id || conv.id);
        setEditTitle(conv.title);
    };

    const handleFinishRename = async () => {
        if (editTitle.trim() && editingId) {
            await updateTitle.mutateAsync({ id: editingId, title: editTitle.trim() });
        }
        setEditingId(null);
        setEditTitle('');
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (sidebarCollapsed) {
        return (
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 56 }}
                className="h-full flex flex-col items-center py-4 bg-[#060a14] border-r border-white/5"
            >
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ChevronRight size={18} />
                </button>
                <button
                    onClick={handleNewChat}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
                    title="New Chat"
                >
                    <Plus size={18} />
                </button>
                <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Search"
                >
                    <Search size={18} />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            className="h-full flex flex-col bg-[#060a14] border-r border-white/5"
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <MessageSquare size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">OpsMind AI</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="px-3 py-3">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 transition-all group"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-sm font-medium">New Conversation</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 focus-within:border-cyan-500/30 transition-colors">
                    <Search size={14} className="text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 px-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                            {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Start a new conversation to begin
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredConversations.map((conv) => {
                            const convId = conv._id || conv.id;
                            const isActive = currentConversationId === convId;
                            const isEditing = editingId === convId;

                            return (
                                <motion.div
                                    key={convId}
                                    layout
                                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isActive
                                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                        }`}
                                    onClick={() => handleSelectConversation(conv)}
                                >
                                    <MessageSquare size={14} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />

                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onBlur={handleFinishRename}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                                            className="flex-1 bg-transparent text-sm text-white outline-none border-b border-cyan-500/50"
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{conv.title || 'Untitled'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(conv.lastMessageAt || conv.createdAt)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStartRename(conv); }}
                                            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteConversation(convId, e)}
                                            className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* User Profile Footer */}
            {isSignedIn && user && (
                <div className="px-3 py-3 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                            {user.imageUrl ? (
                                <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={14} className="text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.fullName || user.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                        {DEV_MODE ? (
                            <button
                                onClick={signOut}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                title="Sign out (dev mode)"
                            >
                                <LogOut size={14} />
                            </button>
                        ) : (
                            <ClerkSignOutButton>
                                <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors" title="Sign out">
                                    <LogOut size={14} />
                                </button>
                            </ClerkSignOutButton>
                        )}
                    </div>
                    {DEV_MODE && (
                        <div className="px-2 pt-1">
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 text-orange-300">
                                DEV MODE
                            </span>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default AgentSidebar;