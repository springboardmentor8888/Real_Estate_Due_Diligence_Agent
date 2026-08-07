// src/routes/notifications.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/app-shell';
import { FileText, AlertTriangle, CheckCircle2, X, Clock, Bell } from 'lucide-react';

export default function Notifications() {
  const [alerts, setAlerts] = useState([
    { id: 1, icon: FileText, title: 'Due Diligence Report Ready', desc: 'Report for 425 Market Street is complete and ready for review.', time: '12 minutes ago', color: 'bg-slate-100 text-slate-600' },
    { id: 2, icon: AlertTriangle, title: 'High Risk Alert', desc: 'Property 888 Michigan Ave has a new lien filed. Review immediately.', time: '1 hour ago', color: 'bg-red-50 text-red-500' },
    { id: 3, icon: CheckCircle2, title: 'Document Uploaded', desc: 'Title report v2 uploaded for property P-10243.', time: '3 hours ago', color: 'bg-blue-50 text-blue-500' },
  ]);

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts([]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader 
        title="Notifications" 
        subtitle={`${alerts.length} unread notifications`}
        actions={
          alerts.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="bg-white border border-slate-300 text-slate-700 font-medium px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              Mark All as Read
            </button>
          )
        }
      />

      <div className="space-y-4">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm"
            >
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800">All caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">No new notifications at the moment.</p>
            </motion.div>
          ) : (
            alerts.map((alert) => (
              <motion.div 
                key={alert.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, x: 100 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative group"
              >
                <div className="flex items-start gap-4 pr-8">
                  <div className={`p-3 rounded-xl ${alert.color} shrink-0`}>
                    <alert.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{alert.desc}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {alert.time}
                      </span>
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
                        Mark as read
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* ✅ Visible Close Button */}
                <button 
                  onClick={() => removeAlert(alert.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}