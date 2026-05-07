import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatDate, getDaysRemaining } from '../utils/storage'
import { CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp, Bookmark, Calendar as LucideCalendar } from 'lucide-react'

const SUBJECT_CONFIG = {
  math: { emoji: '📐', label: 'คณิตศาสตร์', color: 'text-blue-500 bg-blue-50 border-blue-100' },
  science: { emoji: '🔬', label: 'วิทยาศาสตร์', color: 'text-green-500 bg-green-50 border-green-100' },
  thai: { emoji: '📖', label: 'ภาษาไทย', color: 'text-red-500 bg-red-50 border-red-100' },
  english: { emoji: '🌍', label: 'ภาษาอังกฤษ', color: 'text-purple-500 bg-purple-50 border-purple-100' },
  history: { emoji: '🏛️', label: 'สังคมศึกษา', color: 'text-amber-500 bg-amber-50 border-amber-100' },
  art: { emoji: '🎨', label: 'ศิลปะ', color: 'text-pink-500 bg-pink-50 border-pink-100' },
  pe: { emoji: '⚽', label: 'สุขศึกษา', color: 'text-teal-500 bg-teal-50 border-teal-100' },
  other: { emoji: '📝', label: 'อื่นๆ', color: 'text-gray-500 bg-gray-50 border-gray-100' },
}

export default function TaskList() {
  const { tasks, toggleTask, deleteTask } = useApp()
  const [expandedId, setExpandedId] = useState(null)

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-none border-x border-b border-t border-gray-100 p-16 text-center animate-fade-in">
        <Bookmark className="w-14 h-14 text-gray-200 mx-auto mb-5" />
        <p className="text-gray-400 text-lg font-semibold">ยังไม่มีการบ้าน~</p>
        <p className="text-gray-300 text-sm mt-2 font-medium">กดปุ่มด้านบนเพื่อเพิ่มการบ้านแรกของคุณ!</p>
      </div>
    )
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="animate-fade-in space-y-6">
      {/* Pending Section */}
      {pendingTasks.length > 0 && (
        <section>
          <h3 className="text-xl font-extrabold text-orange-500 mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> งานค้าง ({pendingTasks.length})
          </h3>
          <div className="space-y-0 bg-white border-x border-b border-gray-100 shadow-sm rounded-b-xl overflow-hidden">
            {pendingTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                isFirst={index === 0}
                isLast={index === pendingTasks.length - 1}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                expandedId={expandedId}
                onToggleExpand={() => setExpandedId(expandedId === task.id ? null : task.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <section>
          <h3 className="text-xl font-extrabold text-emerald-500 mb-3 flex items-center gap-2">
            <span className="text-2xl">✅</span> เสร็จแล้ว ({completedTasks.length})
          </h3>
          <div className="space-y-0 bg-white border-x border-b border-gray-100 shadow-sm rounded-b-xl overflow-hidden">
            {completedTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                isFirst={index === 0}
                isLast={index === completedTasks.length - 1}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                expandedId={expandedId}
                onToggleExpand={() => setExpandedId(expandedId === task.id ? null : task.id)}
              />
            ))}
          </div>
        </section>
      )}

      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <div className="bg-white rounded-none border-x border-b border-t border-gray-100 p-12 text-center">
          <p className="text-gray-300 text-base font-medium">ไม่พบการบ้าน 🤷‍♀️</p>
        </div>
      )}
    </div>
  )
}

function TaskItem({ task, isFirst, isLast, onToggle, onDelete, expandedId, onToggleExpand }) {
  const days = getDaysRemaining(task.dueDate)
  const config = SUBJECT_CONFIG[task.subject] || SUBJECT_CONFIG.other
  const isOverdue = days < 0 && !task.completed
  const isUrgent = days >= 0 && days <= 1 && !task.completed

  return (
    <div
      className={`group bg-white border transition-all duration-200 hover:shadow-md animate-fade-in ${
        isFirst ? 'rounded-t-xl border-t' : 'border-t-0'
      } ${isLast ? 'rounded-b-xl border-b' : 'border-b border-gray-100'} ${
        task.completed
          ? 'border-gray-100 opacity-50 hover:opacity-70'
          : isOverdue
            ? 'border-red-100 hover:border-red-200'
            : isUrgent
              ? 'border-orange-100 hover:border-orange-200'
              : 'border-gray-100 hover:border-pink/20'
      }`}
    >
      <div className="p-5 flex items-start gap-5">
        <button onClick={onToggle} className="mt-0.5 shrink-0 transition-all duration-200 hover:scale-110 active:scale-95">
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" fill="#7DCEA2" />
          ) : (
            <Circle className={`w-6 h-6 transition-colors ${isOverdue ? 'text-red-200' : isUrgent ? 'text-orange-200' : 'text-gray-200'}`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className={`text-lg font-bold leading-relaxed ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}>
                {task.title}
              </p>
              {!task.completed && (
                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${config.color}`}>
                    {config.emoji} {config.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                    isOverdue ? 'text-red-400' : isUrgent ? 'text-orange-400' : 'text-gray-400'
                  }`}>
                    <LucideCalendar className="w-4 h-4" />
                    {formatDate(task.dueDate)}
                    {isOverdue && ' • เลยกำหนด!'}
                    {isUrgent && !isOverdue && ' • ใกล้ถึงแล้ว!'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {task.note && (
                <button onClick={onToggleExpand} className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  {expandedId === task.id ? (
                    <ChevronUp className="w-4.5 h-4.5 text-gray-300 hover:text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4.5 h-4.5 text-gray-300 hover:text-gray-500" />
                  )}
                </button>
              )}
              <button onClick={onDelete} className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all duration-200 active:scale-95">
                <Trash2 className="w-4.5 h-4.5 text-gray-300 hover:text-red-400" />
              </button>
            </div>
          </div>

          {task.note && expandedId === task.id && (
            <div className="mt-4 pl-4 border-l-2 border-pink/10 animate-fade-in">
              <p className="text-sm text-gray-400 leading-relaxed">{task.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
