import { Home, ListTodo, Calendar } from 'lucide-react'

const TABS = [
  { key: 'home', label: 'หน้าแรก', icon: Home },
  { key: 'tasks', label: 'รายการ', icon: ListTodo },
  { key: 'calendar', label: 'ปฏิทิน', icon: Calendar },
]

export default function TabBar({ activeTab, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-pink/20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-center pb-4">
        <div className="inline-flex items-stretch h-[56px] bg-white/80 rounded-2xl overflow-hidden shadow-sm ring-1 ring-pink/30 gap-6">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`flex flex-col items-center justify-center px-4 py-0.5 transition-all duration-200 ${
                  isActive ? 'text-pink-dark bg-pink-light/30' : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0 transition-all duration-200 ${
                  isActive ? 'bg-gradient-to-br from-pink-dark to-pink text-white' : ''
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className={`text-lg font-bold whitespace-nowrap mt-0.5 ${isActive ? 'text-pink-dark' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
