import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import AgentSidebar from '../components/agent/AgentSidebar';
import UploadPanel from '../components/agent/UploadPanel';
import ChatPanel from '../components/agent/ChatPanel';
import RetrievalActivityPanel from '../components/agent/RetrievalActivityPanel';
import SourceInspector from '../components/agent/SourceInspector';
import useUIStore from '../store/uiStore';
import useChatStore from '../store/chatStore';
import { 
    MessageSquare, 
    Upload, 
    FileText, 
    Zap,
    X,
    Command,
    Plus
} from 'lucide-react';

const AgentPage = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { sidebarCollapsed, isMobile } = useUIStore();
    const { isStreaming } = useChatStore();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            useUIStore.getState().setIsMobile(mobile);
            if (mobile) {
                useUIStore.getState().setSidebarCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: MessageSquare },
        { path: '/agent', label: 'AI Agent', icon: Zap },
        { path: '/dashboard/documents', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="h-screen flex flex-col bg-[#06080d] overflow-hidden">
            {/* Premium Top Bar */}
            <header className="flex items-center justify-between h-[56px] px-4 border-b border-white/[0.04] bg-[#080c14]/70 backdrop-blur-2xl shrink-0">
                <div className="flex items-center gap-4">
                    {/* Navigation Context */}
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-[13px] font-semibold text-white">OpsMind AI</span>
                        </div>
                        
                        {/* Quick nav */}
                        <nav className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] transition-all duration-200
                                        ${location.pathname === item.path 
                                            ? 'bg-violet-500/[0.12] text-white border border-violet-500/[0.20]' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}
                                >
                                    <item.icon className="w-[13px] h-[13px]" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Mobile menu button */}
                    <button
                        onClick={() => useUIStore.getState().toggleSidebar()}
                        className="lg:hidden w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-[16px] h-[16px]" />
                    </button>

                    {/* Status indicator */}
                    {isStreaming && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
                        >
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs text-cyan-400 font-medium">AI Processing</span>
                        </motion.div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <Command className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] text-gray-500">N</span>
                        <span className="text-[10px] text-gray-400">New chat</span>
                    </div>
                    
                    <button
                        onClick={() => useUIStore.getState().toggleUploadPanel()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-white/[0.05] text-gray-400 hover:text-cyan-400 transition-all text-xs font-medium"
                    >
                        <Plus className="w-[14px] h-[14px]" />
                        <span className="hidden sm:inline">New</span>
                    </button>
                    
                    <button
                        onClick={() => useUIStore.getState().toggleUploadPanel()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-white/[0.05] text-gray-400 hover:text-cyan-400 transition-all text-xs font-medium"
                    >
                        <Upload className="w-[14px] h-[14px]" />
                        <span className="hidden sm:inline">Upload</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/dashboard/settings')}
                        className="w-9 h-9 rounded-[8px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all duration-200"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <motion.div
                    initial={false}
                    animate={{ width: sidebarCollapsed ? 56 : 280 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="h-full shrink-0 hidden lg:block"
                >
                    <AgentSidebar />
                </motion.div>

                {/* Center Panel */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Upload Panel (collapsible) */}
                    <UploadPanel />

                    {/* Retrieval Activity Panel (collapsible) */}
                    <RetrievalActivityPanel />

                    {/* Chat Panel (main area) */}
                    <div className="flex-1 overflow-hidden">
                        <ChatPanel />
                    </div>
                </div>
            </div>

            {/* Source Inspector (side sheet overlay) */}
            <SourceInspector />
        </div>
    );
};

export default AgentPage;