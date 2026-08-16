package com.realestate.due_diligence.legalreviewer.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LegalReviewerDashboardResponse {

    private Integer pendingReviews;
    private Integer highLegalRisk;
    private Integer documentsPending;
    private Integer completedReviews;

    private List<LegalReviewPropertyResponse> pendingProperties;

    private List<LegalReviewHistoryResponse> recentReviews;
}