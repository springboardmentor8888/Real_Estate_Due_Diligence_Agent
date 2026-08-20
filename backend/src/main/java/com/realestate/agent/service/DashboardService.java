package com.realestate.agent.service;

import com.realestate.agent.dto.DashboardStatsResponse;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats(String userEmail, String requestedRole);
}
