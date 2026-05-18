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
  Crown,
  XCircle
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import toast from 'react-hot-toast'

const DashboardHome = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const token = await user?.getToken()
      console.log('[DashboardHome] Token available:', !!token)
      console.log('[DashboardHome] Token preview:', token?.substring(0, 20) + '...')
      const response = await dashboardAPI.getStats(token)
      console.log('[DashboardHome] Response:', response.status, response.data)
      setDashboardData(response.data.data)
    } catch (error) {
      console.error('[DashboardHome] Failed to load dashboard data:', error)
      console.error('[DashboardHome] Error response:', error.response?.status, error.response?.data)
      console.error('[DashboardHome] Error message:', error.message)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const data = dashboardData

  // Build dynamic notifications from activity feed
  const notifications = (data?.activityFeed || []).slice(0, 4).map((item, idx) => {
    const typeMap = {
      upload: {
        icon: item.status === 'completed' ? CheckCircle : item.status === 'failed' ? XCircle : AlertCircle,
        color: item.status === 'completed' ? 'green' : item.status === 'failed' ? 'red' : 'yellow'
      },
      chat: {
        icon: MessageSquare,
        color: 'blue'
      }
    }
    const mapped = typeMap[item.type] || typeMap.upload
    return {
      id: idx + 1,
      type: item.status === 'completed' ? 'success' : item.status === 'failed' ? 'error' : 'info',
      title: item.title,
      message: item.description,
      time: new Date(item.time).toLocaleString(),
      icon: mapped.icon,
      color: mapped.color
    }
  })

  // Build recent activity from activity feed
  const recentActivity = (data?.activityFeed || []).map((item) => ({
    type: item.type,
    title: item.title,
    description: item.description,
    time: new Date(item.time).toLocaleString(),
    icon: item.type === 'upload' ? Upload : MessageSquare,
    user: 'You',
    status: item.status || 'active'
  }))

  // Dynamic stats
  const docCount = data?.documents?.total || 0
  const queryCount = data?.chats?.totalQueries || 0
  const storageUsedGB = data?.storage?.usedGB || 0
  const storageLimitGB = data?.storage?.limitGB || 10

  const statsDisplay = [
    {
      label: 'Documents',
      value: loading ? '...' : docCount.toString(),
      change: `${data?.documents?.completed || 0} processed`,
      changePercent: data?.documents?.total ? `${Math.round((data.documents.completed / data.documents.total) * 100)}%` : '0%',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      chartData: [0, 0, 0, 0, 0, docCount]
    },
    {
      label: 'Total Queries',
      value: loading ? '...' : queryCount.toString(),
      change: `${data?.chats?.total || 0} chats`,
      changePercent: queryCount > 0 ? 'Active' : 'New',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      chartData: [0, 0, 0, 0, 0, queryCount]
    },
    {
      label: 'Vector Chunks',
      value: loading ? '...' : (data?.vectors?.total || 0).toString(),
      change: 'Embedded data',
      changePercent: data?.vectors?.total ? 'Indexed' : 'Empty',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up',
      chartData: [0, 0, 0, 0, 0, data?.vectors?.total || 0]
    },
    {
      label: 'Storage Used',
      value: loading ? '...' : `${storageUsedGB.toFixed(1)} GB`,
      change: `of ${storageLimitGB} GB`,
      changePercent: `${Math.round((storageUsedGB / storageLimitGB) * 100)}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      chartData: [0, 0, 0, 0, 0, Math.round((storageUsedGB / storageLimitGB) * 100)]
    }
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card glass className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      Welcome back, {user?.firstName || 'User'}! 👋
                    </h1>
                  </div>
                  <p className="text-slate-300 text-lg">
                    Your AI knowledge assistant is ready to help you find answers instantly.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    icon={Bell}
                    iconPosition="left"
                    className="relative"
                    onClick={() => loadDashboardData()}
                  >
                    Refresh
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-white/10">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsDisplay.map((stat, index) => (
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
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
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
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                  {/* Mini Chart */}
                  <div className="flex items-end gap-1 h-8">
                    {stat.chartData.map((value, idx) => {
                      const maxValue = Math.max(...stat.chartData, 1)
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
                    <p className="text-slate-400">{action.description}</p>
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
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/documents')}>View All</Button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 mt-4">Loading activity...</p>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No recent activity</p>
                    <p className="text-slate-500 text-sm mt-1">Upload documents or start a chat to see activity here</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <activity.icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-white font-medium truncate">{activity.title}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            activity.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{activity.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
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
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Document Status Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card glass>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Document Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {loading ? '...' : (data?.documents?.completed || 0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">Completed</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${data?.documents?.total ? (data.documents.completed / data.documents.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {loading ? '...' : (data?.documents?.processing || 0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">Processing</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                          style={{ width: `${data?.documents?.total ? (data.documents.processing / data.documents.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {loading ? '...' : (data?.documents?.failed || 0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">Failed</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                          style={{ width: `${data?.documents?.total ? (data.documents.failed / data.documents.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total documents</span>
                  <span className="text-white font-bold">{loading ? '...' : docCount}</span>
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
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Notifications</h3>
                </div>
                <button
                  onClick={() => loadDashboardData()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
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
                        transition={{ delay: 1.1 + notification.id * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[notification.color]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm mb-0.5">{notification.title}</p>
                          <p className="text-xs text-slate-400 mb-1">{notification.message}</p>
                          <span className="text-xs text-slate-500">{notification.time}</span>
                        </div>
                      </motion.div>
                    )
                  })
                )}
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
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Usage Analytics</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Storage Used</span>
                    <span className="text-sm font-medium text-white">{storageUsedGB.toFixed(1)} GB / {storageLimitGB} GB</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full relative" style={{ width: `${Math.min((storageUsedGB / storageLimitGB) * 100, 100)}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">API Queries</span>
                    <span className="text-sm font-medium text-white">{queryCount} / 5,000</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full relative" style={{ width: `${Math.min((queryCount / 5000) * 100, 100)}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Documents</span>
                    <span className="text-sm font-medium text-white">{docCount} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full relative" style={{ width: `${Math.min((docCount / 100) * 100, 100)}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-white font-medium">Documents Processed</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">
                    {data?.documents?.total ? `${Math.round((data.documents.completed / Math.max(data.documents.total, 1)) * 100)}%` : '0%'}
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/dashboard/upload')}
                  icon={Sparkles}
                  iconPosition="left"
                >
                  Upload Documents
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
