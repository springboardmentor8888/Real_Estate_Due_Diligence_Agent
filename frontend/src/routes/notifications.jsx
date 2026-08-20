// src/routes/notifications.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { Bell, FileText, AlertTriangle, CheckCircle, Clock, X, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationService } from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      const list = Array.isArray(res.data) ? res.data : [];
      setNotifications(list);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        (n.notificationId === id || n.id === id) ? { ...n, isRead: true, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => (n.notificationId !== id && n.id !== id)));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'report': return <FileText className="h-5 w-5 text-emerald-600" />;
      case 'alert':
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
      case 'property': return <Building2 className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'report': return 'bg-emerald-500/10';
      case 'alert':
      case 'warning': return 'bg-red-500/10';
      case 'info':
      case 'property': return 'bg-blue-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Notifications" 
        subtitle={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
        actions={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              Mark All as Read
            </button>
          )
        }
      />

      <div className="space-y-4">
        {notifications.map((item, index) => {
          const notifId = item.notificationId || item.id;
          const isUnread = !item.isRead && !item.read;
          return (
            <motion.div
              key={notifId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border ${
                isUnread ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getTypeColor(item.notificationType || item.type)} shrink-0`}>
                  {getIcon(item.notificationType || item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5">New</Badge>
                      )}
                      <button 
                        onClick={() => deleteNotification(notifId)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTime(item.sentAt || item.time)}
                    </span>
                    {isUnread && (
                      <button 
                        onClick={() => markAsRead(notifId)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">No notifications</h3>
            <p className="text-slate-500">You're all caught up! No notifications in database.</p>
          </div>
        )}
      </div>
    </>
  );
}