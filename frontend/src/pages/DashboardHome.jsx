import { motion } from 'framer-motion'
import { useUser } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  Upload,
  Zap,
  BarChart3,
  Activity,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Target,
  Sparkles,
  Crown
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const DashboardHome = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Document processed successfully',
      message: 'Employee_Handbook_2024.pdf is now searchable',
      time: '5 min ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'info',
      title: 'New feature available',
      message: 'Try our enhanced search with AI suggestions',
      time: '1 hour ago',
      icon: Info,
      color: 'blue'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Storage limit approaching',
      message: 'You\'ve used 80% of your storage quota',
      time: '3 hours ago',
      icon: AlertCircle,
      color: 'yellow'
    }
  ])

  const stats = [
    {
      label: 'Documents',
      value: '24',
      change: '+3 this week',
      changePercent: '+14.3%',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      chartData: [12, 15, 18, 20, 21, 24]
    },
    {
      label: 'Total Queries',
      value: '1,247',
      change: '+89 today',
      changePercent: '+7.7%',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      chartData: [850, 920, 1050, 1100, 1180, 1247]
    },
    {
      label: 'Avg Response Time',
      value: '0.8s',
      change: '-0.2s faster',
      changePercent: '-20%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'down',
      chartData: [1.2, 1.1, 1.0, 0.95, 0.85, 0.8]
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      change: '+2.1% this month',
      changePercent: '+2.1%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      chartData: [94, 95, 96.5, 97, 98, 98.5]
    }
  ]

  const recentActivity = [
    {
      type: 'upload',
      title: 'Employee_Handbook_2024.pdf',
      description: 'Document uploaded and processed',
      time: '2 hours ago',
      icon: Upload,
      user: 'You',
      status: 'completed'
    },
    {
      type: 'query',
      title: 'What is our refund policy?',
      description: 'Query answered successfully',
      time: '5 hours ago',
      icon: MessageSquare,
      user: 'Sarah Johnson',
      status: 'completed'
    },
    {
      type: 'upload',
      title: 'IT_Security_Policy.pdf',
      description: 'Document uploaded and processed',
      time: '1 day ago',
      icon: Upload,
      user: 'Michael Chen',
      status: 'completed'
    },
    {
      type: 'query',
      title: 'How to request leave?',
      description: 'Query answered successfully',
      time: '1 day ago',
      icon: MessageSquare,
      user: 'Emily Rodriguez',
      status: 'completed'
    }
  ]

  const teamActivity = [
    { name: 'Sarah Johnson', queries: 45, avatar: 'SJ', color: 'from-blue-500 to-cyan-500' },
    { name: 'Michael Chen', queries: 38, avatar: 'MC', color: 'from-purple-500 to-pink-500' },
    { name: 'Emily Rodriguez', queries: 32, avatar: 'ER', color: 'from-green-500 to-emerald-500' },
    { name: 'David Kim', queries: 28, avatar: 'DK', color: 'from-yellow-500 to-orange-500' }
  ]

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add new documents to your knowledge base',
      icon: Upload,
      href: '/dashboard/upload',
      color: 'from-primary-500 to-blue-600'
    },
    {
      title: 'Start Chat',
      description: 'Ask questions about your documents',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'View Documents',
      description: 'Manage your uploaded documents',
      icon: FileText,
      href: '/dashboard/documents',
      color: 'from-green-500 to-emerald-600'
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section with Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card glass className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      Welcome back, {user?.firstName || 'User'}! 👋
                    </h1>
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white">PRO</span>
                    </div>
                  </div>
                  <p className="text-dark-300 text-lg">
                    Your AI knowledge assistant is ready to help you find answers instantly.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    icon={Bell}
                    iconPosition="left"
                    className="relative"
                  >
                    Notifications
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      3
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
          <div className="flex gap-2 bg-dark-800/50 p-1 rounded-xl border border-white/10">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover glass className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl" style={{ background: `linear-gradient(to bottom right, ${stat.color})` }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span className="text-xs font-bold">{stat.changePercent}</span>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4">
                    <p className="text-dark-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-dark-500">{stat.change}</p>
                  </div>
                  {/* Mini Chart */}
                  <div className="flex items-end gap-1 h-8">
                    {stat.chartData.map((value, idx) => {
                      const maxValue = Math.max(...stat.chartData)
                      const height = (value / maxValue) * 100
                      return (
                        <div
                          key={idx}
                          className={`flex-1 bg-gradient-to-t ${stat.color} rounded-t opacity-60 hover:opacity-100 transition-opacity`}
                          style={{ height: `${height}%` }}
                        />
                      )
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to={action.href}>
                  <Card hover glass>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-dark-400">{action.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card glass>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-400" />
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>
                <Button variant="secondary" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <activity.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-white font-medium truncate">{activity.title}</p>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex-shrink-0">
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-dark-400 mb-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-dark-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Team Activity - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card glass>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-bold text-white">Top Users</h3>
              </div>
              <div className="space-y-4">
                {teamActivity.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{member.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${member.color} rounded-full`}
                            style={{ width: `${(member.queries / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-400 font-medium">{member.queries}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Total team queries</span>
                  <span className="text-white font-bold">143 this week</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Notifications & Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card glass>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-400" />
                  <h3 className="text-xl font-bold text-white">Notifications</h3>
                </div>
                <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                  Mark all as read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const Icon = notification.icon
                  const colorMap = {
                    green: 'text-green-400 bg-green-500/20',
                    blue: 'text-blue-400 bg-blue-500/20',
                    yellow: 'text-yellow-400 bg-yellow-500/20',
                    red: 'text-red-400 bg-red-500/20'
                  }
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[notification.color]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm mb-0.5">{notification.title}</p>
                        <p className="text-xs text-dark-400 mb-1">{notification.message}</p>
                        <span className="text-xs text-dark-500">{notification.time}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Usage Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card glass>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-bold text-white">Usage Analytics</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">Storage Used</span>
                    <span className="text-sm font-medium text-white">2.4 GB / 10 GB</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full relative" style={{ width: '24%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">API Calls</span>
                    <span className="text-sm font-medium text-white">1,247 / 5,000</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full relative" style={{ width: '25%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">Documents</span>
                    <span className="text-sm font-medium text-white">24 / 100</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full relative" style={{ width: '24%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-xl border border-primary-500/20">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary-400" />
                    <span className="text-sm text-white font-medium">Monthly Goal</span>
                  </div>
                  <span className="text-sm font-bold text-primary-400">78% Complete</span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/#pricing')}
                  icon={Sparkles}
                  iconPosition="left"
                >
                  Upgrade Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardHome
