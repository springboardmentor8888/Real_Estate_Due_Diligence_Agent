// src/routes/notifications.jsx
import React, { useState } from 'react';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { Bell, FileText, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'report',
      title: 'Due Diligence Report Ready',
      message: 'Report for 425 Market Street is complete and ready for review.',
      time: '12 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'alert',
      title: 'High Risk Alert',
      message: 'Property 888 Michigan Ave has a new lien filed. Review immediately.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Document Uploaded',
      message: 'Title report v2 uploaded for property P-10243.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Watchlist Update',
      message: '2100 Ross Avenue has been sold at $38.9M.',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 5,
      type: 'report',
      title: 'Weekly Digest',
      message: '12 new reports generated across your portfolio this week.',
      time: '2 days ago',
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'report': return <FileText className="h-5 w-5 text-emerald-600" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'report': return 'bg-emerald-500/10';
      case 'alert': return 'bg-red-500/10';
      case 'info': return 'bg-blue-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <PageHeader 
        title="Notifications" 
        subtitle={`${unreadCount} unread notifications`}
        actions={
          unreadCount > 0 && (
            // ✅ GREEN VISIBLE BUTTON
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
        {notifications.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border ${
              !item.read ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getTypeColor(item.type)} shrink-0`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!item.read && (
                      <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5">New</Badge>
                    )}
                    <button 
                      onClick={() => deleteNotification(item.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.time}
                  </span>
                  {!item.read && (
                    <button 
                      onClick={() => markAsRead(item.id)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">No notifications</h3>
            <p className="text-slate-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </>
  );
}