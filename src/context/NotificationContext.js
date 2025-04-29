import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, updateNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
