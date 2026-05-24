import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    MessageSquare,
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
    Bell
} from 'lucide-react';
import { useAuth, useUser } from '../hooks/useAuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/agent', icon: MessageSquare, label: 'AI Agent', badge: 'New' },
    { path: '/dashboard/documents', icon: FileText, label: 'Documents', end: false },
    { path: '/dashboard/upload', icon: Upload, label: 'Upload', end: false },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings', end: false },
];

// Page title mapping
const pageTitles = {
    '/dashboard': 'Dashboard',
    '/agent': 'AI Agent',
    '/dashboard/documents': 'Documents',
    '/dashboard/upload': 'Upload',
    '/dashboard/settings': 'Settings',
};

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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

    const userName = user?.fullName || user?.username || 'User';
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email || 'user@opsmind.ai';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const currentPath = location.pathname;

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

            {/* ─── Sidebar ─── */}
            <motion.aside
                animate={{ width: collapsed ? 68 : 256 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={`fixed lg:sticky z-50 top-0 h-screen flex flex-col
                    bg-[#080c14]/95 backdrop-blur-xl
                    border-r border-white/[0.05]
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    transition-transform duration-300 lg:transition-none`}
                style={{ minWidth: collapsed ? 68 : 256 }}
            >
                {/* ─── Logo ─── */}
                <div className="flex items-center gap-3 px-4 h-[60px] border-b border-white/[0.05] shrink-0">
                    <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0">
                        <Sparkles className="w-[18px] h-[18px] text-white" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="text-white font-semibold text-[15px] tracking-[-0.02em] leading-tight">OpsMind</span>
                            <span className="text-violet-400/80 text-[11px] font-medium leading-tight">AI Platform</span>
                        </motion.div>
                    )}
                </div>

                {/* ─── Navigation ─── */}
                <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto scrollbar-thin">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-2.5 px-2.5 py-[9px] rounded-[10px] transition-all duration-200 relative
                                ${isActive
                                    ? 'bg-violet-500/[0.12] text-white shadow-sm shadow-violet-500/10'
                                    : 'text-gray-400/90 hover:text-white/90 hover:bg-white/[0.04]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] rounded-full bg-violet-400"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200
                                        ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400/70'}`}
                                    />
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium text-[13px] tracking-[-0.01em] flex-1"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {!collapsed && item.badge && (
                                        <span className="px-[6px] py-[2px] text-[10px] font-semibold rounded-[6px] bg-violet-500/20 text-violet-400 border border-violet-500/25 leading-none">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* ─── System Status ─── */}
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-2.5 pb-2 shrink-0"
                    >
                        <div className="px-3 py-2.5 rounded-[10px] bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
                                    <div className="absolute inset-0 w-[6px] h-[6px] rounded-full bg-emerald-400 animate-ping opacity-40" />
                                </div>
                                <span className="text-[11px] font-medium text-emerald-400/90">All systems operational</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── User Profile ─── */}
                <div className="border-t border-white/[0.05] p-2.5 shrink-0">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-[10px] hover:bg-white/[0.04] transition-colors duration-200 cursor-default">
                        <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-[12px] shadow-md shadow-violet-500/20 shrink-0">
                            {userInitials}
                        </div>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-[13px] font-medium text-white/90 truncate leading-tight">{userName}</p>
                                <p className="text-[11px] text-gray-500 truncate leading-tight">{userEmail}</p>
                            </motion.div>
                        )}
                    </div>
                    {!collapsed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-2 py-[7px] mt-0.5 rounded-[10px] text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 w-full"
                        >
                            <LogOut className="w-[15px] h-[15px]" />
                            <span className="text-[12px] font-medium">Sign Out</span>
                        </motion.button>
                    )}
                </div>

                {/* ─── Collapse toggle ─── */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-[12px] top-[72px] w-[24px] h-[24px] rounded-full
                        bg-[#080c14] border border-white/[0.08]
                        items-center justify-center text-gray-500 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/10
                        transition-all duration-200 z-10 shadow-sm"
                >
                    {collapsed ? <ChevronRight className="w-[12px] h-[12px]" /> : <ChevronLeft className="w-[12px] h-[12px]" />}
                </button>
            </motion.aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
                {/* ─── Top Header Bar ─── */}
                <header className="sticky top-0 z-30 bg-[#06080d]/80 backdrop-blur-xl border-b border-white/[0.05] shrink-0">
                    <div className="flex items-center justify-between h-[56px] px-4 lg:px-6">
                        {/* Left: Mobile menu + Page title */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden w-9 h-9 rounded-[8px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu className="w-[18px] h-[18px]" />
                            </button>
                            <div className="hidden lg:flex items-center gap-2">
                                <h2 className="text-[15px] font-semibold text-white/90 tracking-[-0.01em]">
                                    {pageTitles[currentPath] || 'Dashboard'}
                                </h2>
                            </div>
                            {/* Mobile logo */}
                            <div className="lg:hidden flex items-center gap-2">
                                <Sparkles className="w-[18px] h-[18px] text-violet-400" />
                                <span className="font-semibold text-white text-[14px]">OpsMind</span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-[8px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all duration-200">
                                <Search className="w-[16px] h-[16px]" />
                            </button>
                            <button className="w-9 h-9 rounded-[8px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all duration-200 relative">
                                <Bell className="w-[16px] h-[16px]" />
                                <div className="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full bg-violet-500 border border-[#06080d]" />
                            </button>
                            <div className="hidden lg:block w-8 h-8 rounded-[8px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-[11px] shadow-md shadow-violet-500/20 ml-1">
                                {userInitials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Page Content ─── */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 lg:p-6 xl:p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}