import { useState } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

const BOT_NAME = 'ปุ๊กกี้ 🌸'

// Category-based responses for better matching
const RESPONSE_CATEGORIES = [
  // === GREETINGS ===
  {
    pattern: ['สวัสดี', 'หวัดดี', 'ดีค่ะ', 'ดีครับ', 'ดีจ้า', 'ดีคะ', 'ดีคร้าบ', 'ดีนะ', 'บาย', 'ลาก่อน', 'เชียว', 'ช่าว'],
    response: 'สวัสดีค่า~ ปุ๊กกี้อยู่ตรงนี้พร้อมช่วยน้า มีอะไรให้ปุ๊กช่วยเหลือบอกมาได้เลยค่ะ 💕✨',
  },

  // === ADD HOMEWORK ===
  {
    pattern: ['เพิ่ม', 'บวก', 'สร้าง', 'จะใส่', 'จะเพิ่ม', 'จะสร้าง', 'การบ้านใหม่', 'เพิ่มการบ้านใหม่', 'add new', 'create new'],
    response: 'กดปุ่ม "+ เพิ่มการบ้านใหม่" สีชมพูด้านล่างหน้าแรกเลยน้า~ กรอกชื่อ, หมวดหมู่, วันกำหนดส่ง แล้วกด "บันทึกการบ้าน" แค่นี้ก็เสร็จแล้วค่ะ! 📝🌸',
  },

  // === DELETE HOMEWORK ===
  {
    pattern: ['ลบ', 'ลบทิ้ง', 'ไม่เอาแล้ว', 'delete', 'remove', 'ทิ้ง'],
    response: 'เอาเมาส์ไปชี้ที่การบ้านที่ต้องการ แล้วจะเห็นไอคอนถังขยะ 🗑️ กดเพื่อลบได้เลยน้า~ หรือถ้าใช้มือถือก็ปัดซ้ายแล้วลบค่ะ',
  },

  // === MARK COMPLETE ===
  {
    pattern: ['เสร็จ', 'ติ๊ก', 'เช็ค', 'ถูก', 'mark', 'done', 'เสร็จแล้ว', 'ทำเสร็จ', 'ขีดฆ่า', 'ยกเลิก', 'cancel'],
    response: 'กดที่วงกลม слева ของการบ้านค่ะ วงกลม会变成สีเขียว ✅ งานจะย้ายจาก "งานค้าง" ไป "เสร็จแล้ว" อัตโนมัติค่ะ!',
  },

  // === CALENDAR ===
  {
    pattern: ['ปฏิทิน', 'calendar', 'ดูปฏิทิน', 'เปิดปฏิทิน', 'เดือน', 'เดือนนี้', 'วันไหน', 'วันที่', 'date'],
    response: 'กดแท็บ "ปฏิทิน" ด้านล่างสุดของจอเลยค่ะ จะเห็นปฏิทินทั้งเดือน พร้อมป้ายแสดงการบ้านแต่ละวัน~ สีส้มคือใกล้ส่ง สีม่วงคือส่งแล้วค่ะ 📅',
  },

  // === NOTIFICATIONS / REMINDERS ===
  {
    pattern: ['เตือน', 'แจ้งเตือน', 'notification', 'bill', 'ใกล้ส่ง', 'เกินกำหนด', 'ด้ายด้าย', 'ด่วย', 'เร่งด่วน', 'urgency', 'urgent', 'alarm'],
    response: 'ปุ๊กกี้จะเช็คให้อัตโนมัติค่ะ! ถ้าเป็นการบ้านจะเตือนล่วงหน้า 2 วัน, งานกลุ่ม 1 สัปดาห์, โครงงาน 1 เดือนค่ะ อย่าลืมกดกระดิ่งบนหัวหน้าจอด้วยนะ 🔔',
  },

  // === SUBJECTS ===
  {
    pattern: ['หมวดหมู่', 'หมวด', 'subject', 'วิชา', 'วิยา', 'รายวิชา', 'คณิต', 'วิทยาศาสตร์', 'ไทย', 'อังกฤษ', 'สังคม', 'ศิลปะ', 'สุข', 'อื่นๆ'],
    response: 'มี 8 หมวดให้เลือกค่ะ 📚\n📐 คณิตศาสตร์\n🔬 วิทยาศาสตร์\n📖 ภาษาไทย\n🌍 ภาษาอังกฤษ\n🏛️ สังคมศึกษา\n🎨 ศิลปะ\n⚽ สุขศึกษา\n📝 อื่นๆ',
  },

  // === PENDING / STATUS QUESTIONS ===
  {
    pattern: ['งานค้าง', 'งานที่ยังไม่เสร็จ', 'งานที่เหลือ', 'งานที่ต้องทำ', 'งานที่รอ', 'ยังไม่มีงาน', 'หมดจดหมาย', 'ยังไม่ทำอะไรเลย', 'ยังมีอะไร', 'ต้องทำอะไร', 'มีอะไรบ้าง', 'จะมีอันไหน', 'รายการทั้งหมด', 'ดูงาน'],
    response: '💼 ดูงานค้างได้จากหน้าแรกเลยค่ะ:\n\n• แถบ Stats มุมซ้ายแสดงจำนวนงานค้าง\n• แถบ "ความคืบหน้าของคุณ" แสดง % ที่ทำให้แล้ว\n• แท็บ "รายการ" > ตัวกรอง "ค้างอยู่"\n\nหรือจะถามตรงๆ ก็ได้ค่ะ เช่น "ฉันมีงานกี่อัน?" ปุ๊กกี้บอกให้! 😊',
  },

  // === HOW MANY TASKS ===
  {
    pattern: ['มีกี่อัน', 'กี่งาน', 'ทั้งหมดเท่าไหร่', 'ทั้งหมดกี่', 'ทั้งหมดเท่าไหร่', 'มีงานไหม', 'มีงานรึเปล่า', 'มีอยู่เท่าไร', 'มีอยู่กี่อัน', 'มีงานอะไรบ้าง'],
    response: '📋 ดูจากแท็บ "รายการ" เลยน้า~ กดตัวกรอง "ทั้งหมด" เพื่อดูงานทุกชิ้น หรือกด "ค้างอยู่" เพื่อดูเฉพาะงานที่ยังไม่เสร็จค่ะ!',
  },

  // === OVERDUE ===
  {
    pattern: ['เกินกำหนด', 'เลยกำหนด', 'เกิน', 'สาย', 'ช้า', 'ไม่ทัน', 'missed'],
    response: '😅 งานที่เลยกำหนดส่งจะถูกขีดฆ่าและมีป้ายสีแดง "เลยกำหนด!" อยู่ข้างๆ ลองไปติ๊ก ✅ ถ้าทำเสร็จแล้ว หรือถ้ายังไม่ได้ทำก็รีบด่วนเลยค่ะ!',
  },

  // === SUBJECTS ===
  {
    pattern: ['หมวดหมู่', 'หมวด', 'subject', 'วิชา', 'วิยา', 'รายวิชา'],
    response: 'มี 8 หมวดให้เลือกค่ะ 📚\n📐 คณิตศาสตร์\n🔬 วิทยาศาสตร์\n📖 ภาษาไทย\n🌍 ภาษาอังกฤษ\n🏛️ สังคมศึกษา\n🎨 ศิลปะ\n⚽ สุขศึกษา\n📝 อื่นๆ',
  },

  // === HELP / HOW TO ===
  {
    pattern: ['วิธี', 'วิธีการ', 'อย่างไร', 'ยังไง', 'how', 'what', 'help', 'ช่วยเหลือ', 'ช่วยเหลือ', 'วิธีใช้', 'ใช้งาน', 'เริ่ม', 'first', 'newbie', ' newbie', 'มือใหม่', 'เริ่มต้น'],
    response: 'การใช้งานง่ายมากๆ เลย:\n1️⃣ กด "+ เพิ่มการบ้านใหม่"\n2️⃣ กรอกชื่องาน + เลือกหมวด\n3️⃣ ใส่วันกำหนดส่ง\n4️⃣ กด "บันทึกการบ้าน"\n5️⃣ เสร็จแล้วกดติ๊ก✅\n6️⃣ ดูปฏิทินเพื่อดูภาพรวม 📅\nลองทำตามนี้ดูนะ!' ,
  },

  // === STUDY TIPS ===
  {
    pattern: ['เรียน', 'เรียนยังไง', 'อ่านหนังสือ', 'จำ', 'เทคนิค', 'ทริค', 'ทิป', 'tip', 'pomodoro', 'โฟกัส', 'focus', 'จดจ่อ', 'เครียด', 'เหนื่อย', 'ทนไม่ไหว', 'อยากพัก', 'พัก'],
    response: '💡 ทริคการเรียน:\n\n🍅 Pomodoro: เรียน 25 นาที พัก 5 นาที (ทำ 4 รอบแล้วพักยาว)\n📝 เขียนสรุปเป็น mind map ช่วยจำได้ดีมาก\n🧠 อธิบายให้เพื่อนฟัง = วิธีจำที่ดีที่สุด\n💤 นอนให้พออย่างน้อย 7 ชั่วโมง\n🥤 ดื่มน้ำระหว่างอ่านหนังสือเยอะๆ\n\nสู้ๆ นะ! เราทำได้หมด! 💪',
  },

  // === PROGRESS / STATS ===
  {
    pattern: ['โปรเกรส', 'ความคืบหน้า', 'progress', 'สถิติ', 'stat', 'คะแนน', 'score', 'ทั้งหมด', 'ทั้งหมดเท่าไหร่', 'ทั้งหมดกี่อัน', 'กี่งาน', 'how many'],
    response: 'ดูที่แถบ "ความคืบหน้าของคุณ" หน้าแรกเลยค่ะ จะเห็นว่าทั้งหมดกี่งาน, เสร็จแล้วกี่งาน, ค้างอีกกี่งาน% ที่มุมขวาคือเปอร์เซ็นต์ความคืบหน้าค่ะ 📊',
  },

  // === ACHIEVEMENTS ===
  {
    pattern: ['ความสำเร็จ', 'achievement', 'badge', 'รางวัล', ' trophy', 'trophy', 'ดาว', 'star', 'medal'],
    response: 'กดแท็บ "รายการ" > เลื่อนลงล่างสุดค่ะ จะเห็น achievement ที่เราปลดล็อกแล้ว! เช่น เริ่มเพิ่มการบ้าน, ผ่าน 1 งาน, ผ่าน 5 งาน, ผ่าน 10 งาน! 🏆⭐',
  },

  // === THANK YOU ===
  {
    pattern: ['ขอบคุณ', 'คับคุน', 'คุนค่ะ', 'คุนครับ', 'tks', 'thanks', 'thank you', 'เยี่ยม', 'เจ๋ง', 'สุดยอด', 'โอเค', 'โอเคร', 'perfect', 'great'],
    response: 'ยินดีมากๆ เลยค่า~ 😊 ถ้ามีอะไรให้ปุ๊กกี้ช่วยอีก บอกมาได้เลยนะ ปุ๊กอยู่ที่นี่เสมอค่ะ 💖✨',
  },

  // === JOKE ===
  {
    pattern: ['ตลก', 'มุก', 'ฮา', 'หัวเราะ', 'joke', 'funny', 'ตลก'],
    response: '😂 มีเรื่องเล่าให้ฟังนะ:\n\nทำไมคอมพิวเตอร์ถึงชอบออกกำลังกาย?\nเพราะมันมี "mouse" (เมาส์) วิ่งเล่นตลอด! 🖱️\n\n555+ ฮาไหมล่ะ?',
  },

  // === ABOUT ===
  {
    pattern: ['คืออะไร', 'about', 'who are you', 'คุณคือใคร', 'เป็นใคร', 'ทำงานยังไง', 'ทำงานอย่างไร', 'ช่วยอะไรได้', 'ช่วยอะไรได้บ้าง', 'ทำอะไรได้', 'feature', 'features'],
    response: 'ปุ๊กกี้เป็นผู้ช่วยส่วนตัวค่ะ~ 💕 PinkReminder ช่วยจัดการการบ้าน:\n\n✅ เพิ่ม/ลบ/ติ๊กงาน\n📅 ดูปฏิทิน\n🔔 เตือนก่อนส่ง\n📊 ติดตามความคืบหน้า\n🏆 Achievement\n\nถามมาได้เลยนะ!' ,
  },

  // === DEFAULT / fallback with suggestions ===
  {
    pattern: [],
    isDefault: true,
    response: () => {
      const suggestions = [
        'ขอโทษค่ะ ปุ๊กกี้ยังไม่เข้าใจ 100% ลองพิมพ์สั้นๆ แบบนี้ดูน้า:',
        '',
        '📝 "วิธีเพิ่มการบ้าน"',
        '📅 "ดูปฏิทิน"',
        '✅ "ติ๊กงานเสร็จ"',
        '🔔 "แจ้งเตือน"',
        '💡 "ทริคการเรียน"',
        '🗑️ "ลบการบ้าน"',
        '📊 "ความคืบหน้า"',
        '',
        'พิมพ์คำถามสั้นๆ ปุ๊กกี้พยายามทำความเข้าใจนะ~ 🌸',
      ]
      return suggestions.join('\n')
    },
  },
]

function matchResponse(input) {
  const lower = input.toLowerCase().trim()

  // If empty, return default
  if (!lower) {
    const def = RESPONSE_CATEGORIES[RESPONSE_CATEGORIES.length - 1]
    return typeof def.response === 'function' ? def.response() : def.response
  }

  let bestScore = 0
  let bestCategory = null

  for (const cat of RESPONSE_CATEGORIES) {
    if (cat.isDefault) continue

    let score = 0
    for (const word of cat.pattern) {
      // Direct substring match — highest priority
      if (lower.includes(word)) {
        score += word.length * 2 // Direct match gets double weight
      }
      // Fuzzy: check if most characters match in order
      else {
        let wIdx = 0
        for (let i = 0; i < lower.length && wIdx < word.length; i++) {
          if (lower[i] === word[wIdx]) wIdx++
        }
        if (wIdx >= word.length * 0.8) { // 80% match threshold
          score += word.length * 1.2 // Fuzzy match bonus
        }
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestCategory = cat
    }
  }

  // Return matched or default
  const result = bestCategory || RESPONSE_CATEGORIES[RESPONSE_CATEGORIES.length - 1]
  return typeof result.response === 'function' ? result.response() : result.response
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const messagesEndRef = useState(null)[0]

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-dark to-pink shadow-xl shadow-pink-dark/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-fade-in ring-2 ring-white/50"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <ChatPanel onClose={() => setOpen(false)} />
      )}
    </>
  )
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีค่ะ~ ปุ๊กกี้ผู้ช่วยส่วนตัวนะคะ! ถามได้ทุกเรื่องน้า~ มีอะไรให้ช่วยคะ? 🌸', time: new Date() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now(), sender: 'user', text: trimmed, time: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const botText = matchResponse(trimmed)
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText, time: new Date() }])
      setTyping(false)
    }, 500 + Math.random() * 400)
  }

  const scrollDown = () => {
    setTimeout(() => {
      const container = document.getElementById('chat-messages-inner')
      if (container) container.scrollTop = container.scrollHeight
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div
        className="relative pointer-events-auto w-full max-w-lg h-[70vh] sm:max-h-[600px] bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up overflow-hidden border border-pink/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-dark/10 to-pink/10 border-b border-pink/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-dark to-pink flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-700">{BOT_NAME}</h3>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> ออนไลน์
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-pink-light/30 rounded-xl transition-colors active:scale-95">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div id="chat-messages-inner" className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-gradient-to-r from-pink-dark to-pink text-white' : 'bg-white/80 border border-pink/10 text-gray-700'} rounded-2xl px-4 py-3 shadow-sm whitespace-pre-line`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/80 border border-pink/10 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-dark/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-dark/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-dark/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          className="absolute bottom-20 right-6 w-8 h-8 rounded-full bg-pink/20 flex items-center justify-center hover:bg-pink/40 transition-colors"
        >
          <svg className="w-4 h-4 text-pink-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Input */}
        <div className="px-6 py-4 border-t border-pink/20 bg-white/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 px-5 py-3 rounded-xl border-2 border-pink/20 focus:border-pink-dark outline-none text-sm bg-white/60 backdrop-blur-sm transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                input.trim() ? 'bg-gradient-to-r from-pink-dark to-pink text-white shadow-lg shadow-pink-dark/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
