"use client"

import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { NotificationContext } from "../context/NotificationContext"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [readLoading, setReadLoading] = useState(null)
  const [filter, setFilter] = useState("all") // all, unread, read

  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")
  const baseURL = process.env.REACT_APP_BASE_URL

  const { updateNotificationCount } = useContext(NotificationContext)

  const fetchNotifications = () => {
    if (!userId || !token) return
    setLoading(true)

    axios
      .get(`${baseURL}/api/notifications/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotifications(res.data)
        const unread = res.data.filter((n) => !n.read).length
        updateNotificationCount(unread)
      })
      .catch((err) => console.error("Failed to load notifications", err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = (id) => {
    setReadLoading(id)
    axios
      .put(
        `${baseURL}/api/notifications/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        setNotifications(updated)
        updateNotificationCount(updated.filter((n) => !n.read).length)
      })
      .catch((err) => console.error("Failed to mark as read", err))
      .finally(() => setReadLoading(null))
  }

  const deleteNotification = (id) => {
    setDeleteLoading(id);
  
    console.log("Sending token for DELETE:", token); // ✅ Properly placed log
  
    axios.delete(`${baseURL}/api/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
      // ✅ You can safely remove `withCredentials` since you're not using cookies
    })
      .then(() => {
        const updated = notifications.filter((n) => n.id !== id);
        setNotifications(updated);
        updateNotificationCount(updated.filter((n) => !n.read).length);
      })
      .catch((err) => console.error("Failed to delete notification", err))
      .finally(() => setDeleteLoading(null));
  }
  

  const getNotificationIcon = (type) => {
    const iconClass = "h-6 w-6"

    switch (type?.toLowerCase()) {
      case "appointment_reminder":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )
      case "appointment_confirmation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "appointment_cancellation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "system_update":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )
    }
  }

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case "appointment_reminder":
        return "text-blue-600 bg-blue-100"
      case "appointment_confirmation":
        return "text-green-600 bg-green-100"
      case "appointment_cancellation":
        return "text-red-600 bg-red-100"
      case "system_update":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatNotificationType = (type) => {
    if (!type) return "Notification"
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    if (filter === "read") return notif.read
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notifications
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "read"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h2>
            <p className="text-gray-500">When you receive notifications, they will appear here. Check back later!</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No {filter} notifications</h2>
            <p className="text-gray-500">
              {filter === "unread"
                ? "You have no unread notifications at the moment."
                : "You have no read notifications to display."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all ${
                  !notif.read ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mr-4 ${getNotificationColor(notif.type)}`}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">{formatNotificationType(notif.type)}</h3>
                        <span className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{notif.message}</p>
                      <div className="flex justify-end space-x-2">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            disabled={readLoading === notif.id}
                            className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center"
                          >
                            {readLoading === notif.id ? (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          disabled={deleteLoading === notif.id}
                          className="text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
                        >
                          {deleteLoading === notif.id ? (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
