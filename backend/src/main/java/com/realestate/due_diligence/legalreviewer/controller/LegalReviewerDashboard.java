package com.realestate.due_diligence.legalreviewer.controller;


import com.realestate.due_diligence.legalreviewer.dtos.LegalReviewerDashboardResponse;
import com.realestate.due_diligence.legalreviewer.service.LegalReviewerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/legal-reviewer")
@RequiredArgsConstructor
public class LegalReviewerDashboard {

    private final LegalReviewerDashboardService legalReviewerDashboardService;

    @GetMapping("/dashboard")
    public LegalReviewerDashboardResponse getDashboard() {

        return legalReviewerDashboardService.getDashboard();
    }
}
