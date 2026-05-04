import { motion } from 'framer-motion'
import { useUser } from '@clerk/react'
import {
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  Upload,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { Link } from 'react-router-dom'

const DashboardHome = () => {
  const { user } = useUser()

  const stats = [
    {
      label: 'Documents',
      value: '24',
      change: '+3 this week',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Queries',
      value: '1,247',
      change: '+89 today',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Avg Response Time',
      value: '0.8s',
      change: '-0.2s faster',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      change: '+2.1% this month',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const recentActivity = [
    {
      type: 'upload',
      title: 'Employee_Handbook_2024.pdf',
      description: 'Document uploaded and processed',
      time: '2 hours ago',
      icon: Upload
    },
    {
      type: 'query',
      title: 'What is our refund policy?',
      description: 'Query answered successfully',
      time: '5 hours ago',
      icon: MessageSquare
    },
    {
      type: 'upload',
      title: 'IT_Security_Policy.pdf',
      description: 'Document uploaded and processed',
      time: '1 day ago',
      icon: Upload
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10" />
            <div className="relative p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-dark-300 text-lg">
                Your AI knowledge assistant is ready to help you find answers instantly.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover glass>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-dark-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-400">{stat.change}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card glass>
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1 truncate">{activity.title}</p>
                      <p className="text-sm text-dark-400">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-dark-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Usage Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
                    <div className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">API Calls</span>
                    <span className="text-sm font-medium text-white">1,247 / 5,000</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">Documents</span>
                    <span className="text-sm font-medium text-white">24 / 100</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <Button variant="secondary" className="w-full">
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
