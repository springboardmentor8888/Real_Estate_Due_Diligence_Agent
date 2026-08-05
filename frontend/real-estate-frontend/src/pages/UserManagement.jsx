import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Key,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Mail,
  Phone,
  Calendar,
  Clock,
  X,
  Check,
  ShieldCheck,
  Download,
  RotateCcw,
} from "lucide-react";
import { showErrorAlert, showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";

// CENTRALIZED MOCK USERS DATASET (12 Enterprise Users)
const INITIAL_USERS = [
  {
    id: "USR-1001",
    name: "V Bharath",
    email: "bharath@gmail.com",
    role: "Administrator",
    phone: "+91 98765 43210",
    status: "Active",
    lastLogin: "Today at 09:42 AM",
    createdDate: "01 Jan 2026",
    organization: "Apex Due Diligence Admin",
  },
  {
    id: "USR-1002",
    name: "Rama Charan",
    email: "ramacharan@enterprise.com",
    role: "Buyer",
    phone: "+91 98123 45678",
    status: "Active",
    lastLogin: "Yesterday at 04:20 PM",
    createdDate: "10 Jan 2026",
    organization: "Charan Infra Investments",
  },
  {
    id: "USR-1003",
    name: "Ananya Rao",
    email: "ananya.agent@realtyprime.in",
    role: "Real Estate Agent",
    phone: "+91 97654 32109",
    status: "Active",
    lastLogin: "Today at 08:15 AM",
    createdDate: "15 Jan 2026",
    organization: "Prime Hyderabad Realty",
  },
  {
    id: "USR-1004",
    name: "Adv. Rajesh Sharma",
    email: "rajesh.legal@lexjuris.in",
    role: "Legal Reviewer",
    phone: "+91 96543 21098",
    status: "Active",
    lastLogin: "Today at 10:05 AM",
    createdDate: "20 Jan 2026",
    organization: "LexJuris Legal Auditors",
  },
  {
    id: "USR-1005",
    name: "Venkatesh Iyer",
    email: "venkatesh.iyer@hdfc.com",
    role: "Financial Institution",
    phone: "+91 95432 10987",
    status: "Active",
    lastLogin: "04 Aug 2026 at 02:30 PM",
    createdDate: "25 Jan 2026",
    organization: "HDFC Commercial Capital",
  },
  {
    id: "USR-1006",
    name: "Aditi Deshmukh",
    email: "aditi.admin@apex.in",
    role: "Administrator",
    phone: "+91 94321 09876",
    status: "Active",
    lastLogin: "03 Aug 2026 at 05:10 PM",
    createdDate: "01 Feb 2026",
    organization: "Apex Enterprise IT",
  },
  {
    id: "USR-1007",
    name: "Suresh Reddy",
    email: "suresh.reddy@deccan.com",
    role: "Buyer",
    phone: "+91 93210 98765",
    status: "Inactive",
    lastLogin: "28 Jul 2026 at 11:45 AM",
    createdDate: "10 Feb 2026",
    organization: "Deccan Capital Group",
  },
  {
    id: "USR-1008",
    name: "Priya Sundaram",
    email: "priya.s@southrealty.in",
    role: "Real Estate Agent",
    phone: "+91 92109 87654",
    status: "Active",
    lastLogin: "Today at 07:50 AM",
    createdDate: "18 Feb 2026",
    organization: "South Realty Brokers",
  },
  {
    id: "USR-1009",
    name: "Adv. Kavitah Pillai",
    email: "kavitha@highcourt.gov.in",
    role: "Legal Reviewer",
    phone: "+91 91098 76543",
    status: "Active",
    lastLogin: "02 Aug 2026 at 03:15 PM",
    createdDate: "22 Feb 2026",
    organization: "High Court Registry Audit",
  },
  {
    id: "USR-1010",
    name: "Vikramaditya Singhania",
    email: "vikram@singhaniacap.in",
    role: "Financial Institution",
    phone: "+91 90987 65432",
    status: "Suspended",
    lastLogin: "15 Jul 2026 at 01:20 PM",
    createdDate: "05 Mar 2026",
    organization: "Singhania Credit Union",
  },
  {
    id: "USR-1011",
    name: "Nikhil Agarwal",
    email: "nikhil@agarwalestates.in",
    role: "Buyer",
    phone: "+91 89876 54321",
    status: "Active",
    lastLogin: "Yesterday at 09:10 PM",
    createdDate: "12 Mar 2026",
    organization: "Agarwal Commercial Logistics",
  },
  {
    id: "USR-1012",
    name: "Dr. Meenakshi Sundaram",
    email: "meenakshi@icici.com",
    role: "Financial Institution",
    phone: "+91 88765 43210",
    status: "Active",
    lastLogin: "Today at 08:40 AM",
    createdDate: "28 Mar 2026",
    organization: "ICICI Real Estate Fund",
  },
];

function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal Controls
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Buyer",
    phone: "+91 ",
    status: "Active",
    organization: "",
  });

  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.organization.toLowerCase().includes(q);

      const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
      const matchesStatus = selectedStatus === "ALL" || u.status === selectedStatus;

      return matchesQuery && matchesRole && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortBy] || "";
      let valB = b[sortBy] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, sortBy, sortOrder]);

  // Pagination Math
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Action Handlers
  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    showToast(`Account status updated for ${user.name} to ${newStatus}`, "success");
  };

  const handleResetPassword = (user) => {
    showSuccessAlert(
      "Password Reset Triggered",
      `Password reset email instructions dispatched to ${user.email}.`
    );
  };

  const handleDeleteUser = async (user) => {
    const confirmed = await showConfirmDialog(
      "Delete User Account?",
      `Are you sure you want to permanently delete ${user.name} (${user.id})? This action cannot be undone.`,
      "Delete Account",
      "Cancel"
    );
    if (confirmed) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast(`User ${user.name} deleted successfully`, "success");
    }
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    setUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? { ...editUser } : u))
    );
    setEditUser(null);
    showSuccessAlert("Profile Saved", `User profile for ${editUser.name} updated.`);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showErrorAlert("Required Fields", "Please enter full name and email address.");
      return;
    }
    const createdId = `USR-${1000 + users.length + 1}`;
    const userObj = {
      ...newUser,
      id: createdId,
      lastLogin: "Never",
      createdDate: "Today",
    };
    setUsers([userObj, ...users]);
    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "Buyer", phone: "+91 ", status: "Active", organization: "" });
    showSuccessAlert("User Created", `New user ${userObj.name} (${createdId}) added successfully.`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 font-bold mb-2">
              <Users size={14} /> Enterprise Access Directory
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit, view, edit, activate/deactivate, and manage user accounts across all platform roles.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* FILTERS & SEARCH WORKSTATION */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* SEARCH */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by ID, Name, Email, Phone, or Org..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            {/* ROLE FILTER */}
            <div className="lg:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="Buyer">Buyer</option>
                <option value="Real Estate Agent">Real Estate Agent</option>
                <option value="Legal Reviewer">Legal Reviewer</option>
                <option value="Financial Institution">Financial Institution</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            {/* STATUS FILTER */}
            <div className="lg:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* SORT ORDER */}
            <div className="lg:col-span-2 flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Sort: User ID</option>
                <option value="name">Sort: Name</option>
                <option value="role">Sort: Role</option>
                <option value="status">Sort: Status</option>
                <option value="createdDate">Sort: Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* ENTERPRISE DATA TABLE */}
        <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u) => {
                    const isActive = u.status === "Active";
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-[#0F172A]/60 transition-colors">
                        {/* USER ID */}
                        <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-cyan-400">
                          {u.id}
                        </td>

                        {/* NAME */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-white">{u.name}</div>
                          <span className="text-[10px] text-slate-400 block">{u.organization}</span>
                        </td>

                        {/* EMAIL */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {u.email}
                        </td>

                        {/* ROLE */}
                        <td className="py-3.5 px-4">
                          <Badge variant="primary">{u.role}</Badge>
                        </td>

                        {/* PHONE */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {u.phone}
                        </td>

                        {/* STATUS */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.status === "Active"
                                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : u.status === "Suspended"
                                ? "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "Active" ? "bg-emerald-500" : u.status === "Suspended" ? "bg-rose-500" : "bg-slate-400"
                              }`}
                            />
                            {u.status}
                          </span>
                        </td>

                        {/* LAST LOGIN */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {u.lastLogin}
                        </td>

                        {/* CREATED DATE */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {u.createdDate}
                        </td>

                        {/* ACTIONS BUTTONS */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* VIEW */}
                            <button
                              onClick={() => setViewUser(u)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 cursor-pointer"
                              title="View Dossier"
                            >
                              <Eye size={14} />
                            </button>

                            {/* EDIT */}
                            <button
                              onClick={() => setEditUser({ ...u })}
                              className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
                              title="Edit User"
                            >
                              <Edit size={14} />
                            </button>

                            {/* ACTIVATE / DEACTIVATE */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-lg cursor-pointer ${
                                isActive
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                  : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100"
                              }`}
                              title={isActive ? "Deactivate User" : "Activate User"}
                            >
                              {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                            </button>

                            {/* RESET PASSWORD */}
                            <button
                              onClick={() => handleResetPassword(u)}
                              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 hover:bg-purple-100 cursor-pointer"
                              title="Reset Password"
                            >
                              <Key size={14} />
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <EmptyState
                        title="No Users Found"
                        description="No user accounts match your search or filter parameters."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between gap-4 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{paginatedUsers.length}</strong> of{" "}
              <strong className="text-slate-900 dark:text-white">{filteredUsers.length}</strong> users (Page {currentPage} of {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* MODAL: VIEW USER DOSSIER */}
        <AnimatePresence>
          {viewUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck size={18} className="text-blue-500" /> User Profile Dossier
                  </h3>
                  <button onClick={() => setViewUser(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{viewUser.name}</span>
                      <Badge variant="primary">{viewUser.role}</Badge>
                    </div>
                    <span className="text-slate-400 block">{viewUser.organization}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">User ID</span>
                      <strong className="text-blue-600 dark:text-cyan-400">{viewUser.id}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Status</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{viewUser.status}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Email</span>
                      <strong className="text-slate-900 dark:text-white truncate block">{viewUser.email}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone</span>
                      <strong className="text-slate-900 dark:text-white">{viewUser.phone}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={() => setViewUser(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Close Dossier</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT USER */}
        <AnimatePresence>
          {editUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleSaveEditUser}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit size={18} className="text-amber-500" /> Edit User Account ({editUser.id})
                  </h3>
                  <button type="button" onClick={() => setEditUser(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                      <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                        <option value="Buyer">Buyer</option>
                        <option value="Real Estate Agent">Real Estate Agent</option>
                        <option value="Legal Reviewer">Legal Reviewer</option>
                        <option value="Financial Institution">Financial Institution</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                      <select value={editUser.status} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditUser(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold cursor-pointer">Save Changes</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD USER */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleCreateUser}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus size={18} className="text-blue-500" /> Create Enterprise User
                  </h3>
                  <button type="button" onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Adv. Rajesh Sharma" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="e.g. rajesh@lexjuris.in" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Role</label>
                      <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                        <option value="Buyer">Buyer</option>
                        <option value="Real Estate Agent">Real Estate Agent</option>
                        <option value="Legal Reviewer">Legal Reviewer</option>
                        <option value="Financial Institution">Financial Institution</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <input type="text" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Organization</label>
                    <input type="text" value={newUser.organization} onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })} placeholder="e.g. LexJuris Auditors" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold cursor-pointer">Create Account</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default UserManagement;
