import React, { useState } from "react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <p className="mt-1 text-slate-500">
        Manage your account and application preferences.
      </p>

      {/* Account Settings */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Settings
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={user.name || ""}
              readOnly
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>

            <input
              type="text"
              value={
                localStorage.getItem("role") ||
                localStorage.getItem("userRole") ||
                ""
              }
              readOnly
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>

        <div className="mt-4 space-y-5">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Email Notifications</p>

              <p className="text-sm text-slate-500">
                Receive updates about your activities.
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Risk Alerts</p>

              <p className="text-sm text-slate-500">
                Receive alerts when high-risk properties are detected.
              </p>
            </div>

            <input
              type="checkbox"
              checked={riskAlerts}
              onChange={(e) => setRiskAlerts(e.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </div>

      {/* Application */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">Application</h2>

        <div className="mt-4">
          <p className="text-sm text-slate-500">Application Version</p>

          <p className="font-medium text-slate-800">
            Real Estate Due Diligence Agent v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
