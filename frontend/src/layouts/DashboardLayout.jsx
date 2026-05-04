import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import { motion } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  Settings,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react'

const DashboardLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`
          fixed top-0 left-0 z-40
          h-screen w-64
          bg-dark-900/50 backdrop-blur-xl
          border-r border-white/10
          transition-all duration-300
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">OpsMind AI</h1>
              <p className="text-xs text-dark-400">Enterprise</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">User</p>
                <p className="text-xs text-dark-400 truncate">user@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-dark-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="
                    w-96 pl-10 pr-4 py-2
                    bg-dark-800/50 border border-dark-700
                    rounded-xl text-white placeholder-dark-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all
                  "
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
