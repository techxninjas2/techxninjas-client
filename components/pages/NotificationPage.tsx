import React, { useEffect, useState } from 'react';
import { Bell, Inbox, CheckCircle } from 'lucide-react';
import usePageTitle from '../usePageTitle';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Welcome to TechXNinjas!',
    message: 'Thanks for joining our community. Stay tuned for updates.',
    read: false,
    date: '2024-06-22T10:00:00Z',
  },
  {
    id: 2,
    title: 'Event Reminder',
    message: 'Don’t forget to register for the upcoming hackathon!',
    read: true,
    date: '2024-06-20T15:30:00Z',
  },
];

const NotificationPage: React.FC = () => {
  usePageTitle('Notifications');
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(mockNotifications);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Bell className="w-8 h-8 text-brand-primary mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        {notifications === null ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Inbox className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 ${notif.read ? 'border-gray-300 dark:border-gray-700' : 'border-brand-primary'}`}
              >
                <div className="flex items-center mb-1">
                  {notif.read ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <Bell className="w-5 h-5 text-brand-primary mr-2" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">{notif.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{new Date(notif.date).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{notif.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage; 