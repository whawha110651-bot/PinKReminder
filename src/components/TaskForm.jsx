import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { X, BookOpen, Tag, Calendar, FileText } from 'lucide-react'

const SUBJECTS = [
  { value: 'math', label: '📐 คณิตศาสตร์' },
  { value: 'science', label: '🔬 วิทยาศาสตร์' },
  { value: 'thai', label: '📖 ภาษาไทย' },
  { value: 'english', label: '🌍 ภาษาอังกฤษ' },
  { value: 'history', label: '🏛️ สังคมศึกษา' },
  { value: 'art', label: '🎨 ศิลปะ' },
  { value: 'pe', label: '⚽ สุขศึกษา' },
  { value: 'other', label: '📝 อื่นๆ' },
]

const TYPES = [
  { value: '', label: 'เลือกประเภท' },
  { value: 'homework', label: '📄 การบ้าน' },
  { value: 'group', label: '👥 งานกลุ่ม' },
  { value: 'project', label: '🗂 โครงงาน' },
]

export default function TaskForm({ expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const { addTask } = useApp()

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'กรุณาใส่ชื่องาน'
    if (!subject) newErrors.subject = 'กรุณาเลือกหมวดหมู่'
    if (!dueDate) newErrors.dueDate = 'กรุณาเลือกวันกำหนดส่ง'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    addTask({ title: title.trim(), subject, type, dueDate: new Date(dueDate).toISOString(), note: note.trim() })
    setTitle(''); setSubject(''); setType(''); setDueDate(''); setNote(''); setErrors({})
    if (!expanded) setIsExpanded(false)
  }

  const handleReset = () => {
    setTitle(''); setSubject(''); setType(''); setDueDate(''); setNote(''); setErrors({}); setIsExpanded(false)
  }

  // ── Collapsed state ──
  if (!expanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full py-5 rounded-2xl border-2 border-dashed border-pink/30 bg-white hover:border-pink-dark/50 hover:bg-pink-light/10 transition-all duration-200 flex items-center justify-center gap-3 text-lg font-bold text-pink-dark active:scale-[0.98]"
      >
        <PlusIcon /> เพิ่มการบ้านใหม่
      </button>
    )
  }

  // ── Expanded state — everything full-width ──
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border-4 border-pink/30 shadow-2xl shadow-pink-dark/10 p-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-700 text-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-light/50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-pink-dark" />
          </div>
          เพิ่มการบ้านใหม่
        </h3>
        <button type="button" onClick={handleReset} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors active:scale-95">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Title — full width */}
      <div>
        <label className="block text-lg font-bold text-gray-600 mb-2.5">ชื่องาน</label>
        <div className="relative w-full">
          <input
            type="text" value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: '' })) }}
            placeholder="เช่น ทำแบบฝึกหัดหน้า 25"
            className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 text-lg transition-all outline-none ${
              errors.title ? 'border-red-300 bg-red-50/50' : 'border-gray-100 focus:border-pink-dark'
            } bg-gray-50/50 focus:bg-white`}
          />
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
        </div>
        {errors.title && <p className="text-red-400 text-md mt-2 font-medium">{errors.title}</p>}
      </div>

      {/* Subject + Due Date — full-width columns */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-lg font-bold text-gray-600 mb-2.5">หมวดหมู่</label>
          <div className="relative w-full">
            <select
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((prev) => ({ ...prev, subject: '' })) }}
              className={`w-full pl-12 pr-10 py-4 rounded-xl border-2 text-lg transition-all outline-none appearance-none cursor-pointer ${
                errors.subject ? 'border-red-300 bg-red-50/50' : 'border-gray-100 focus:border-pink-dark'
              } bg-gray-50/50 focus:bg-white`}
            >
              <option value="">เลือกหมวด</option>
              {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {errors.subject && <p className="text-red-400 text-sm mt-2 font-medium">{errors.subject}</p>}

          {/* ประเภท */}
          <div className="relative w-full mt-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-xl border-2 text-lg transition-all outline-none appearance-none cursor-pointer border-gray-100 focus:border-pink-dark bg-gray-50/50 focus:bg-white"
            >
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-600 mb-2.5">วันกำหนดส่ง</label>
          <div className="relative w-full">
            <input
              type="text" value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setErrors((prev) => ({ ...prev, dueDate: '' })) }}
              placeholder="เช่น 2026-05-15"
              inputMode="numeric"
              pattern="\d{4}-\d{2}-\d{2}"
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 text-lg transition-all outline-none ${
                errors.dueDate ? 'border-red-300 bg-red-50/50' : 'border-gray-100 focus:border-pink-dark'
              } bg-gray-50/50 focus:bg-white`}
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
          </div>
          {errors.dueDate && <p className="text-red-400 text-md mt-2 font-medium">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Note — optional, full width */}
      <div>
        <label className="block text-lg font-bold text-gray-600 mb-2.5">หมายเหตุ <span className="text-gray-400 font-medium">(ไม่บังคับ)</span></label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="รายละเอียดเพิ่มเติม..."
          rows={3}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 text-lg transition-all outline-none resize-none focus:border-pink-dark bg-gray-50/50 focus:bg-white"
        />
      </div>

      {/* Submit — full width */}
      <button
        type="submit"
        className="w-full py-6 px-8 rounded-xl bg-gradient-to-r from-pink-dark to-pink text-white font-bold text-lg shadow-xl shadow-pink-dark/30 active:scale-[0.98] tracking-wide"
      >
        บันทึกการบ้าน
      </button>
    </form>
  )
}

function PlusIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
}
