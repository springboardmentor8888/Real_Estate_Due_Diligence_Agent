// src/routes/settings.jsx
import React, { useState } from 'react';
import { PageHeader } from '../components/app-shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Bell, Moon, Sun, Globe, Lock, Key, Shield, 
  Mail, Monitor, Save, CheckCircle, 
  Smartphone, Tablet, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reportAlerts: true,
    riskAlerts: true,
    marketingEmails: false,
    theme: 'light',
    language: 'en',
    twoFactorAuth: false,
    sessionTimeout: '30',
    defaultView: 'dashboard',
    dateFormat: 'MM/DD/YYYY',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1500);
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  // src/routes/settings.jsx - Add dark mode toggle
const toggleTheme = (theme) => {
  updateSetting('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};


  return (
    <>
      <PageHeader 
        title="Settings" 
        subtitle="Customize your application preferences"
      />

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 px-3">Settings</h3>
            <nav className="space-y-1">
              {[
                { icon: Bell, label: 'Notifications', id: 'notifications' },
                { icon: Monitor, label: 'Appearance', id: 'appearance' },
                { icon: Shield, label: 'Security', id: 'security' },
                { icon: Globe, label: 'Preferences', id: 'preferences' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <div id="notifications" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Report Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when reports are ready</p>
                </div>
                <Switch
                  checked={settings.reportAlerts}
                  onCheckedChange={(checked) => updateSetting('reportAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Risk Alerts</p>
                  <p className="text-sm text-gray-500">Get notified about risk changes</p>
                </div>
                <Switch
                  checked={settings.riskAlerts}
                  onCheckedChange={(checked) => updateSetting('riskAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive product updates and offers</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div id="appearance" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => updateSetting('theme', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" /> Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" /> Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" /> System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting('language', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div id="security" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</Label>
                <Select
                  value={settings.sessionTimeout}
                  onValueChange={(value) => updateSetting('sessionTimeout', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div id="preferences" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Default View</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value) => updateSetting('defaultView', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) => updateSetting('dateFormat', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}