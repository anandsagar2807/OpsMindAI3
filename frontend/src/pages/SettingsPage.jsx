import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Palette,
  Globe,
  Shield,
  Key,
  Users,
  Zap,
  Moon,
  Sun,
  Monitor,
  Check,
  Crown,
  Settings as SettingsIcon
} from 'lucide-react'
import { useUser } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { motion } from 'framer-motion'

const SettingsPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false
  })
  const [language, setLanguage] = useState('en')

  const handleProfileSettings = () => {
    window.open('https://accounts.clerk.dev/user', '_blank')
  }

  const handleNotifications = () => {
    toast.success('Notification settings updated!')
  }

  const handleSecurity = () => {
    toast.info('Security settings - Coming soon!')
  }

  const handleBilling = () => {
    navigate('/#pricing')
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme}`)
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    toast.success('Language updated!')
  }

  const themes = [
    { id: 'dark', name: 'Dark', icon: Moon, color: 'from-slate-700 to-slate-900' },
    { id: 'light', name: 'Light', icon: Sun, color: 'from-blue-100 to-purple-100' },
    { id: 'auto', name: 'Auto', icon: Monitor, color: 'from-gray-400 to-gray-600' }
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary-400" />
              Settings
            </h1>
            <p className="text-dark-400">Manage your account and preferences</p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center gap-2">
            <Crown className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">PRO PLAN</span>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card glass className="cursor-pointer hover:scale-105 transition-transform" onClick={handleProfileSettings}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Profile Settings</h3>
                    </div>
                    <p className="text-dark-400 text-sm">Manage your profile through Clerk</p>
                    <p className="text-xs text-primary-400 mt-2">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass className="cursor-pointer hover:scale-105 transition-transform" onClick={handleSecurity}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Security</h3>
                    </div>
                    <p className="text-dark-400 text-sm">Manage security settings</p>
                    <p className="text-xs text-green-400 mt-2">2FA Enabled</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Appearance Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-400" />
            Appearance
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass>
              <h3 className="text-lg font-bold text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === themeOption.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${themeOption.color} mb-3 flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{themeOption.name}</span>
                        {theme === themeOption.id && (
                          <Check className="w-5 h-5 text-primary-400" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-400" />
            Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card glass>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Language</h3>
                </div>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                        language === lang.code
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-white font-medium">{lang.name}</span>
                      </div>
                      {language === lang.code && (
                        <Check className="w-5 h-5 text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card glass>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium text-sm">Email Notifications</p>
                      <p className="text-dark-400 text-xs">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.email ? 'bg-primary-500' : 'bg-dark-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium text-sm">Push Notifications</p>
                      <p className="text-dark-400 text-xs">Browser notifications</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, push: !notifications.push})}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.push ? 'bg-primary-500' : 'bg-dark-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium text-sm">Product Updates</p>
                      <p className="text-dark-400 text-xs">New features & updates</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, updates: !notifications.updates})}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.updates ? 'bg-primary-500' : 'bg-dark-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.updates ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Advanced Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-400" />
            Advanced
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card glass className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">API Keys</h3>
                    </div>
                    <p className="text-dark-400 text-sm">Manage your API keys</p>
                    <p className="text-xs text-yellow-400 mt-2">2 active keys</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card glass className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Team</h3>
                    </div>
                    <p className="text-dark-400 text-sm">Manage team members</p>
                    <p className="text-xs text-pink-400 mt-2">5 members</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Billing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-400" />
            Billing & Subscription
          </h2>
          <Card glass className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/30">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Professional Plan</h3>
                    <p className="text-dark-400 text-sm">$199/month • Renews on June 5, 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-dark-400 mb-1">Storage</p>
                    <p className="text-white font-bold">Unlimited</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-dark-400 mb-1">API Calls</p>
                    <p className="text-white font-bold">10,000/month</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-dark-400 mb-1">Team Members</p>
                    <p className="text-white font-bold">Up to 50</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-dark-400 mb-1">Support</p>
                    <p className="text-white font-bold">Priority</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="primary" onClick={handleBilling}>
                  Upgrade Plan
                </Button>
                <Button variant="secondary" size="sm">
                  Manage Billing
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
