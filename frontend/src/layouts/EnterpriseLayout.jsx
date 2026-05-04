import { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  Shield,
  Users
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseLayout({ children, activeTab = 'chat' }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  const navigation = [
    { name: 'Chat', icon: MessageSquare, path: '/dashboard/chat', key: 'chat' },
    { name: 'Documents', icon: FileText, path: '/dashboard/documents', key: 'documents' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings', key: 'settings' },
  ];

  if (isAdmin) {
    navigation.splice(2, 0, {
      name: 'Admin Panel',
      icon: Shield,
      path: '/dashboard/admin',
      key: 'admin'
    });
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      <aside
        className={`glass border-r border-white/20 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold text-gradient">OpsMind AI</h1>
                <p className="text-xs text-gray-600">Enterprise Edition</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-700 hover:bg-white/50 hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img
              src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
              alt={user?.fullName || 'User'}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-md"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors border border-gray-200"
        >
          <svg
            className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
