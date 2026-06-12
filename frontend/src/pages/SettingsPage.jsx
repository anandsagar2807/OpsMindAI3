import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    User,
    Shield,
    Bell,
    Palette,
    Key,
    Globe,
    Save,
    Loader2,
    CheckCircle2,
    Sparkles,
    ChevronRight,
    Lock,
    RefreshCw
} from 'lucide-react';
import { useAuth, useUser } from '../hooks/useAuthContext';
import toast from 'react-hot-toast';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Key },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const userName = user?.fullName || user?.username || 'User';
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email || 'user@opsmind.ai';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        toast.success('Settings saved successfully');
    };

    return (
        <div className="max-w-[960px] mx-auto space-y-5">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <h1 className="text-[24px] font-bold text-white tracking-[-0.02em] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                        <Settings className="w-5 h-5 text-violet-400" />
                    </div>
                    Settings
                </h1>
                <p className="text-[13px] text-gray-400/70 mt-1.5 ml-[46px]">Manage your account and preferences</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Sidebar tabs */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="lg:col-span-1"
                >
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-1.5 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg w-full text-left transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-violet-500/[0.12] to-transparent text-white border border-violet-500/[0.20]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-400' : 'text-gray-500/70'}`} />
                                <span className="text-[13px] font-medium">{tab.label}</span>
                                <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-opacity duration-200 ${activeTab === tab.id ? 'opacity-100 text-violet-400/60' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Content area */}
                <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="lg:col-span-3"
                >
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                        {activeTab === 'profile' && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-[16px] font-semibold text-white/90 mb-4">Profile Information</h2>
                                    <div className="space-y-4">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[16px] shadow-md shadow-violet-500/20">
                                                {userInitials}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-semibold text-white/90">{userName}</p>
                                                <p className="text-[12px] text-gray-400/70">{userEmail}</p>
                                            </div>
                                        </div>

                                        {/* Name fields */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">First Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={userName.split(' ')[0]}
                                                    className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                        text-white/90 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Last Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={userName.split(' ').slice(1).join(' ') || ''}
                                                    className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                        text-white/90 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Email Address</label>
                                            <input
                                                type="email"
                                                defaultValue={userEmail}
                                                className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                    text-white/90 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-9 px-4 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                        Save Changes
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-5">
                                <h2 className="text-[16px] font-semibold text-white/90 mb-4">Security Settings</h2>
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
                                        <div className="flex items-center gap-2.5">
                                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                                            <div>
                                                <p className="text-[13px] font-medium text-white/90">Two-Factor Authentication</p>
                                                <p className="text-[11px] text-gray-400/70 mt-0.5">Your account is protected with 2FA</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                text-white/90 placeholder-gray-500/50 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                text-white/90 placeholder-gray-500/50 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                text-white/90 placeholder-gray-500/50 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-9 px-4 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                        Update Password
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-5">
                                <h2 className="text-[16px] font-semibold text-white/90 mb-4">Notification Preferences</h2>
                                <div className="space-y-2.5">
                                    {[
                                        { label: 'Document processing completed', desc: 'Get notified when a document finishes processing', enabled: true },
                                        { label: 'Document processing failed', desc: 'Get notified when a document fails to process', enabled: true },
                                        { label: 'New conversation replies', desc: 'Get notified about AI responses in your conversations', enabled: false },
                                        { label: 'Weekly activity summary', desc: 'Receive a weekly digest of your activity', enabled: false },
                                        { label: 'System updates', desc: 'Get notified about platform updates and new features', enabled: true },
                                    ].map((notification, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                            <div>
                                                <p className="text-[13px] font-medium text-white/90">{notification.label}</p>
                                                <p className="text-[11px] text-gray-400/70 mt-0.5">{notification.desc}</p>
                                            </div>
                                            <ToggleSwitch defaultEnabled={notification.enabled} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-5">
                                <h2 className="text-[16px] font-semibold text-white/90 mb-4">Appearance</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-2.5 block uppercase tracking-[0.04em]">Theme</label>
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {[
                                                { label: 'Dark', desc: 'Default theme', active: true, gradient: 'from-[#06080d] to-[#080c14]' },
                                                { label: 'Midnight', desc: 'Deep blue theme', active: false, gradient: 'from-[#0a1628] to-[#0d1f3c]' },
                                                { label: 'Light', desc: 'Clean theme', active: false, gradient: 'from-gray-100 to-gray-50' },
                                            ].map((theme, i) => (
                                                <button
                                                    key={i}
                                                    className={`p-3 rounded-lg border transition-all duration-200 text-left
                                                        ${theme.active
                                                            ? 'bg-violet-500/[0.08] border-violet-500/[0.20]'
                                                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.10]'
                                                        }`}
                                                >
                                                    <div className={`w-full h-6 rounded bg-gradient-to-r ${theme.gradient} mb-2`} />
                                                    <p className="text-[13px] font-medium text-white/90">{theme.label}</p>
                                                    <p className="text-[11px] text-gray-400/70">{theme.desc}</p>
                                                    {theme.active && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-1" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-2.5 block uppercase tracking-[0.04em]">Accent Color</label>
                                        <div className="flex items-center gap-2">
                                            {['violet', 'indigo', 'blue', 'emerald', 'amber', 'rose'].map((color, i) => (
                                                <button
                                                    key={i}
                                                    className={`w-7 h-7 rounded-full bg-${color}-500 ring-2 ${i === 0 ? 'ring-violet-400 ring-offset-2 ring-offset-[#06080d]' : 'ring-transparent'} hover:ring-white/30 hover:ring-offset-2 hover:ring-offset-[#06080d] transition-all duration-200`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-5">
                                <h2 className="text-[16px] font-semibold text-white/90 mb-4">API Keys</h2>
                                <div className="p-3.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.12] mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <Shield className="w-4.5 h-4.5 text-amber-400" />
                                        <div>
                                            <p className="text-[13px] font-medium text-white/90">API keys are sensitive</p>
                                            <p className="text-[11px] text-gray-400/70 mt-0.5">Never share your API keys publicly</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Groq API Key</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="password"
                                                placeholder="gsk_..."
                                                className="flex-1 h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                    text-white/90 placeholder-gray-500/50 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400/70 hover:text-white hover:border-white/[0.10] transition-all duration-200 flex items-center justify-center"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>
                                        <p className="text-[11px] text-gray-500/60 mt-1">Used for AI chat completions</p>
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-medium text-gray-300/70 mb-1.5 block">Gemini API Key</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="password"
                                                placeholder="AIza..."
                                                className="flex-1 h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                                    text-white/90 placeholder-gray-500/50 text-[13px] focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400/70 hover:text-white hover:border-white/[0.10] transition-all duration-200 flex items-center justify-center"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>
                                        <p className="text-[11px] text-gray-500/60 mt-1">Used for text embeddings</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-9 px-4 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                        Save Keys
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ToggleSwitch({ defaultEnabled = false }) {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200
                ${enabled ? 'bg-violet-500' : 'bg-white/[0.06]'}`}
        >
            <motion.div
                animate={{ x: enabled ? 18 : 2 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm"
            />
        </button>
    );
}