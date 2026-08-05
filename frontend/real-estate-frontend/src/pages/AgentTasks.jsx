import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Home,
  ChevronRight,
  Filter,
  Search,
  Calendar as CalendarIcon,
  List as ListIcon,
  PlusCircle,
  Building2,
  Users,
  FileText,
  FileCheck,
  CheckSquare,
  Square,
  X,
  Edit3,
  Trash2,
  ChevronLeft,
  MapPin,
  Send,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { showToast, showConfirmDialog, showSuccessAlert } from "../utils/swal";

// Master Initial Tasks Mock Dataset covering all 5 requested Task Types
const INITIAL_TASKS = [
  {
    id: "TSK-101",
    title: "Gachibowli Tech Park Parcel Inspection & Boundary Audit",
    taskType: "Property Visit",
    client: "Adani Realty Institutional Fund",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    timeSlot: "09:30 AM",
    dueDate: "Today",
    priority: "HIGH",
    status: "In Progress",
    notes: "Conduct GPS survey and verify physical boundaries with Sub-Registrar map.",
  },
  {
    id: "TSK-102",
    title: "Portfolio Due Diligence Strategy Review Call",
    taskType: "Client Meeting",
    client: "DLF Cybercity Portfolio",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    timeSlot: "11:30 AM",
    dueDate: "Today",
    priority: "HIGH",
    status: "Pending",
    notes: "Review encumbrance alert and present remediation options to DLF VP.",
  },
  {
    id: "TSK-103",
    title: "Sub-Registrar 30-Year Title Deed Chain Search",
    taskType: "Document Review",
    client: "GMR Logistics Infrastructure",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    timeSlot: "02:00 PM",
    dueDate: "Today",
    priority: "MEDIUM",
    status: "Completed",
    notes: "Title search clean. All encumbrance certificates verified clear.",
  },
  {
    id: "TSK-104",
    title: "Dispatch Level 4 Institutional Audit Report PDF",
    taskType: "Report Submission",
    client: "Prestige Capital Partners",
    property: "Financial District Commercial Plot (PR-1004)",
    timeSlot: "04:30 PM",
    dueDate: "Today",
    priority: "HIGH",
    status: "Pending",
    notes: "Finalize PDF certificate and dispatch to Prestige investment committee.",
  },
  {
    id: "TSK-105",
    title: "HMDA Zoning & Environmental NOC On-Site Inspection",
    taskType: "Inspection",
    client: "Sobha Real Estate Fund",
    property: "BKC Prime Commercial Hub (PR-1005)",
    timeSlot: "05:30 PM",
    dueDate: "Today",
    priority: "LOW",
    status: "Pending",
    notes: "Verify setback compliance and Master Plan FAR alignment.",
  },
  {
    id: "TSK-106",
    title: "Site Survey & Soil Test Inspection Visit",
    taskType: "Property Visit",
    client: "Mahindra Lifespaces Ltd",
    property: "Kokapet SEZ Commercial Land (PR-1006)",
    timeSlot: "06:00 PM",
    dueDate: "Tomorrow",
    priority: "MEDIUM",
    status: "In Progress",
    notes: "Site visit for soil testing report validation.",
  },
];

function AgentTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // View Mode: 'list' or 'calendar'
  const [viewMode, setViewMode] = useState("list");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalTask, setEditModalTask] = useState(null);
  const [viewModalTask, setViewModalTask] = useState(null);

  // Form State
  const [taskForm, setTaskForm] = useState({
    id: "",
    title: "",
    taskType: "Property Visit",
    client: "Adani Realty Institutional Fund",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    timeSlot: "10:00 AM",
    dueDate: "Today",
    priority: "HIGH",
    status: "Pending",
    notes: "",
  });

  // Task Completion Checkbox Toggle
  const handleToggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
          showToast(`Task marked as ${nextStatus}`, "info");
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === "ALL" || t.taskType === typeFilter;
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;

      return matchSearch && matchType && matchStatus && matchPriority;
    });
  }, [tasks, searchQuery, typeFilter, statusFilter, priorityFilter]);

  // Priority Color Helper
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return {
          border: "border-l-rose-500",
          badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800",
          text: "text-rose-600 dark:text-rose-400",
        };
      case "MEDIUM":
        return {
          border: "border-l-amber-500",
          badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
          text: "text-amber-600 dark:text-amber-400",
        };
      default:
        return {
          border: "border-l-blue-500",
          badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800",
          text: "text-blue-600 dark:text-cyan-400",
        };
    }
  };

  // Task Status Badge Renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold">
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:text-cyan-300 dark:border-blue-800 text-[10px] font-mono font-bold">
            <Clock size={11} className="animate-spin-slow" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800 text-[10px] font-mono font-bold">
            <Clock size={11} /> Pending
          </span>
        );
    }
  };

  // Task Type Icon Renderer
  const renderTaskTypeIcon = (type) => {
    switch (type) {
      case "Property Visit":
        return <Home size={15} className="text-blue-500" />;
      case "Client Meeting":
        return <Users size={15} className="text-purple-500" />;
      case "Document Review":
        return <FileText size={15} className="text-amber-500" />;
      case "Report Submission":
        return <Send size={15} className="text-emerald-500" />;
      case "Inspection":
        return <Search size={15} className="text-cyan-500" />;
      default:
        return <ClipboardList size={15} className="text-blue-500" />;
    }
  };

  // Handlers
  const handleOpenCreateModal = () => {
    setTaskForm({
      id: `TSK-10${tasks.length + 1}`,
      title: "",
      taskType: "Property Visit",
      client: "Adani Realty Institutional Fund",
      property: "Gachibowli Tech Park Phase 2 (PR-1001)",
      timeSlot: "10:00 AM",
      dueDate: "Today",
      priority: "HIGH",
      status: "Pending",
      notes: "",
    });
    setCreateModalOpen(true);
  };

  const handleSaveCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title) {
      showToast("Please enter task title", "error");
      return;
    }
    setTasks((prev) => [taskForm, ...prev]);
    showSuccessAlert("Task Created", `Added task "${taskForm.title}" to today's agenda.`);
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (task) => {
    setTaskForm({ ...task });
    setEditModalTask(task);
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    setTasks((prev) => prev.map((t) => (t.id === taskForm.id ? { ...t, ...taskForm } : t)));
    showToast(`Updated task "${taskForm.title}"`, "success");
    setEditModalTask(null);
  };

  const handleDeleteTask = async (task) => {
    const confirmed = await showConfirmDialog({
      title: `Delete Task "${task.title}"?`,
      text: "This action will remove the task assignment from today's schedule.",
      confirmButtonText: "Yes, Delete Task",
      cancelButtonText: "Keep Task",
      icon: "warning",
    });

    if (confirmed) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      showToast(`Removed task "${task.title}"`, "info");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Today's Agenda & Tasks
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            AGENDA • {tasks.filter((t) => t.status === "Completed").length} / {tasks.length} COMPLETED
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ClipboardList size={14} /> Agent Daily Operations Agenda
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📅 Today's Tasks & Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Manage property visits, client meetings, document reviews, report submissions, and on-site inspections.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleOpenCreateModal} variant="primary" size="sm" icon={PlusCircle}>
              Add New Task
            </Button>
          </div>
        </div>

        {/* SEARCH, FILTER & VIEW MODE CONTROLS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by Title, Client Name, Property or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Filter by Task Type */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Filter size={14} className="text-purple-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Task Types</option>
                <option value="Property Visit">Property Visit</option>
                <option value="Client Meeting">Client Meeting</option>
                <option value="Document Review">Document Review</option>
                <option value="Report Submission">Report Submission</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* View Mode Switcher: List vs Calendar */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#334155]">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                    : "text-slate-400"
                }`}
                title="List View"
              >
                <ListIcon size={15} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                    : "text-slate-400"
                }`}
                title="Calendar View"
              >
                <CalendarIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* LIST VIEW vs CALENDAR VIEW */}
        {filteredTasks.length === 0 ? (
          <EmptyState title="No tasks found" message="No task matches your search query or filter selection." />
        ) : viewMode === "list" ? (
          /* LIST VIEW MODE WITH PRIORITY COLORS & INTERACTIVE CHECKBOXES */
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const priorityStyle = getPriorityStyle(task.priority);
              const isDone = task.status === "Completed";

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -2 }}
                  className={`white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] border-l-4 ${
                    priorityStyle.border
                  } shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone ? "opacity-75 bg-slate-50/50 dark:bg-[#0F172A]/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Interactive Completion Checkbox */}
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="mt-1 shrink-0 text-blue-600 dark:text-cyan-400 cursor-pointer"
                      title={isDone ? "Mark as Pending" : "Mark as Completed"}
                    >
                      {isDone ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400 hover:text-blue-500" />}
                    </button>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                        <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          {renderTaskTypeIcon(task.taskType)} {task.taskType}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500 dark:text-slate-400">{task.client}</span>
                        <span>•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> {task.timeSlot} ({task.dueDate})
                        </span>
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight ${
                          isDone ? "line-through text-slate-400 dark:text-slate-500" : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span>{task.property}</span>
                      </p>
                    </div>
                  </div>

                  {/* Priority Pill & Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#334155]">
                    {/* Priority Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${priorityStyle.badge}`}>
                      {task.priority} PRIORITY
                    </span>

                    {/* Status Badge */}
                    {renderStatusBadge(task.status)}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewModalTask(task)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        title="View Task Details"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* CALENDAR VIEW MODE WITH HOURLY SCHEDULE TIMELINE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Calendar Mini Month Widget (4 Cols) */}
            <div className="lg:col-span-4 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CalendarIcon size={14} className="text-blue-500" /> August 2026
                </h3>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                  TODAY: AUG 06
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-400 p-1">
                    {d}
                  </span>
                ))}

                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 6;
                  const hasTasks = day === 6 || day === 7 || day === 12 || day === 14;

                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex flex-col items-center justify-center relative ${
                        isToday
                          ? "bg-blue-600 text-white shadow-md"
                          : hasTasks
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-extrabold"
                          : "hover:bg-slate-100 dark:hover:bg-[#0F172A] text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{day}</span>
                      {hasTasks && !isToday && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Hourly Timeline Schedule (8 Cols) */}
            <div className="lg:col-span-8 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#334155]">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Clock size={16} className="text-blue-600 dark:text-cyan-400" /> Today's Time Slot Schedule
                </h3>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  6 Scheduled Operations
                </span>
              </div>

              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const priorityStyle = getPriorityStyle(task.priority);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] border-l-4 ${
                        priorityStyle.border
                      } space-y-2 hover:border-blue-400 transition-colors`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                          <Clock size={12} /> {task.timeSlot} • {task.taskType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${priorityStyle.badge}`}>
                            {task.priority}
                          </span>
                          {renderStatusBadge(task.status)}
                        </div>
                      </div>

                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{task.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                        <Building2 size={12} className="text-purple-500 shrink-0" />
                        <span className="truncate">{task.property} ({task.client})</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: VIEW TASK DETAILS MODAL */}
        <AnimatePresence>
          {viewModalTask && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewModalTask(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">{viewModalTask.id} • {viewModalTask.taskType}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{viewModalTask.title}</h2>
                  </div>
                  <button onClick={() => setViewModalTask(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Client & Target Property</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm">{viewModalTask.client}</p>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{viewModalTask.property}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Scheduled Time Slot</span>
                      <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-sm block mt-1">{viewModalTask.timeSlot} ({viewModalTask.dueDate})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Status Badge</span>
                      <div className="mt-1">{renderStatusBadge(viewModalTask.status)}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-1">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Task Notes & Instructions</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{viewModalTask.notes}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                  <Button onClick={() => setViewModalTask(null)} variant="secondary" size="sm">Close</Button>
                  <Button onClick={() => { handleToggleTaskStatus(viewModalTask.id); setViewModalTask(null); }} variant="primary" size="sm">Toggle Status</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2 & 3: CREATE / EDIT TASK MODAL */}
        <AnimatePresence>
          {(createModalOpen || editModalTask) && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCreateModalOpen(false); setEditModalTask(null); }} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={20} className="text-blue-500" /> {editModalTask ? "Edit Agent Task" : "Add New Task"}
                  </h2>
                  <button onClick={() => { setCreateModalOpen(false); setEditModalTask(null); }} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={editModalTask ? handleSaveEditTask : handleSaveCreateTask} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Task Title *</label>
                    <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="E.g. Site Visit & Boundary Audit" required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 uppercase font-bold mb-1">Task Type</label>
                      <select value={taskForm.taskType} onChange={(e) => setTaskForm({ ...taskForm, taskType: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                        <option value="Property Visit">Property Visit</option>
                        <option value="Client Meeting">Client Meeting</option>
                        <option value="Document Review">Document Review</option>
                        <option value="Report Submission">Report Submission</option>
                        <option value="Inspection">Inspection</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase font-bold mb-1">Priority</label>
                      <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Status</label>
                    <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Time Slot / Schedule</label>
                    <input type="text" value={taskForm.timeSlot} onChange={(e) => setTaskForm({ ...taskForm, timeSlot: e.target.value })} placeholder="E.g. 11:30 AM" className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Task Notes</label>
                    <textarea rows={3} value={taskForm.notes} onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })} placeholder="Add audit notes or meeting location..." className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => { setCreateModalOpen(false); setEditModalTask(null); }} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">{editModalTask ? "Save Task" : "Create Task"}</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default AgentTasks;
