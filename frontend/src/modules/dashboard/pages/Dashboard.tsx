import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Calendar, BookOpen, Zap, LogOut } from 'lucide-react'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const modules = [
    {
      name: 'Calendar',
      description: 'Manage your events',
      icon: Calendar,
      path: '/calendar',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Study Assistant',
      description: 'Learn and study better',
      icon: BookOpen,
      path: '/study',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Tools',
      description: 'Access all tools',
      icon: Zap,
      path: '/tools',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal OS</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Personal OS</h2>
          <p className="text-gray-600">Your all-in-one digital space for productivity, learning, and creativity.</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <div
                key={module.name}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.path)}
              >
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
