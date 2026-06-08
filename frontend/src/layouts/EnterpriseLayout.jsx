import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Upload,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sparkles,
    Activity,
    BookOpen,
    Menu,
    X,
    Clock,
    Search,
    Bell,
    Command,
    Zap,
    Plus,
    Brain,
    User,
    ChevronDown
} from 'lucide-react';
import { useAuth, useUser } from '../hooks/useAuthContext';
import DraggableChatAgent from '../components/DraggableChatAgent';

const navItems = [
    {
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        end: true,
        description: 'Overview & analytics'
    },
    {
        path: '/dashboard/documents',
        icon: FileText,
        label: 'Documents',
        end: false,
        description: 'Knowledge base'
    },
    {
        path: '/dashboard/upload',
        icon: Upload,
        label: 'Upload',
        end: false,
        description: 'Add documents'
    },
    {
        path: '/dashboard/skills-analysis',
        icon: Brain,
        label: 'Ops Knowledge',
        end: false,
        description: 'SOP & compliance analysis'
    },
    {
        path: '/dashboard/settings',
        icon: Settings,
        label: 'Settings',
        end: false,
        description: 'Configuration'
    },
];

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/dashboard/documents': 'Documents',
    '/dashboard/upload': 'Upload',
    '/dashboard/skills-analysis': 'Operational Knowledge Analysis',
    '/dashboard/settings': 'Settings',
};

export default function EnterpriseLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isSignedIn, signOut } = useAuth();
    const { user } = useUser();

    const handleSignOut = async () => {
        try {
            if (signOut) await signOut();
            navigate('/');
        } catch (e) {
            navigate('/');
        }
    };

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileOpen]);

    const userName = user?.fullName || user?.username || 'User';
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email || 'user@opsmind.ai';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const userImageUrl = user?.imageUrl || user?.profileImageUrl || null;
    const currentPath = location.pathname;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey && e.key === 'b') {
                e.preventDefault();
                setCollapsed(!collapsed);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [collapsed]);

    return (
        <div className="min-h-screen bg-[#06080d] flex">
            {/* ─── Mobile overlay ─── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ─── Premium Sidebar ─── */}
            <motion.aside
                animate={{ width: collapsed ? 80 : 340 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`fixed lg:sticky z-50 top-0 h-screen flex flex-col
        bg-gradient-to-b from-[#080c14] to-[#05070a]
        border-r border-white/[0.04]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 lg:transition-none`}
                style={{ minWidth: collapsed ? 80 : 340 }}
            >
                {/* ─── Logo Section ─── */}
                <div className="flex items-center gap-4 px-5 h-[72px] border-b border-white/[0.04] shrink-0">
                    <motion.div
                        className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-[22px] h-[22px] text-white" />
                    </motion.div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="text-white font-bold text-[18px] tracking-[-0.02em] leading-tight">
                                OpsMind
                            </span>
                            <span className="text-violet-400/70 text-[13px] font-medium leading-tight">
                                Enterprise AI
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* ─── Premium Navigation ─── */}
                <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <NavLink
                                to={item.path}
                                end={item.end}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-3 py-[12px] rounded-[12px] transition-all duration-200 relative
                                    ${isActive
                                        ? 'bg-gradient-to-r from-violet-500/[0.15] to-transparent text-white shadow-md shadow-violet-500/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 shadow-lg shadow-violet-500/30"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                        <item.icon className={`w-[22px] h-[22px] flex-shrink-0 transition-all duration-200
                                            ${isActive
                                                ? 'text-violet-400'
                                                : 'text-gray-500 group-hover:text-violet-400/80'
                                            }`}
                                        />
                                        {!collapsed && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex-1 flex items-center justify-between min-w-0"
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`font-semibold text-[15px] tracking-[-0.01em] leading-tight
                                                        ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {item.label}
                                                    </span>
                                                    {!isActive && (
                                                        <span className="text-[12px] text-gray-500/60 truncate leading-tight mt-0.5">
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.badge && (
                                                    <span className="px-2 py-1 text-[11px] font-bold rounded-[6px] bg-violet-500/20 text-violet-400 border border-violet-500/25 leading-none ml-2">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </motion.div>
                                        )}
                                        {collapsed && item.badge && (
                                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-400 border border-[#080c14]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                {/* ─── System Status ─── */}
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-3 pb-3 shrink-0"
                    >
                        <div className="px-4 py-3 rounded-[12px] bg-gradient-to-r from-emerald-500/[0.06] to-transparent border border-emerald-500/[0.12]">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="w-[8px] h-[8px] rounded-full bg-emerald-400" />
                                    <div className="absolute inset-0 w-[8px] h-[8px] rounded-full bg-emerald-400 animate-ping opacity-40" />
                                </div>
                                <span className="text-[13px] font-medium text-emerald-400/90">All systems operational</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── User Profile ─── */}
                <div className="border-t border-white/[0.04] p-3 shrink-0">
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/[0.03] transition-colors duration-200 cursor-default
                        ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[14px] shadow-md shadow-violet-500/20 shrink-0">
                            {userInitials}
                        </div>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-[15px] font-semibold text-white/90 truncate leading-tight">{userName}</p>
                                <p className="text-[13px] text-gray-500/70 truncate leading-tight">{userEmail}</p>
                            </motion.div>
                        )}
                    </div>
                    {!collapsed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 px-3 py-[9px] mt-1 rounded-[12px] text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 w-full"
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            <span className="text-[14px] font-medium">Sign Out</span>
                        </motion.button>
                    )}
                </div>

                {/* ─── Collapse toggle ─── */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3.5 top-20 w-7 h-7 rounded-full
                        bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20
                        items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/15
                        transition-all duration-200 z-10 shadow-lg shadow-black/20"
                >
                    {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
            </motion.aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
                {/* ─── Premium Header ─── */}
                <header className="sticky top-0 z-30 bg-[#06080d]/70 backdrop-blur-2xl border-b border-white/[0.04] shrink-0">
                    <div className="flex items-center justify-between h-[64px] px-5 lg:px-8">
                        {/* Left: Mobile menu + Page title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu className="w-[20px] h-[20px]" />
                            </button>
                            <div className="hidden lg:flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-[10px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                                    {(() => {
                                        const Icon = navItems.find(item => currentPath === item.path)?.icon || LayoutDashboard;
                                        return <Icon className="w-[18px] h-[18px] text-violet-400" />;
                                    })()}
                                </div>
                                <h2 className="text-[18px] font-semibold text-white/90 tracking-[-0.01em]">
                                    {pageTitles[currentPath] || 'Dashboard'}
                                </h2>
                            </div>
                            {/* Mobile logo */}
                            <div className="lg:hidden flex items-center gap-2.5">
                                <Sparkles className="w-[20px] h-[20px] text-violet-400" />
                                <span className="font-bold text-white text-[16px]">OpsMind</span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2.5">
                            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                <Command className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[12px] text-gray-500">B</span>
                                <span className="text-[12px] text-gray-400">Toggle sidebar</span>
                            </div>
                            <button className="w-10 h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all duration-200">
                                <Search className="w-[18px] h-[18px]" />
                            </button>
                            <button className="w-10 h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all duration-200 relative">
                                <Bell className="w-[18px] h-[18px]" />
                                <div className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-violet-500 border border-[#06080d]" />
                            </button>
                            {/* Profile Icon with Dropdown */}
                            <div className="relative ml-1.5" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="hidden lg:flex items-center gap-2 group focus:outline-none"
                                >
                                    {userImageUrl ? (
                                        <img
                                            src={userImageUrl}
                                            alt={userName}
                                            className="w-10 h-10 rounded-[10px] object-cover ring-2 ring-white/[0.08] hover:ring-violet-500/40 transition-all duration-200 shadow-md shadow-violet-500/10"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[13px] shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-200 ring-2 ring-white/[0.08] group-hover:ring-violet-500/40">
                                            {userInitials}
                                        </div>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-gray-400/70 group-hover:text-white transition-all duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                            className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-xl bg-[#0d1117] border border-white/[0.08] shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="px-5 py-4 border-b border-white/[0.06]">
                                                <div className="flex items-center gap-3.5">
                                                    {userImageUrl ? (
                                                        <img
                                                            src={userImageUrl}
                                                            alt={userName}
                                                            className="w-12 h-12 rounded-[12px] object-cover ring-2 ring-white/[0.08]"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[16px] shadow-md shadow-violet-500/20">
                                                            {userInitials}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[16px] font-semibold text-white/90 truncate leading-tight">{userName}</p>
                                                        <p className="text-[13px] text-gray-400/70 truncate leading-tight">{userEmail}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <button
                                                    onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                                                    className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-gray-300/80 hover:text-white hover:bg-white/[0.04] transition-colors duration-150"
                                                >
                                                    <Settings className="w-[18px] h-[18px] text-gray-500" />
                                                    Settings
                                                </button>
                                                <button
                                                    onClick={() => { setProfileOpen(false); handleSignOut(); }}
                                                    className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-gray-300/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors duration-150"
                                                >
                                                    <LogOut className="w-[18px] h-[18px] text-gray-500" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Page Content ─── */}
                <div className="flex-1 overflow-auto bg-[#06080d]">
                    <div className="p-5 lg:p-8 xl:p-10">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* ─── Relevance AI Chat Agent (draggable, transparent, available on all dashboard pages) ─── */}
            <DraggableChatAgent />
        </div>
    );
}