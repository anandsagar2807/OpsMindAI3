import { useState, useEffect } from 'react';
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
    Bell,
    Command,
    Zap,
    Plus,
    Brain
} from 'lucide-react';
import { useAuth, useUser } from '../hooks/useAuthContext';

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
        description: 'SOP & compliance analysis',
        badge: 'New'
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
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`fixed lg:sticky z-50 top-0 h-screen flex flex-col
                    bg-gradient-to-b from-[#080c14] to-[#05070a]
                    border-r border-white/[0.04]
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    transition-transform duration-300 lg:transition-none`}
                style={{ minWidth: collapsed ? 72 : 260 }}
            >
                {/* ─── Logo Section ─── */}
                <div className="flex items-center gap-3 px-4 h-[64px] border-b border-white/[0.04] shrink-0">
                    <motion.div
                        className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-[18px] h-[18px] text-white" />
                    </motion.div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="text-white font-semibold text-[15px] tracking-[-0.02em] leading-tight">
                                OpsMind
                            </span>
                            <span className="text-violet-400/70 text-[11px] font-medium leading-tight">
                                Enterprise AI
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* ─── Premium Navigation ─── */}
                <nav className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto scrollbar-thin">
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
                                    `group flex items-center gap-2.5 px-2.5 py-[10px] rounded-[10px] transition-all duration-200 relative
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
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 shadow-lg shadow-violet-500/30"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200
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
                                                    <span className={`font-medium text-[13px] tracking-[-0.01em] leading-tight
                                                        ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {item.label}
                                                    </span>
                                                    {!isActive && (
                                                        <span className="text-[10px] text-gray-500/60 truncate leading-tight">
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.badge && (
                                                    <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded-[4px] bg-violet-500/20 text-violet-400 border border-violet-500/25 leading-none ml-2">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </motion.div>
                                        )}
                                        {collapsed && item.badge && (
                                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-400 border border-[#080c14]" />
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
                        className="px-2.5 pb-2 shrink-0"
                    >
                        <div className="px-3 py-2.5 rounded-[10px] bg-gradient-to-r from-emerald-500/[0.06] to-transparent border border-emerald-500/[0.12]">
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
                <div className="border-t border-white/[0.04] p-2.5 shrink-0">
                    <div className={`flex items-center gap-2.5 px-2 py-2 rounded-[10px] hover:bg-white/[0.03] transition-colors duration-200 cursor-default
                        ${collapsed ? 'justify-center' : ''}`}>
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
                                <p className="text-[11px] text-gray-500/70 truncate leading-tight">{userEmail}</p>
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
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full
                        bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20
                        items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/15
                        transition-all duration-200 z-10 shadow-lg shadow-black/20"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </motion.aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
                {/* ─── Premium Header ─── */}
                <header className="sticky top-0 z-30 bg-[#06080d]/70 backdrop-blur-2xl border-b border-white/[0.04] shrink-0">
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
                                <div className="w-7 h-7 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                                    {(() => {
                                        const Icon = navItems.find(item => currentPath === item.path)?.icon || LayoutDashboard;
                                        return <Icon className="w-[15px] h-[15px] text-violet-400" />;
                                    })()}
                                </div>
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
                            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                <Command className="w-3 h-3 text-gray-500" />
                                <span className="text-[10px] text-gray-500">B</span>
                                <span className="text-[10px] text-gray-400">Toggle sidebar</span>
                            </div>
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
                <div className="flex-1 overflow-auto bg-[#06080d]">
                    <div className="p-4 lg:p-6 xl:p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}