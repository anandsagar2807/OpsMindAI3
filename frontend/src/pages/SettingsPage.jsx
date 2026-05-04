import { Card } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { User, Bell, Lock, CreditCard } from 'lucide-react'

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-dark-400">Manage your account and preferences</p>
        </div>

        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold text-white">Profile Settings</h3>
          </div>
          <p className="text-dark-400">Manage your profile settings through Clerk.</p>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold text-white">Notifications</h3>
          </div>
          <p className="text-dark-400">Configure your notification preferences.</p>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold text-white">Security</h3>
          </div>
          <p className="text-dark-400">Manage security and authentication settings.</p>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-primary-400" />
            <h3 className="text-xl font-bold text-white">Billing</h3>
          </div>
          <p className="text-dark-400">View and manage your subscription.</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
