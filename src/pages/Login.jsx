import { useState } from 'react'
import { useApp, generateAccountKey, loadAccountsMap } from '../context/AppContext'
import Sakura from '../components/Sakura'
import { Heart, User, Calendar as CalIcon, CheckCircle2 } from 'lucide-react'

export default function Login() {
  const [step, setStep] = useState(1) // 1: form, 2: show account, 3: welcome back
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [errors, setErrors] = useState({})
  const [accountKey, setAccountKey] = useState(null)
  const [isWelcomeBack, setIsWelcomeBack] = useState(false)
  const login = useApp().login

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'กรุณากรอกชื่อของคุณ'
    if (!dob) newErrors.dob = 'กรุณาเลือกวันเกิด'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const map = loadAccountsMap()
    const lookupKey = name.trim().toLowerCase()
    const existingKey = map[lookupKey]

    if (existingKey) {
      // Account exists — welcome back!
      setAccountKey(existingKey)
      setIsWelcomeBack(true)
      setStep(3)
      // Auto-login them right away
      setTimeout(() => {
        login(name.trim(), dob, existingKey)
      }, 0)
      return
    }

    // New account — generate fresh key with stable random part based on name+dob
    const combinedSeed = `${name.trim().toLowerCase()}_${dob}`
    let seedHash = 0
    for (let i = 0; i < combinedSeed.length; i++) {
      const char = combinedSeed.charCodeAt(i)
      seedHash = ((seedHash << 5) - seedHash) + char
      seedHash = seedHash & seedHash
    }
    const stableSuffix = Math.abs(seedHash % 10000).toString().padStart(4, '0')
    const key = `PR-${Math.abs(Math.floor(seedHash / 100)).toString(36).toUpperCase()}-${stableSuffix}`

    setAccountKey(key)
    setIsWelcomeBack(false)
    setStep(2)
  }

  const goToDashboard = () => {
    if (accountKey && !isWelcomeBack) {
      login(name.trim(), dob, accountKey)
    } else if (isWelcomeBack) {
      // Already logged in from welcome back
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Sakura count={50} />

      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{ zIndex: 50 }}>
        {Array.from({ length: 16 }, (_, i) => {
          const size = 30 + Math.random() * 18
          const rotation = Math.random() * 90 - 45
          const colors = ['#FFB7C5', '#FF91A4', '#FFA5B8', '#FFCAD4', '#FFD1DC']
          return (
            <div
              key={`tb-${i}`}
              className="absolute"
              style={{
                left: `${(i / 16) * 100 + 3}%`,
                top: '0px',
                transform: `translate(-50%, -10%) rotate(${rotation}deg)`,
                zIndex: 51,
              }}
            >
              <svg width={size} height={size} viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 2px 6px rgba(255,105,180,0.3))' }}>
                {Array.from({ length: 5 }).map((_, j) => {
                  const angle = (j * 72 - 90) * (Math.PI / 180)
                  const px = 32 + 22 * Math.cos(angle)
                  const py = 32 + 22 * Math.sin(angle)
                  return (
                    <ellipse key={j} cx={px} cy={py} rx={15} ry={19} fill={colors[i % 5]} opacity={0.85} transform={`rotate(${j * 72 - 90}, ${px}, ${py})`} />
                  )
                })}
                <circle cx="32" cy="32" r="11" fill="#FF69B4" opacity="0.9" />
                <circle cx="32" cy="32" r="5" fill="#FFD700" opacity="0.95" />
                <circle cx="26" cy="26" r="3.5" fill="white" opacity="0.35" />
              </svg>
            </div>
          )
        })}
        <svg className="absolute top-0 left-0 w-full h-8" preserveAspectRatio="none" style={{ zIndex: 49 }}>
          <path d="M0,2 C50,10 100,0 150,6 C200,12 250,1 300,6 C350,12 400,0 450,6 C500,12 550,1 600,6 L600,0 L0,0 Z" fill="#E8A0B5" opacity={0.5} />
          <path d="M0,4 Q75,10 150,4 Q225,-2 300,4 Q375,10 450,4 Q525,-2 600,4" fill="none" stroke="#D4879A" strokeWidth="1.5" opacity={0.4} />
        </svg>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-slide-up px-8">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm shadow-2xl shadow-pink-dark/30 mb-6 mx-auto ring-4 ring-white/50">
            <Heart className="w-12 h-12 text-pink-dark" fill="#FF91A4" />
            <div className="absolute inset-0 rounded-full border-4 border-pink/20 animate-pulse-soft" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight drop-shadow-sm">PinkReminder</h1>
          <p className="text-lg text-gray-500 mt-2 font-semibold">จัดการการบ้านอย่างสบายใจ ✨</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl p-10 space-y-7 border border-pink/20 shadow-2xl shadow-pink/10 rounded-none">
            <p className="text-center text-xl font-bold text-gray-600 mb-2">สวัสดีค่ะ~ เราชื่ออะไรน้า? 🌸</p>

            {/* Name Input */}
            <div>
              <label className="block text-base font-bold text-gray-500 mb-3 text-center">ชื่อของเรา</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text" value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
                  placeholder="เช่น น้องแป้ง"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 outline-none text-base ${
                    errors.name ? 'border-red-300 focus:border-red-400 bg-red-50/40' : 'border-pink/20 focus:border-pink-dark bg-white/60 backdrop-blur-sm'
                  }`}
                  autoFocus
                />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-3 text-center font-semibold animate-fade-in">{errors.name}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-base font-bold text-gray-500 mb-3 text-center">วัน เดือน ปี เกิด</label>
              <div className="relative">
                <CalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="date" value={dob}
                  onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: '' })) }}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 outline-none text-base ${
                    errors.dob ? 'border-red-300 focus:border-red-400 bg-red-50/40' : 'border-pink/20 focus:border-pink-dark bg-white/60 backdrop-blur-sm'
                  }`}
                />
              </div>
              {errors.dob && <p className="text-red-400 text-sm mt-3 text-center font-semibold animate-fade-in">{errors.dob}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-dark to-pink text-white font-bold text-lg hover:from-pink hover:to-pink-dark transition-all duration-200 shadow-xl shadow-pink-dark/30 active:scale-[0.98]"
            >
              สร้างแอคเคาต์คาต์ 💖
            </button>

            <p className="text-center text-sm text-gray-400 font-medium pt-2">ข้อมูลทั้งหมดเก็บในเครื่องคุณเท่านั้น 🏠</p>
          </form>
        ) : step === 3 ? (
          /* Welcome Back */
          <div className="bg-white/70 backdrop-blur-xl p-10 border border-pink/20 shadow-2xl shadow-pink/10 rounded-none animate-fade-in">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-5" />
              <p className="text-xl font-extrabold text-emerald-500 mb-2">ยินดีต้อนรับกลับค่ะ! 🎉</p>
              <p className="text-gray-500 mb-4">นี่คือรหัสแอคเคาต์คาต์</p>
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6 border border-emerald-200">
                <p className="text-2xl font-extrabold text-emerald-600 tracking-wider break-all">{accountKey}</p>
              </div>
              <p className="text-sm text-emerald-500 font-semibold">กำลังเข้าสู่ระบบ... ✨</p>
            </div>
          </div>
        ) : (
          /* New Account Created */
          <div className="bg-white/70 backdrop-blur-xl p-10 border border-pink/20 shadow-2xl shadow-pink/10 rounded-none animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-dark to-pink flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Heart className="w-10 h-10 text-white" fill="white" />
              </div>
              <p className="text-lg font-bold text-gray-600 mb-2">สร้างแอคเคาต์คาต์</p>
              <p className="text-gray-500 mb-4">นี่คือรหัสแอคเคาต์คาต์ ใช้เวลาเข้าใช้ครั้งต่อไป:</p>
              <div className="bg-gradient-to-r from-pink-light/40 to-pink/20 rounded-2xl p-6 mb-6 border border-pink/20">
                <p className="text-2xl font-extrabold text-pink-dark tracking-wider break-all">{accountKey}</p>
              </div>
              <p className="text-xs text-gray-400 mb-6">💡 จดรหัสนี้เก็บไว้ หรือแคบ์หน้าเว็บก็ได้น้า</p>
              <button
                onClick={goToDashboard}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-dark to-pink text-white font-bold text-lg hover:from-pink hover:to-pink-dark transition-all duration-200 shadow-xl shadow-pink-dark/30 active:scale-[0.98]"
              >
                เข้าไปที่ PinkReminder 💕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
