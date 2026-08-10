import apiClient from "./apiClient";

// Get Administrative Dashboard Analytics
export const getAdminDashboardAnalytics = async () => {
  return apiClient.get("/api/admin/dashboard/analytics");
};
