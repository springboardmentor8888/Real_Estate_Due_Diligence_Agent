package com.realestate.agent.service.impl;

import com.realestate.agent.dto.DashboardStatsResponse;
import com.realestate.agent.dto.DashboardStatsResponse.ActivityItem;
import com.realestate.agent.entity.*;
import com.realestate.agent.enums.ListingStatus;
import com.realestate.agent.enums.PropertyStatus;
import com.realestate.agent.repository.*;
import com.realestate.agent.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final DueDiligenceReportRepository reportRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final PropertyDocumentRepository documentRepository;
    private final PropertyListingRepository listingRepository;
    private final NotificationRepository notificationRepository;
    private final OfferRepository offerRepository;
    private final WatchlistRepository watchlistRepository;
    private final ComparablePropertyRepository comparablePropertyRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(String userEmail, String requestedRole) {
        User user = null;
        if (userEmail != null && !userEmail.isBlank()) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        String role = user != null && user.getRole() != null
            ? user.getRole().getRoleName().toUpperCase().trim()
            : "BUYER";
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        String fullName = user != null ? ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                (user.getLastName() != null ? user.getLastName() : "")).trim() : "User";
        if (fullName.isBlank() && user != null) fullName = user.getEmail();

        long totalProperties = propertyRepository.count();
        long reportsGenerated = reportRepository.count();
        long totalRisks = riskAssessmentRepository.count();
        long totalDocuments = documentRepository.count();
        long verifiedDocuments = documentRepository.countByReportIsNotNull();
        long pendingDocuments = documentRepository.countByReportIsNull();
        long activeListings = listingRepository.countByListingStatus(ListingStatus.ACTIVE);
        long underContract = listingRepository.countByListingStatus(ListingStatus.PENDING);
        long soldProperties = listingRepository.countByListingStatus(ListingStatus.SOLD);
        long highRiskAlerts = riskAssessmentRepository.countByRiskLevelIgnoreCase("HIGH")
                + riskAssessmentRepository.countByRiskLevelIgnoreCase("CRITICAL");
        long mediumRiskCount = riskAssessmentRepository.countByRiskLevelIgnoreCase("MEDIUM");
        long lowRiskCount = riskAssessmentRepository.countByRiskLevelIgnoreCase("LOW");

        List<Property> recentProperties = propertyRepository.findTopRecentProperties(org.springframework.data.domain.PageRequest.of(0, 20));
        List<DueDiligenceReport> recentReports = reportRepository.findTopRecentReports(org.springframework.data.domain.PageRequest.of(0, 20));
        List<ComparableProperty> allComparables = comparablePropertyRepository.findAll();

        List<Notification> userNotifications = (user != null)
                ? notificationRepository.findByUserUserIdOrderBySentAtDesc(user.getUserId())
                : List.of();

        List<Offer> userOffers = (user != null)
                ? offerRepository.findByBuyerEmail(user.getEmail())
                : List.of();

        List<Watchlist> userWatchlist = (user != null)
                ? watchlistRepository.findByUserEmail(user.getEmail())
                : List.of();

        long activeTransactions = 0;
        long pendingReviews = 0;
        long watchlistCount = userWatchlist.size();
        long unreadNotificationsCount = userNotifications.stream().filter(n -> !Boolean.TRUE.equals(n.getIsRead())).count();
        long totalInquiries = 0;
        long totalLoans = 0;
        long pendingLoans = 0;
        long approvedLoans = 0;

        List<ActivityItem> activities = new ArrayList<>();

        // Structured preview collections for dashboard cards and tables
        List<Map<String, Object>> propertiesData = new ArrayList<>();
        for (Property p : recentProperties) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getPropertyId());
            map.put("propertyId", p.getPropertyId());
            map.put("propertyCode", p.getPropertyCode());
            map.put("propertyName", p.getPropertyName());
            String addrStr = p.getPrimaryAddress() != null ? p.getPrimaryAddress().getAddressLine1() : p.getPropertyName();
            String city = p.getPrimaryAddress() != null && p.getPrimaryAddress().getCity() != null ? p.getPrimaryAddress().getCity() : "";
            String state = p.getPrimaryAddress() != null && p.getPrimaryAddress().getState() != null ? p.getPrimaryAddress().getState() : "";
            map.put("address", addrStr);
            map.put("city", city);
            map.put("state", state);
            map.put("fullAddress", addrStr + (city.isEmpty() ? "" : ", " + city) + (state.isEmpty() ? "" : ", " + state));
            map.put("marketValue", p.getMarketValue());
            map.put("price", p.getMarketValue());
            map.put("status", p.getStatus() != null ? p.getStatus().name() : "AVAILABLE");
            map.put("builtYear", p.getBuiltYear());
            map.put("totalArea", p.getTotalArea());
            map.put("landArea", p.getLandArea());
            map.put("description", p.getDescription());
            map.put("createdAt", p.getCreatedAt());
            propertiesData.add(map);
        }

        List<Map<String, Object>> offersData = new ArrayList<>();
        for (Offer o : userOffers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", o.getOfferId());
            map.put("offerId", o.getOfferId());
            map.put("amount", o.getAmount());
            map.put("status", o.getStatus());
            map.put("createdAt", o.getCreatedAt());
            map.put("timeAgo", formatTimeAgo(o.getCreatedAt()));

            Map<String, Object> propMap = new HashMap<>();
            if (o.getProperty() != null) {
                Property op = o.getProperty();
                propMap.put("id", op.getPropertyId());
                propMap.put("propertyId", op.getPropertyId());
                propMap.put("propertyName", op.getPropertyName());
                String addrStr = op.getPrimaryAddress() != null ? op.getPrimaryAddress().getAddressLine1() : op.getPropertyName();
                propMap.put("address", addrStr);
                propMap.put("price", op.getMarketValue());
                propMap.put("status", op.getStatus() != null ? op.getStatus().name() : "AVAILABLE");
            }
            map.put("property", propMap);
            offersData.add(map);
        }

        List<Map<String, Object>> watchlistData = new ArrayList<>();
        for (Watchlist w : userWatchlist) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", w.getWatchlistId());
            map.put("alertsEnabled", w.getAlertsEnabled());
            map.put("addedAt", w.getAddedAt());
            if (w.getProperty() != null) {
                Property wp = w.getProperty();
                map.put("propertyId", wp.getPropertyId());
                map.put("propertyName", wp.getPropertyName());
                String addrStr = wp.getPrimaryAddress() != null ? wp.getPrimaryAddress().getAddressLine1() : wp.getPropertyName();
                map.put("address", addrStr);
                map.put("price", wp.getMarketValue());
                map.put("status", wp.getStatus() != null ? wp.getStatus().name() : "AVAILABLE");
            }
            watchlistData.add(map);
        }

        List<Map<String, Object>> reportsData = new ArrayList<>();
        for (DueDiligenceReport r : recentReports) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getReportId());
            map.put("reportId", r.getReportId());
            map.put("reportName", r.getReportName());
            map.put("executiveSummary", r.getExecutiveSummary());
            map.put("overallRiskScore", r.getOverallRiskScore());
            map.put("reportStatus", r.getReportStatus());
            map.put("pdfPath", r.getPdfPath());
            map.put("generatedAt", r.getGeneratedAt());
            map.put("timeAgo", formatTimeAgo(r.getGeneratedAt()));
            if (r.getProperty() != null) {
                map.put("propertyId", r.getProperty().getPropertyId());
                map.put("propertyName", r.getProperty().getPropertyName());
                String addrStr = r.getProperty().getPrimaryAddress() != null ? r.getProperty().getPrimaryAddress().getAddressLine1() : r.getProperty().getPropertyName();
                map.put("propertyAddress", addrStr);
            }
            reportsData.add(map);
        }

        List<Map<String, Object>> pendingReviewItems = new ArrayList<>();
        List<Property> underReviewProperties = propertyRepository.findRecentByStatus(
                PropertyStatus.UNDER_REVIEW, org.springframework.data.domain.PageRequest.of(0, 10));
        for (Property p : underReviewProperties) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "prop-review-" + p.getPropertyId());
            map.put("type", "PROPERTY_REVIEW");
            map.put("title", p.getPropertyName());
            String addrStr = p.getPrimaryAddress() != null ? p.getPrimaryAddress().getAddressLine1() : p.getPropertyName();
            map.put("address", addrStr);
            map.put("status", "UNDER_REVIEW");
            map.put("createdAt", p.getCreatedAt());
            map.put("timeAgo", formatTimeAgo(p.getCreatedAt()));
            pendingReviewItems.add(map);
        }
        List<DueDiligenceReport> pendingReports = reportRepository.findPendingReviewReports(
                org.springframework.data.domain.PageRequest.of(0, 10));
        for (DueDiligenceReport r : pendingReports) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "rep-review-" + r.getReportId());
            map.put("type", "REPORT_REVIEW");
            map.put("title", r.getReportName());
            map.put("propertyId", r.getProperty() != null ? r.getProperty().getPropertyId() : null);
            map.put("status", r.getReportStatus());
            map.put("createdAt", r.getGeneratedAt());
            map.put("timeAgo", formatTimeAgo(r.getGeneratedAt()));
            pendingReviewItems.add(map);
        }

        List<Map<String, Object>> comparableData = new ArrayList<>();
        int compLimit = Math.min(allComparables.size(), 20);
        for (int i = 0; i < compLimit; i++) {
            ComparableProperty c = allComparables.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getComparableId());
            map.put("distanceKm", c.getDistanceKm());
            map.put("similarityScore", c.getSimilarityScore());
            map.put("comparisonPrice", c.getComparisonPrice());
            map.put("remarks", c.getRemarks());
            if (c.getProperty() != null) {
                map.put("sourcePropertyId", c.getProperty().getPropertyId());
                map.put("sourcePropertyName", c.getProperty().getPropertyName());
            }
            if (c.getComparableProperty() != null) {
                map.put("comparablePropertyId", c.getComparableProperty().getPropertyId());
                map.put("comparablePropertyName", c.getComparableProperty().getPropertyName());
                map.put("comparablePrice", c.getComparableProperty().getMarketValue());
            }
            comparableData.add(map);
        }

        List<Map<String, Object>> notificationsData = new ArrayList<>();
        for (Notification n : userNotifications) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getNotificationId());
            map.put("title", n.getTitle());
            map.put("message", n.getMessage());
            map.put("type", n.getNotificationType());
            map.put("isRead", n.getIsRead());
            map.put("sentAt", n.getSentAt());
            map.put("timeAgo", formatTimeAgo(n.getSentAt()));
            notificationsData.add(map);
        }

        // Real Risk Overview calculations from PostgreSQL
        Map<String, Object> riskOverview = new HashMap<>();
        double avgRisk = riskAssessmentRepository.getAverageRiskScore();
        riskOverview.put("averageRiskScore", Math.round(avgRisk * 10.0) / 10.0);
        riskOverview.put("totalAssessments", totalRisks);
        riskOverview.put("highRiskCount", highRiskAlerts);
        riskOverview.put("mediumRiskCount", mediumRiskCount);
        riskOverview.put("lowRiskCount", lowRiskCount);

        Map<String, Object> categoryScores = new HashMap<>();
        List<RiskAssessment> recentAssessments = riskAssessmentRepository.findTopRecentAssessments(
                org.springframework.data.domain.PageRequest.of(0, 30));
        for (RiskAssessment r : recentAssessments) {
            if (r.getRiskCategory() != null && r.getRiskScore() != null) {
                String catName = r.getRiskCategory().getCategoryName();
                categoryScores.putIfAbsent(catName, r.getRiskScore());
            }
        }
        riskOverview.put("categoryScores", categoryScores);

        // Real Analytics metrics from PostgreSQL
        Map<String, Object> analytics = new HashMap<>();
        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] row : propertyRepository.countPropertiesByStatus()) {
            PropertyStatus s = (PropertyStatus) row[0];
            Long cnt = (Long) row[1];
            statusCounts.put(s != null ? s.name() : "AVAILABLE", cnt);
        }
        analytics.put("statusBreakdown", statusCounts);
        analytics.put("totalProperties", totalProperties);
        analytics.put("totalReports", reportsGenerated);
        analytics.put("totalRiskAssessments", totalRisks);
        analytics.put("totalOffers", userOffers.size());

        BigDecimal totalMarketVal = propertyRepository.sumMarketValue();
        analytics.put("totalMarketValue", totalMarketVal);
        analytics.put("averageMarketValue", totalProperties > 0
                ? totalMarketVal.divide(BigDecimal.valueOf(totalProperties), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);

        switch (role) {
            case "SELLER": {
                Long userId = user != null ? user.getUserId() : null;
                totalProperties = userId != null ? propertyRepository.countByCreatedByUserId(userId) : 0;
                activeTransactions = userId != null ? propertyRepository.countByCreatedByUserIdAndStatus(userId, PropertyStatus.UNDER_REVIEW) : 0;
                pendingReviews = activeTransactions;
                reportsGenerated = userId != null ? reportRepository.countByPropertyCreatedByUserId(userId) : 0;

                List<Property> sellerProperties = userId != null
                        ? propertyRepository.findRecentByCreatedByUserId(userId, org.springframework.data.domain.PageRequest.of(0, 15))
                        : List.of();

                for (Property p : sellerProperties) {
                    activities.add(ActivityItem.builder()
                            .id("prop-" + p.getPropertyId())
                            .type("PROPERTY")
                            .title("Property Listed")
                            .description(p.getPropertyName() + " (" + p.getPropertyCode() + ")")
                            .timestamp(p.getCreatedAt() != null ? p.getCreatedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(p.getCreatedAt()))
                            .status(p.getStatus() != null ? p.getStatus().name() : "ACTIVE")
                            .entityId(String.valueOf(p.getPropertyId()))
                            .build());
                }
                break;
            }

            case "AGENT": {
                activeTransactions = propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW);
                pendingReviews = activeTransactions;
                totalInquiries = userNotifications.size();

                for (Property p : recentProperties) {
                    activities.add(ActivityItem.builder()
                            .id("prop-" + p.getPropertyId())
                            .type("PROPERTY")
                            .title("Property Listed")
                            .description(p.getPropertyName() + " - $" + p.getMarketValue())
                            .timestamp(p.getCreatedAt() != null ? p.getCreatedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(p.getCreatedAt()))
                            .status(p.getStatus() != null ? p.getStatus().name() : "ACTIVE")
                            .entityId(String.valueOf(p.getPropertyId()))
                            .build());
                }
                break;
            }

            case "BANK": {
                totalLoans = totalProperties;
                pendingLoans = propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW);
                approvedLoans = propertyRepository.countByStatus(PropertyStatus.VERIFIED)
                        + propertyRepository.countByStatus(PropertyStatus.AVAILABLE);
                activeTransactions = pendingLoans;
                pendingReviews = totalRisks;
                break;
            }

            case "LEGAL_REVIEWER": {
                activeTransactions = propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW);
                pendingReviews = pendingDocuments;
                if (pendingReviews == 0 && totalProperties > 0) {
                    pendingReviews = activeTransactions;
                }
                break;
            }

            case "BUYER":
            default: {
                long activeOffers = userOffers.stream()
                        .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()) || "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                        .count();
                activeTransactions = activeOffers > 0 ? activeOffers : propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW);
                pendingReviews = propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW) + pendingReports.size();

                for (Offer o : userOffers) {
                    activities.add(ActivityItem.builder()
                            .id("offer-" + o.getOfferId())
                            .type("OFFER")
                            .title("Offer Submitted: $" + (o.getAmount() != null ? String.format("%,.0f", o.getAmount()) : "0"))
                            .description(o.getProperty() != null ? o.getProperty().getPropertyName() : "Property")
                            .timestamp(o.getCreatedAt() != null ? o.getCreatedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(o.getCreatedAt()))
                            .status(o.getStatus())
                            .entityId(String.valueOf(o.getOfferId()))
                            .build());
                }

                for (Watchlist w : userWatchlist) {
                    activities.add(ActivityItem.builder()
                            .id("watch-" + w.getWatchlistId())
                            .type("WATCHLIST")
                            .title("Saved to Watchlist")
                            .description(w.getProperty() != null ? w.getProperty().getPropertyName() : "Property")
                            .timestamp(w.getAddedAt() != null ? w.getAddedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(w.getAddedAt()))
                            .status("WATCHLISTED")
                            .entityId(w.getProperty() != null ? String.valueOf(w.getProperty().getPropertyId()) : "")
                            .build());
                }

                for (Property p : recentProperties) {
                    activities.add(ActivityItem.builder()
                            .id("prop-" + p.getPropertyId())
                            .type("PROPERTY")
                            .title("Property Available")
                            .description(p.getPropertyName() + " (" + p.getPropertyCode() + ")")
                            .timestamp(p.getCreatedAt() != null ? p.getCreatedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(p.getCreatedAt()))
                            .status(p.getStatus() != null ? p.getStatus().name() : "AVAILABLE")
                            .entityId(String.valueOf(p.getPropertyId()))
                            .build());
                }

                for (DueDiligenceReport r : recentReports) {
                    activities.add(ActivityItem.builder()
                            .id("rep-" + r.getReportId())
                            .type("REPORT")
                            .title("Due Diligence Report Ready")
                            .description(r.getReportName() + " (" + (r.getProperty() != null ? r.getProperty().getPropertyName() : "Property") + ")")
                            .timestamp(r.getGeneratedAt() != null ? r.getGeneratedAt() : LocalDateTime.now())
                            .timeAgo(formatTimeAgo(r.getGeneratedAt()))
                            .status(r.getReportStatus())
                            .entityId(String.valueOf(r.getReportId()))
                            .build());
                }
                break;
            }
        }

        // Include user notifications in the activity stream
        for (Notification n : userNotifications) {
            activities.add(ActivityItem.builder()
                    .id("notif-" + n.getNotificationId())
                    .type("NOTIFICATION")
                    .title(n.getTitle())
                    .description(n.getMessage())
                    .timestamp(n.getSentAt() != null ? n.getSentAt() : LocalDateTime.now())
                    .timeAgo(formatTimeAgo(n.getSentAt()))
                    .status(Boolean.TRUE.equals(n.getIsRead()) ? "READ" : "UNREAD")
                    .entityId(String.valueOf(n.getNotificationId()))
                    .build());
        }

        // Sort all real activities by latest timestamp descending and limit to 15
        activities.sort((a, b) -> {
            if (a.getTimestamp() == null && b.getTimestamp() == null) return 0;
            if (a.getTimestamp() == null) return 1;
            if (b.getTimestamp() == null) return -1;
            return b.getTimestamp().compareTo(a.getTimestamp());
        });

        List<ActivityItem> limitedActivities = activities.stream().limit(15).toList();

        Map<String, Object> extraMetrics = new HashMap<>();
        extraMetrics.put("totalUsers", userRepository.count());
        extraMetrics.put("activeUsers", userRepository.count());
        extraMetrics.put("highRiskAlerts", highRiskAlerts);
        extraMetrics.put("watchlistCount", watchlistCount);
        extraMetrics.put("unreadNotificationsCount", unreadNotificationsCount);

        return DashboardStatsResponse.builder()
                .role(role)
                .userFullName(fullName)
                .userEmail(user != null ? user.getEmail() : userEmail)
                .totalProperties(totalProperties)
                .activeTransactions(activeTransactions)
                .pendingReviews(pendingReviews)
                .reportsGenerated(reportsGenerated)
                .watchlistCount(watchlistCount)
                .unreadNotificationsCount(unreadNotificationsCount)
                .activeListings(activeListings)
                .underContract(underContract)
                .soldProperties(soldProperties)
                .totalInquiries(totalInquiries)
                .totalLoans(totalLoans)
                .pendingLoans(pendingLoans)
                .approvedLoans(approvedLoans)
                .totalDocuments(totalDocuments)
                .verifiedDocuments(verifiedDocuments)
                .highRiskAlerts(highRiskAlerts)
                .recentActivities(limitedActivities)
                .properties(propertiesData)
                .offers(offersData)
                .watchlist(watchlistData)
                .reports(reportsData)
                .pendingReviewItems(pendingReviewItems)
                .comparableProperties(comparableData)
                .notifications(notificationsData)
                .riskOverview(riskOverview)
                .analytics(analytics)
                .extraMetrics(extraMetrics)
                .build();
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Just now";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = Math.abs(duration.getSeconds());
        if (seconds < 60) return seconds <= 5 ? "Just now" : seconds + " seconds ago";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        long days = hours / 24;
        if (days < 30) return days + " day" + (days == 1 ? "" : "s") + " ago";
        long months = days / 30;
        return months + " month" + (months == 1 ? "" : "s") + " ago";
    }
}
