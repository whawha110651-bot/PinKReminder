import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatDate, getDaysRemaining, getUrgentTasks } from '../utils/storage'
import Sakura from '../components/Sakura'
import TabBar from '../components/TabBar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import ChatBot from '../components/ChatBot'
import { Clock, CheckCircle2, TrendingUp, Target, Bell, Heart, User, Sparkles, AlertTriangle, Circle, Flower2, X, BookOpen, Trophy, Star, ChevronRight, Calendar } from 'lucide-react'

export default function Dashboard() {
  return <DashboardContent />
}

function DashboardContent() {
  const { user, tasks } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [showNotifications, setShowNotifications] = useState(false)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const urgentTasks = getUrgentTasks()
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="relative min-h-screen flex flex-col">
      <Sakura count={40} />

      {/* Top Nav */}
      <nav className="w-full sticky top-0 z-50 bg-pink-light/40 backdrop-blur-lg border-b border-pink/20 shadow-lg shadow-pink/10 pb-[70px]">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-dark to-pink flex items-center justify-center shadow-lg ring-2 ring-white/50">
              <Heart className="w-5 h-5 text-white" fill="white" size={20} />
            </div>
            <span className="font-bold text-lg text-gray-700">PinkReminder</span>
          </div>
          <div className="flex items-center gap-2.5">
            {pendingTasks > 0 && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-white/50 transition-all active:scale-95 ring-1 ring-pink/20"
              >
                <Bell className="w-5 h-5 text-pink-dark" />
                {urgentTasks.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-pink-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center">{urgentTasks.length}</span>
                )}
              </button>
            )}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 ring-1 ring-pink/20">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-[60] flex justify-end" onClick={() => setShowNotifications(false)}>
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-pink/20 flex items-center justify-between bg-gradient-to-r from-pink-light/40 to-transparent">
              <h3 className="font-bold text-gray-700 flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-pink-light/50 flex items-center justify-center"><Bell className="w-5 h-5 text-pink-dark" /></div>
                การแจ้งเตือน
              </h3>
              <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-pink-light/30 rounded-xl transition-colors active:scale-95">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              {urgentTasks.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles className="w-12 h-12 text-pink-dark/50 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-semibold">ไม่มีการแจ้งเตือน 🎉</p>
                </div>
              ) : urgentTasks.map((task) => {
                const days = getDaysRemaining(task.dueDate)
                return (
                  <div key={task.id} className="bg-gradient-to-r from-orange-50/80 to-red-50/60 border border-orange-200/50 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-lg font-bold text-gray-700">{task.title}</p>
                        <p className={`text-base font-medium mt-0.5 ${days <= 1 ? 'text-red-500' : 'text-orange-500'}`}>
                          ถึงกำหนดส่ง: {formatDate(task.dueDate)} {days <= 1 ? '(เร่งด่วน!)' : `(เหลืออีก ${days} วัน)`}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex-1 bg-black/10 ml-4 backdrop-blur-sm" />
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 w-full relative z-10">
        {activeTab === 'home' && <HomePage user={user} tasks={tasks} totalTasks={totalTasks} completedTasks={completedTasks} pendingTasks={pendingTasks} urgentTasks={urgentTasks} progressPercent={progressPercent} />}
        {activeTab === 'tasks' && <TasksPage tasks={tasks} totalTasks={totalTasks} completedTasks={completedTasks} />}
        {activeTab === 'calendar' && <CalendarPage tasks={tasks} />}
      </main>

      {/* Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}

/* ═══════ Page 1: Home ═══════ */
function HomePage({ user, totalTasks, completedTasks, pendingTasks, urgentTasks, progressPercent }) {
  return (
    <div className="animate-fade-in pb-8">
      {/* Welcome */}
      <div className="text-center pt-8 pb-6">
        <div className="inline-flex items-center gap-3 mb-3">
          <Flower2 className="w-5 h-5 text-pink-dark/60" />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            สวัสดี{user?.name}~ 💕
          </h1>
          <Flower2 className="w-5 h-5 text-pink-dark/60 rotate-[-20deg]" />
        </div>
        <p className="text-lg text-gray-500 font-medium">
          มาเช็กการบ้านกันเถอะ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 mb-6">
        <StatCard icon={<Clock className="w-7 h-7" />} label="งานค้าง" value={String(pendingTasks)} gradient="from-pink-light/60 to-pink/40" />
        <StatCard icon={<CheckCircle2 className="w-7 h-7" />} label="เสร็จแล้ว" value={String(completedTasks)} gradient="from-blue-light/60 to-blue/40" />
        <StatCard icon={<TrendingUp className="w-7 h-7" />} label="ทั้งหมด" value={String(totalTasks)} gradient="from-emerald-50 to-emerald-100/50" />
      </div>

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="bg-white/70 backdrop-blur-sm border-x border-pink/20 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-dark" />
              ความคืบหน้าของคุณ
            </h3>
            <span className="text-3xl font-extrabold text-pink-dark">{progressPercent}%</span>
          </div>
          <div className="w-full h-7 bg-pink-light/40 rounded-full overflow-hidden border border-pink/20 shadow-inner">
            <div className="h-full bg-gradient-to-r from-pink-dark via-pink to-pink-light flex items-center justify-end pr-4 transition-all duration-500" style={{ width: `${Math.max(progressPercent, 2)}%` }}>
              {progressPercent > 10 && <span className="text-white text-xs font-bold">{progressPercent}%</span>}
            </div>
          </div>
        </div>
      )}

      {/* Urgent */}
      {urgentTasks.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm border-x border-orange-200/50 p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center ring-2 ring-orange-200/50">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-bold text-orange-600 text-lg tracking-wide">ใกล้ถึงกำหนดส่ง!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentTasks.slice(0, 6).map((task) => {
              const days = getDaysRemaining(task.dueDate)
              return (
                <div key={task.id} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-orange-200/40">
                  <Circle className={`w-5 h-5 shrink-0 ${days <= 1 ? 'text-red-400' : 'text-orange-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-gray-700 truncate">{task.title}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${days <= 0 ? 'text-red-400' : 'text-orange-400'}`}>
                      {days <= 0 ? 'เลยกำหนด!' : `เหลืออีก ${days} วัน`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="-mx-6 px-6">
        <SectionTitle icon={<PlusIcon className="w-5 h-5 text-pink-dark" />} title="เพิ่มการบ้านใหม่" />
        <TaskForm expanded={true} />
      </div>
    </div>
  )
}

/* ═══════ Page 2: Tasks ═══════ */
function TasksPage({ tasks, completedTasks, totalTasks }) {
  return (
    <div className="animate-fade-in pb-8">
      <div className="-mx-6 px-6 mb-6">
        <SectionTitle icon={<BookmarkIcon className="w-5 h-5 text-pink-dark" />} title="รายการการบ้าน" />
        <TaskList />
      </div>

      <AchievementsSection completedTasks={completedTasks} totalTasks={totalTasks} />
      <QuickTipsSection />
    </div>
  )
}

/* ═══════ Page 3: Calendar ═══════ */
function CalendarPage({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const todayDate = today.getDate()

  const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  // Group tasks by date
  const tasksByDate = {}
  tasks.forEach((task) => {
    const d = new Date(task.dueDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!tasksByDate[day]) tasksByDate[day] = []
      tasksByDate[day].push(task)
    }
  })

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  return (
      <div className="animate-fade-in -mx-6 min-h-[calc(100vh-120px)] flex flex-col">
      {/* Month Selector */}
      <div className="flex items-center justify-between mb-4 px-4">
        <button onClick={prevMonth} className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-pink/20 hover:bg-white/90 transition-all active:scale-95">
          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h2 className="text-xl font-extrabold text-gray-700">{monthNames[month]} {year + 543}</h2>
        <button onClick={nextMonth} className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-pink/20 hover:bg-white/90 transition-all active:scale-95">
          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Calendar Grid — Full Screen */}
      <div className="bg-white/70 backdrop-blur-sm overflow-hidden flex-1">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-pink-light/30 border-b border-pink/10">
          {dayNames.map((d, i) => (
            <div key={i} className={`py-4 text-center text-xl font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7" style={{ flex: 1 }}>
          {Array.from({ length: firstDay + daysInMonth }).map((_, i) => {
            const day = i - firstDay + 1
            const isBlank = day < 1 || day > daysInMonth
            const actualDay = isBlank ? null : day
            const dayTasks = actualDay ? (tasksByDate[actualDay] || []) : []
            const isToday = !isBlank && isCurrentMonth && actualDay === todayDate
            return (
              <div key={i} className={`min-h-[90px] border-b border-r border-pink/10 relative ${isToday ? 'bg-pink-dark/10' : isBlank ? 'bg-transparent border-l border-gray-50' : 'bg-white/50'} ${day % 7 === 0 ? 'border-r-0' : ''} ${isBlank ? '' : 'p-2 flex flex-col justify-start'}`}>
                {!isBlank && (
                  <>
                    <span className={`text-3xl font-bold inline-flex w-10 h-10 items-center justify-center rounded-full ${isToday ? 'text-pink-dark bg-pink-dark text-white' : dayNames[new Date(year, month, actualDay).getDay()] === 'อา' ? 'text-red-400' : dayNames[new Date(year, month, actualDay).getDay()] === 'ส' ? 'text-blue-400' : 'text-gray-600'}`}>
                      {actualDay}
                    </span>
                    {dayTasks.slice(0, 2).map((task, ti) => (
                      <div key={ti} className={`mt-1.5 px-2 py-1.5 rounded-lg text-lg font-semibold truncate ${task.completed ? 'bg-gray-100 text-gray-400 line-through' : 'bg-pink-dark/20 text-pink-dark'}`}>
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="mt-1.5 text-lg font-semibold text-gray-400">+{dayTasks.length - 2}</div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* No tasks message */}
      {tasks.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-base font-semibold">ยังไม่มีปฏิทินการบ้าน~</p>
          <p className="text-gray-300 text-sm mt-1 font-medium">เพิ่มการบ้านเพื่อแสดงปฏิทิน</p>
        </div>
      )}
    </div>
  )
}

/* ═══════ Shared Sub-components ═══════ */

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="group bg-white/60 backdrop-blur-sm text-center py-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 cursor-default border-r border-pink/15 last:border-r-0">
      <div className={`inline-flex items-center justify-center w-13 h-13 rounded-2xl mb-3 bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/40`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-700 tracking-tight">{value}</p>
      <p className="text-2xl font-bold text-gray-600 mt-1">{label}</p>
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-pink-light/50 flex items-center justify-center ring-2 ring-white/30">
        {icon}
      </div>
      <h3 className="font-black text-gray-700 text-lg">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-pink/20 to-transparent" />
    </div>
  )
}

function PlusIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
}

function BookmarkIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
}

function AchievementsSection({ completedTasks, totalTasks }) {
  const achievements = []
  if (totalTasks >= 1) achievements.push({ icon: <BookOpen className="w-6 h-6" />, title: 'เริ่มต้นแล้ว!', desc: 'เพิ่มการบ้านแรกสำเร็จ', unlocked: true })
  if (completedTasks >= 1) achievements.push({ icon: <Star className="w-6 h-6" />, title: 'ทำสำเร็จ!', desc: 'ผ่าน 1 งาน ✅', unlocked: true })
  if (completedTasks >= 5) achievements.push({ icon: <Trophy className="w-6 h-6" />, title: 'มาแรง!', desc: 'ผ่านไปแล้ว 5 งาน 🔥', unlocked: true })
  if (completedTasks >= 10) achievements.push({ icon: <Trophy className="w-6 h-6" />, title: 'ยอดเยี่ยม!', desc: 'ผ่านมาแล้ว 10 งาน! 🏆', unlocked: true })
  if (achievements.length === 0) return null

  return (
    <div className="w-full bg-white/60 backdrop-blur-sm border-x border-pink/20 p-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-pink-light/50 flex items-center justify-center ring-2 ring-white/30">
          <Trophy className="w-5 h-5 text-pink-dark" />
        </div>
        <h3 className="font-bold text-gray-600 text-lg">ความสำเร็จของคุณ</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((ach, i) => (
          <div key={i} className="bg-gradient-to-br from-white/70 to-pink-light/20 backdrop-blur-sm rounded-2xl p-5 text-center border border-pink/15 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 mb-3 shadow-sm ring-2 ring-pink/10">
              <span className="text-pink-dark">{ach.icon}</span>
            </div>
            <p className="text-sm font-bold text-gray-600">{ach.title}</p>
            <p className="text-xs text-gray-400 mt-1">{ach.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickTipsSection() {
  const tips = [
    { emoji: '📅', text: 'กำหนดเวลาส่งให้ชัดเจน จะช่วยเตือนล่วงหน้า' },
    { emoji: '✅', text: 'ขีดฆ่างานที่ทำเสร็จ แล้วภูมิใจกับตัวเอง!' },
    { emoji: '🔔', text: 'กดกระดิ่งเพื่อเช็คงานด่วนเสมอ' },
    { emoji: '💪', text: 'ทีละน้อย ก็ไปถึงเป้าหมายได้' },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-pink-light/30 via-white/40 to-blue-light/20 backdrop-blur-sm border-x border-pink/20 p-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm ring-2 ring-white/40">
          <Sparkles className="w-5 h-5 text-pink-dark" />
        </div>
        <h3 className="font-bold text-gray-600 text-lg">เคล็ดลับดี ๆ สำหรับคุณ ✨</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-4 border border-pink/10 hover:border-pink/30 hover:shadow-md transition-all duration-300">
            <span className="text-2xl shrink-0">{tip.emoji}</span>
            <p className="text-base font-medium text-gray-600 leading-relaxed flex-1">{tip.text}</p>
            <ChevronRight className="w-5 h-5 text-pink/30 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
