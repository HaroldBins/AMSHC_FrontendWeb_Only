"use client"

import { createContext, useState } from "react"

export const NotificationContext = createContext({
  notificationCount: 0,
  updateNotificationCount: (count) => {},
})

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0)

  const updateNotificationCount = (count) => {
    setNotificationCount(count)
  }

  const value = {
    notificationCount,
    updateNotificationCount,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
