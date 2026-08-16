package com.realestate.due_diligence.financialinstitution.controller;


import com.realestate.due_diligence.financialinstitution.dto.FinancialInstitutionDashboardResponse;
import com.realestate.due_diligence.financialinstitution.service.FinancialInstitutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financial-institution")
@RequiredArgsConstructor
public class FinancialInstitutionDashboard {

    private final FinancialInstitutionService dashboardService;

    @GetMapping("/dashboard")
    public FinancialInstitutionDashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
}
