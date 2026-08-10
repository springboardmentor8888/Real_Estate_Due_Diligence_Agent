import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  ShieldCheck,
  Shield,
  Users,
  Building2,
  Scale,
  Landmark,
  Eye,
  Edit,
  UserPlus,
  UserMinus,
  Check,
  X,
  Lock,
  Key,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";

// 5 MASTER ROLES WITH REALISTIC PERMISSIONS & USER COUNTS
const INITIAL_ROLES = [
  {
    id: "role-admin",
    name: "Administrator",
    icon: ShieldCheck,
    color: "cyan",
    userCount: 12,
    badgeVariant: "info",
    description: "Full platform command access, user management, global security configurations, system telemetry, and audit log overrides.",
    permissions: [
      "ALL_SYSTEM_ACCESS",
      "USER_MANAGEMENT_WRITE",
      "ROLE_PERMISSION_MANAGE",
      "AUDIT_LOG_READ_WRITE",
      "TELEMETRY_EXPORT",
      "SECURITY_POLICY_OVERRIDE",
    ],
    availablePermissions: [
      "ALL_SYSTEM_ACCESS",
      "USER_MANAGEMENT_WRITE",
      "ROLE_PERMISSION_MANAGE",
      "AUDIT_LOG_READ_WRITE",
      "TELEMETRY_EXPORT",
      "SECURITY_POLICY_OVERRIDE",
      "DATABASE_SNAPSHOT_BACKUP",
      "SUB_REGISTRAR_API_SYNC",
    ],
  },
  {
    id: "role-buyer",
    name: "Buyer",
    icon: Building2,
    color: "blue",
    userCount: 520,
    badgeVariant: "primary",
    description: "Search property records, inspect due diligence title reports, save watchlists, and request legal encumbrance reviews.",
    permissions: [
      "PROPERTY_SEARCH_READ",
      "TITLE_REPORT_VIEW",
      "WATCHLIST_MANAGE",
      "REQUEST_LEGAL_REVIEW",
      "DOWNLOAD_AUDIT_PDF",
    ],
    availablePermissions: [
      "PROPERTY_SEARCH_READ",
      "TITLE_REPORT_VIEW",
      "WATCHLIST_MANAGE",
      "REQUEST_LEGAL_REVIEW",
      "DOWNLOAD_AUDIT_PDF",
      "PROPERTY_VALUATION_CALCULATOR",
      "INVESTMENT_YIELD_SIMULATOR",
    ],
  },
  {
    id: "role-agent",
    name: "Real Estate Agent",
    icon: Key,
    color: "purple",
    userCount: 340,
    badgeVariant: "primary",
    description: "List property parcels, upload land survey deeds, manage buyer leads, schedule site inspections, and track client inquiries.",
    permissions: [
      "PROPERTY_LISTING_CREATE",
      "CLIENT_LEAD_MANAGE",
      "SURVEY_DEED_UPLOAD",
      "SITE_VISIT_SCHEDULE",
      "COMPARABLE_PROPERTIES_READ",
    ],
    availablePermissions: [
      "PROPERTY_LISTING_CREATE",
      "CLIENT_LEAD_MANAGE",
      "SURVEY_DEED_UPLOAD",
      "SITE_VISIT_SCHEDULE",
      "COMPARABLE_PROPERTIES_READ",
      "BULK_PARCEL_IMPORT",
      "DEED_CHAIN_BUILDER",
    ],
  },
  {
    id: "role-legal",
    name: "Legal Reviewer",
    icon: Scale,
    color: "amber",
    userCount: 240,
    badgeVariant: "warning",
    description: "Execute 30-year Sub-Registrar encumbrance searches, issue legal title verification certificates, and audit litigation records.",
    permissions: [
      "ENCUMBRANCE_DEED_AUDIT",
      "LEGAL_CERTIFICATE_ISSUE",
      "LITIGATION_SEARCH_READ",
      "TITLE_CHAIN_VERIFY",
      "MUNICIPAL_TAX_LEDGER_CHECK",
    ],
    availablePermissions: [
      "ENCUMBRANCE_DEED_AUDIT",
      "LEGAL_CERTIFICATE_ISSUE",
      "LITIGATION_SEARCH_READ",
      "TITLE_CHAIN_VERIFY",
      "MUNICIPAL_TAX_LEDGER_CHECK",
      "COURT_STAY_ORDER_FLAG",
      "DIGITAL_SEAL_CERTIFICATION",
    ],
  },
  {
    id: "role-financial",
    name: "Financial Institution",
    icon: Landmark,
    color: "emerald",
    userCount: 184,
    badgeVariant: "success",
    description: "Assess collateral risk scores, verify municipal tax clearance, review mortgage loan requests, and generate underwriting reports.",
    permissions: [
      "COLLATERAL_VALUATION_READ",
      "RISK_SCORE_ASSESSMENT",
      "LOAN_APPLICATION_REVIEW",
      "TAX_CLEARANCE_VERIFY",
      "UNDERWRITING_REPORT_GENERATE",
    ],
    availablePermissions: [
      "COLLATERAL_VALUATION_READ",
      "RISK_SCORE_ASSESSMENT",
      "LOAN_APPLICATION_REVIEW",
      "TAX_CLEARANCE_VERIFY",
      "UNDERWRITING_REPORT_GENERATE",
      "DSCR_SIMULATOR_WRITE",
      "PORTFOLIO_EXPOSURE_ANALYTICS",
    ],
  },
];

// Sample Users for Assign / Remove Role Modals
const MOCK_USERS_LIST = [
  { name: "V Bharath", email: "bharath@gmail.com", role: "Administrator" },
  { name: "Rama Charan", email: "ramacharan@enterprise.com", role: "Buyer" },
  { name: "Ananya Rao", email: "ananya.agent@realtyprime.in", role: "Real Estate Agent" },
  { name: "Adv. Rajesh Sharma", email: "rajesh.legal@lexjuris.in", role: "Legal Reviewer" },
  { name: "Venkatesh Iyer", email: "venkatesh.iyer@hdfc.com", role: "Financial Institution" },
];

function RoleManagement() {
  const [roles, setRoles] = useState(INITIAL_ROLES);

  // Modal Control States
  const [viewPermissionsRole, setViewPermissionsRole] = useState(null);
  const [editPermissionsRole, setEditPermissionsRole] = useState(null);
  const [assignRoleTarget, setAssignRoleTarget] = useState(null);
  const [removeRoleTarget, setRemoveRoleTarget] = useState(null);

  // Edit Permissions State
  const [tempPermissions, setTempPermissions] = useState([]);
  const [selectedUserToAssign, setSelectedUserToAssign] = useState(MOCK_USERS_LIST[0].email);
  const [selectedUserToRemove, setSelectedUserToRemove] = useState(MOCK_USERS_LIST[0].email);

  // Open Edit Modal
  const handleOpenEditPermissions = (role) => {
    setEditPermissionsRole(role);
    setTempPermissions([...role.permissions]);
  };

  const handleTogglePermission = (perm) => {
    if (tempPermissions.includes(perm)) {
      setTempPermissions(tempPermissions.filter((p) => p !== perm));
    } else {
      setTempPermissions([...tempPermissions, perm]);
    }
  };

  const handleSavePermissions = (e) => {
    e.preventDefault();
    setRoles((prev) =>
      prev.map((r) =>
        r.id === editPermissionsRole.id ? { ...r, permissions: tempPermissions } : r
      )
    );
    showSuccessAlert(
      "Permissions Updated (UI Only)",
      `Updated ${tempPermissions.length} permissions for role '${editPermissionsRole.name}'.`
    );
    setEditPermissionsRole(null);
  };

  const handleAssignRoleSubmit = (e) => {
    e.preventDefault();
    const userObj = MOCK_USERS_LIST.find((u) => u.email === selectedUserToAssign);
    setRoles((prev) =>
      prev.map((r) =>
        r.id === assignRoleTarget.id ? { ...r, userCount: r.userCount + 1 } : r
      )
    );
    showSuccessAlert(
      "Role Assigned",
      `Assigned role '${assignRoleTarget.name}' to user ${userObj ? userObj.name : selectedUserToAssign}.`
    );
    setAssignRoleTarget(null);
  };

  const handleRemoveRoleSubmit = (e) => {
    e.preventDefault();
    const userObj = MOCK_USERS_LIST.find((u) => u.email === selectedUserToRemove);
    setRoles((prev) =>
      prev.map((r) =>
        r.id === removeRoleTarget.id ? { ...r, userCount: Math.max(0, r.userCount - 1) } : r
      )
    );
    showToast(
      `Removed role '${removeRoleTarget.name}' from user ${userObj ? userObj.name : selectedUserToRemove}`,
      "info"
    );
    setRemoveRoleTarget(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold mb-2">
              <ShieldCheck size={14} /> RBAC Access Control & Role Registry
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Role Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure access levels, granular permission matrixes, and assign/remove roles across all 5 enterprise user tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800">
              5 SYSTEM ROLES
            </span>
          </div>
        </div>

        {/* 5 ROLES CARDS CONTAINER */}
        <div className="space-y-4">
          {roles.map((role) => {
            const IconComp = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 transition-all hover:border-blue-500/40"
              >
                {/* ROLE HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#334155]">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-blue-600 dark:text-cyan-400 shrink-0">
                      <IconComp size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          {role.name}
                        </h2>
                        <Badge variant={role.badgeVariant}>{role.userCount} Active Users</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-3xl">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {/* 4 REQUIRED ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* 1. VIEW PERMISSIONS */}
                    <button
                      onClick={() => setViewPermissionsRole(role)}
                      className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span>View Permissions</span>
                    </button>

                    {/* 2. EDIT PERMISSIONS (UI ONLY) */}
                    <button
                      onClick={() => handleOpenEditPermissions(role)}
                      className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit size={14} />
                      <span>Edit Permissions</span>
                    </button>

                    {/* 3. ASSIGN ROLE */}
                    <button
                      onClick={() => setAssignRoleTarget(role)}
                      className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      <span>Assign Role</span>
                    </button>

                    {/* 4. REMOVE ROLE */}
                    <button
                      onClick={() => setRemoveRoleTarget(role)}
                      className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserMinus size={14} />
                      <span>Remove Role</span>
                    </button>
                  </div>
                </div>

                {/* PERMISSIONS BADGES GRID */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Granted Permissions ({role.permissions.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#334155] font-bold text-[10px] flex items-center gap-1"
                      >
                        <Lock size={11} className="text-blue-500" />
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MODAL 1: VIEW PERMISSIONS */}
        <AnimatePresence>
          {viewPermissionsRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-500" /> Permissions Matrix ({viewPermissionsRole.name})
                  </h3>
                  <button onClick={() => setViewPermissionsRole(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Role <strong className="text-slate-900 dark:text-white">{viewPermissionsRole.name}</strong> currently holds the following {viewPermissionsRole.permissions.length} active permissions:
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {viewPermissionsRole.permissions.map((p, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Check size={14} className="text-emerald-500" /> {p}
                        </span>
                        <Badge variant="success">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={() => setViewPermissionsRole(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Close</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: EDIT PERMISSIONS (UI ONLY) */}
        <AnimatePresence>
          {editPermissionsRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleSavePermissions}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit size={18} className="text-amber-500" /> Edit Permissions: {editPermissionsRole.name} (UI Only)
                  </h3>
                  <button type="button" onClick={() => setEditPermissionsRole(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Toggle Available Permissions:
                  </span>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {editPermissionsRole.availablePermissions.map((perm) => {
                      const isChecked = tempPermissions.includes(perm);
                      return (
                        <label
                          key={perm}
                          onClick={() => handleTogglePermission(perm)}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-cyan-300"
                              : "bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#334155] text-slate-500"
                          }`}
                        >
                          <span className="font-bold">{perm}</span>
                          <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded cursor-pointer" />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditPermissionsRole(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">Save Permissions (UI)</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 3: ASSIGN ROLE */}
        <AnimatePresence>
          {assignRoleTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleAssignRoleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus size={18} className="text-emerald-500" /> Assign Role ({assignRoleTarget.name})
                  </h3>
                  <button type="button" onClick={() => setAssignRoleTarget(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-500 dark:text-slate-400">
                    Select an existing user to assign the <strong className="text-slate-900 dark:text-white">{assignRoleTarget.name}</strong> role:
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Account</label>
                    <select
                      value={selectedUserToAssign}
                      onChange={(e) => setSelectedUserToAssign(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold"
                    >
                      {MOCK_USERS_LIST.map((u) => (
                        <option key={u.email} value={u.email}>
                          {u.name} ({u.email}) - Current: {u.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setAssignRoleTarget(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer">Confirm Assignment</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 4: REMOVE ROLE */}
        <AnimatePresence>
          {removeRoleTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleRemoveRoleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserMinus size={18} className="text-rose-500" /> Remove Role ({removeRoleTarget.name})
                  </h3>
                  <button type="button" onClick={() => setRemoveRoleTarget(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-500 dark:text-slate-400">
                    Select a user to unassign from the <strong className="text-slate-900 dark:text-white">{removeRoleTarget.name}</strong> role:
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Account</label>
                    <select
                      value={selectedUserToRemove}
                      onChange={(e) => setSelectedUserToRemove(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold"
                    >
                      {MOCK_USERS_LIST.map((u) => (
                        <option key={u.email} value={u.email}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setRemoveRoleTarget(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-rose-600 text-white font-bold cursor-pointer">Remove Role</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default RoleManagement;
