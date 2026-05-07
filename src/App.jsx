import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Heart } from 'lucide-react'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FFE4ED] to-[#FFB7C5] flex items-center justify-center">
        <div className="text-center animate-fade-in relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-5 shadow-xl shadow-pink-dark/20 mx-auto border-2 border-pink/20">
            <Heart className="w-10 h-10 text-pink-dark" fill="#FF91A4" />
          </div>
          <p className="text-gray-500 text-lg font-semibold">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

function AppContent() {
  const { user } = useApp()
  return user ? <Dashboard /> : <Login />
}

export default App
