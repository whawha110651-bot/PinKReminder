import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTasks, saveTasks, getUser, saveUser, clearUser } from '../utils/storage'

const AppContext = createContext(null)

const ACCOUNTS_KEY = 'pinkreminder_accounts'

function generateAccountKey(n, d) {
  const combined = `${n.trim().toLowerCase()}_${d}`
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const num = Math.abs(hash).toString(36).toUpperCase()
  return `PR-${num}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
}

function loadAccountsMap() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveAccountsMap(map) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map))
  } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return getUser(); } catch { return null; }
  })
  const [tasks, setTasks] = useState(() => {
    try { return getTasks(); } catch { return []; }
  })
  const [notifications, setNotifications] = useState([])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try { saveTasks(tasks); } catch {}
  }, [tasks])

  const login = useCallback((username, dob, accountKey) => {
    const userData = { name: username, loggedInAt: new Date().toISOString(), dob, accountKey }
    setUser(userData)
    try { saveUser(userData); } catch {}

    // Save account key mapping for lookup later
    const map = loadAccountsMap()
    map[username.trim().toLowerCase()] = accountKey
    saveAccountsMap(map)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearUser()
  }, [])

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const toggleTask = useCallback((taskId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const dismissNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  const value = {
    user, tasks, notifications, login, logout, addTask, toggleTask, deleteTask, dismissNotification,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { generateAccountKey, loadAccountsMap, saveAccountsMap, ACCOUNTS_KEY }
