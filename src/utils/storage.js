const STORAGE_KEYS = {
  TASKS: 'pinkreminder_tasks',
  USER: 'pinkreminder_user',
  NOTIFICATIONS_SEEN: 'pinkreminder_notifications_seen',
}

export function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS)
    if (!raw) return []
    const tasks = JSON.parse(raw)
    if (!Array.isArray(tasks)) return []
    return tasks.filter(t => t && t.id && typeof t.title === 'string')
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  } catch {}
}

// Get all tasks belonging to a user by username
export function getUserTasks(username) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASK_MAP)
    if (!raw) return []
    const map = JSON.parse(raw)
    if (!map || !Array.isArray(map[username])) return []
    // Fetch and validate
    return getTasks().filter(t => map[username].includes(t.id))
  } catch {
    return []
  }
}

// Save a task id under a username in the map
export function addUserTaskId(username, taskId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASK_MAP)
    const map = raw ? JSON.parse(raw) : {}
    if (!Array.isArray(map[username])) map[username] = []
    if (!map[username].includes(taskId)) map[username].push(taskId)
    localStorage.setItem(STORAGE_KEYS.TASK_MAP, JSON.stringify(map))
  } catch {}
}

// Clear all tasks for a username
export function clearUserTasks(username) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASK_MAP)
    if (!raw) return
    const map = JSON.parse(raw)
    delete map[username]
    localStorage.setItem(STORAGE_KEYS.TASK_MAP, JSON.stringify(map))
  } catch {}
}

// Switch to a different user's tasks
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(username) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(username))
  } catch {}
}

export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null
    const u = JSON.parse(raw)
    if (u && typeof u.name === 'string') return u
    return null
  } catch {
    return null
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name: user.name, loggedInAt: user.loggedInAt }))
  } catch {}
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function getSeenNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_SEEN)
    if (!raw) return {}
    const seen = JSON.parse(raw)
    if (typeof seen !== 'object' || Array.isArray(seen)) return {}
    return seen
  } catch {
    return {}
  }
}

export function markNotificationSeen(notificationId) {
  const seen = getSeenNotifications()
  seen[notificationId] = true
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_SEEN, JSON.stringify(seen))
}

export function isNotificationSeen(notificationId) {
  const seen = getSeenNotifications()
  return !!seen[notificationId]
}

// Get days until alert based on type
function getAlertDays(type) {
  switch (type) {
    case 'homework': return 2
    case 'group': return 7
    case 'project': return 30
    default: return 2 // default to homework
  }
}

// Get urgent tasks (due based on type, not completed)
export function getUrgentTasks() {
  const tasks = getTasks()
  const now = new Date().getTime()

  return tasks
    .filter((task) => {
      if (task.completed) return false
      const dueTime = new Date(task.dueDate).getTime()
      const alertDays = getAlertDays(task.type)
      const alertMs = alertDays * 24 * 60 * 60 * 1000
      return dueTime - now <= alertMs && dueTime - now >= 0
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}

// Check for upcoming tasks and return notification messages
export function getUpcomingNotifications(today = new Date()) {
  const tasks = getTasks()
  const now = today.getTime()

  return tasks
    .filter((task) => {
      if (!task.dueDate || task.completed) return false
      const dueTime = new Date(task.dueDate).getTime()
      const diff = dueTime - now
      const alertDays = getAlertDays(task.type)
      const oneDay = 24 * 60 * 60 * 1000
      const alertMs = alertDays * oneDay
      // Notification if due within alert period but not yet past
      return diff >= 0 && diff <= alertMs
    })
    .map((task) => {
      const alertDays = getAlertDays(task.type)
      let message
      if (alertDays === 2) message = `เหลือเวลาส่ง "${task.title}" อีก 2 วัน!`
      else if (alertDays === 7) message = `เหลือเวลาส่ง "${task.title}" อีก 1 สัปดาห์!`
      else if (alertDays === 30) message = `เหลือเวลาส่ง "${task.title}" อีก 1 เดือน!`
      else message = `เหลือเวลาส่ง "${task.title}" ไม่ถึง ${alertDays} วันแล้ว!`
      return {
        id: `notif_${task.id}_${new Date().toDateString()}`,
        taskId: task.id,
        title: task.title,
        dueDate: task.dueDate,
        message,
      }
    })
}

// Format date for display
export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

  if (taskDate.getTime() === todayDate.getTime()) return 'วันนี้'
  if (taskDate.getTime() === tomorrowDate.getTime()) return 'พรุ่งนี้'

  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`
}

// Get days remaining
export function getDaysRemaining(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due - now) / (24 * 60 * 60 * 1000))
  return diff
}
