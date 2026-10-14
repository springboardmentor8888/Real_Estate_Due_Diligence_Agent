package com.realestate.agent.service;

import com.realestate.agent.dto.DashboardStatsResponse;
import com.realestate.agent.entity.*;
import com.realestate.agent.enums.ListingStatus;
import com.realestate.agent.enums.PropertyStatus;
import com.realestate.agent.repository.*;
import com.realestate.agent.service.impl.DashboardServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LargeDatasetAndDashboardTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private DueDiligenceReportRepository reportRepository;

    @Mock
    private RiskAssessmentRepository riskAssessmentRepository;

    @Mock
    private PropertyDocumentRepository documentRepository;

    @Mock
    private PropertyListingRepository listingRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private ComparablePropertyRepository comparablePropertyRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    private User buyerUser;
    private User sellerUser;
    private User legalUser;
    private User bankUser;

    @BeforeEach
    void setUp() {
        buyerUser = User.builder()
                .userId(1L)
                .email("buyer@demo.com")
                .firstName("John")
                .lastName("Buyer")
                .role(Role.builder().roleId(1L).roleName("BUYER").build())
                .build();

        sellerUser = User.builder()
                .userId(2L)
                .email("seller@demo.com")
                .firstName("Michael")
                .lastName("Seller")
                .role(Role.builder().roleId(2L).roleName("SELLER").build())
                .build();

        legalUser = User.builder()
                .userId(3L)
                .email("legal@demo.com")
                .firstName("David")
                .lastName("Counsel")
                .role(Role.builder().roleId(3L).roleName("LEGAL_REVIEWER").build())
                .build();

        bankUser = User.builder()
                .userId(4L)
                .email("bank@demo.com")
                .firstName("Elena")
                .lastName("Banker")
                .role(Role.builder().roleId(4L).roleName("BANK").build())
                .build();
    }

    private void setupBaseCommonMocks() {
        when(propertyRepository.count()).thenReturn(504L);
        when(reportRepository.count()).thenReturn(103L);
        when(riskAssessmentRepository.count()).thenReturn(310L);
        when(documentRepository.count()).thenReturn(150L);
        when(documentRepository.countByReportIsNotNull()).thenReturn(100L);
        when(documentRepository.countByReportIsNull()).thenReturn(50L);
        when(listingRepository.countByListingStatus(any(ListingStatus.class))).thenReturn(10L);
        when(riskAssessmentRepository.countByRiskLevelIgnoreCase(anyString())).thenReturn(5L);

        when(propertyRepository.findTopRecentProperties(any())).thenReturn(Collections.emptyList());
        when(reportRepository.findTopRecentReports(any())).thenReturn(Collections.emptyList());
        when(riskAssessmentRepository.findTopRecentAssessments(any())).thenReturn(Collections.emptyList());
        when(propertyRepository.findRecentByStatus(any(), any())).thenReturn(Collections.emptyList());
        when(reportRepository.findPendingReviewReports(any())).thenReturn(Collections.emptyList());
        when(comparablePropertyRepository.findAll()).thenReturn(Collections.emptyList());
        when(riskAssessmentRepository.getAverageRiskScore()).thenReturn(28.5);
        when(propertyRepository.countPropertiesByStatus()).thenReturn(Collections.emptyList());
        when(propertyRepository.sumMarketValue()).thenReturn(new BigDecimal("125000000.00"));
    }

    @Test
    @DisplayName("Dashboard optimization: Buyer metrics use aggregation queries without loading full tables")
    void testBuyerDashboardUsesAggregations() {
        when(userRepository.findByEmail("buyer@demo.com")).thenReturn(Optional.of(buyerUser));
        setupBaseCommonMocks();

        when(notificationRepository.findByUserUserIdOrderBySentAtDesc(anyLong())).thenReturn(Collections.emptyList());
        when(offerRepository.findByBuyerEmail(anyString())).thenReturn(Collections.emptyList());
        when(watchlistRepository.findByUserEmail(anyString())).thenReturn(Collections.emptyList());
        when(propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW)).thenReturn(126L);

        DashboardStatsResponse response = dashboardService.getDashboardStats("buyer@demo.com", "BUYER");

        assertThat(response).isNotNull();
        assertThat(response.getRole()).isEqualTo("BUYER");
        assertThat(response.getTotalProperties()).isEqualTo(504L);
        assertThat(response.getReportsGenerated()).isEqualTo(103L);
        assertThat(response.getPendingReviews()).isEqualTo(126L);

        // Verify that findAll() was NEVER invoked on large repositories!
        verify(propertyRepository, never()).findAll();
        verify(reportRepository, never()).findAll();
        verify(riskAssessmentRepository, never()).findAll();
    }

    @Test
    @DisplayName("Dashboard optimization: Seller metrics filter by user ID using count queries")
    void testSellerDashboardUsesAggregations() {
        when(userRepository.findByEmail("seller@demo.com")).thenReturn(Optional.of(sellerUser));
        setupBaseCommonMocks();

        when(propertyRepository.countByCreatedByUserId(sellerUser.getUserId())).thenReturn(250L);
        when(propertyRepository.countByCreatedByUserIdAndStatus(sellerUser.getUserId(), PropertyStatus.UNDER_REVIEW)).thenReturn(60L);
        when(reportRepository.countByPropertyCreatedByUserId(sellerUser.getUserId())).thenReturn(45L);
        when(propertyRepository.findRecentByCreatedByUserId(eq(sellerUser.getUserId()), any())).thenReturn(Collections.emptyList());

        DashboardStatsResponse response = dashboardService.getDashboardStats("seller@demo.com", "SELLER");

        assertThat(response).isNotNull();
        assertThat(response.getRole()).isEqualTo("SELLER");
        assertThat(response.getTotalProperties()).isEqualTo(250L);
        assertThat(response.getActiveTransactions()).isEqualTo(60L);
        assertThat(response.getPendingReviews()).isEqualTo(60L);
        assertThat(response.getReportsGenerated()).isEqualTo(45L);

        verify(propertyRepository, never()).findAll();
        verify(reportRepository, never()).findAll();
    }

    @Test
    @DisplayName("Dashboard optimization: Legal reviewer metrics calculate pending audits efficiently")
    void testLegalDashboardUsesAggregations() {
        when(userRepository.findByEmail("legal@demo.com")).thenReturn(Optional.of(legalUser));
        setupBaseCommonMocks();

        when(propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW)).thenReturn(126L);

        DashboardStatsResponse response = dashboardService.getDashboardStats("legal@demo.com", "LEGAL_REVIEWER");

        assertThat(response).isNotNull();
        assertThat(response.getRole()).isEqualTo("LEGAL_REVIEWER");
        assertThat(response.getActiveTransactions()).isEqualTo(126L);
        assertThat(response.getPendingReviews()).isEqualTo(50L);

        verify(propertyRepository, never()).findAll();
        verify(reportRepository, never()).findAll();
    }

    @Test
    @DisplayName("Dashboard optimization: Bank metrics calculate collateral value and high risk alerts")
    void testBankDashboardUsesAggregations() {
        when(userRepository.findByEmail("bank@demo.com")).thenReturn(Optional.of(bankUser));
        setupBaseCommonMocks();

        when(propertyRepository.countByStatus(PropertyStatus.UNDER_REVIEW)).thenReturn(126L);
        when(propertyRepository.countByStatus(PropertyStatus.VERIFIED)).thenReturn(4L);
        when(propertyRepository.countByStatus(PropertyStatus.AVAILABLE)).thenReturn(374L);

        DashboardStatsResponse response = dashboardService.getDashboardStats("bank@demo.com", "BANK");

        assertThat(response).isNotNull();
        assertThat(response.getRole()).isEqualTo("BANK");
        assertThat(response.getTotalLoans()).isEqualTo(504L);
        assertThat(response.getPendingLoans()).isEqualTo(126L);
        assertThat(response.getApprovedLoans()).isEqualTo(378L);
        assertThat(response.getPendingReviews()).isEqualTo(310L);

        verify(propertyRepository, never()).findAll();
        verify(reportRepository, never()).findAll();
    }

    @Test
    @DisplayName("Synthetic SQL dataset integrity: Verifies 500 properties, non-verification, and idempotency")
    void testSyntheticSqlDatasetIntegrity() throws IOException {
        File sqlFile = new File("../db_script/synthetic_500_properties.sql");
        if (!sqlFile.exists()) {
            sqlFile = new File("db_script/synthetic_500_properties.sql");
        }
        assertThat(sqlFile).exists();

        String content = Files.readString(sqlFile.toPath());

        // Check property count
        long propInserts = content.lines()
                .filter(l -> l.contains("INSERT INTO properties") && l.contains("property_code"))
                .count();
        assertThat(propInserts).isEqualTo(500);

        // Check addresses count
        long addrInserts = content.lines()
                .filter(l -> l.contains("INSERT INTO addresses") && l.contains("address_type"))
                .count();
        assertThat(addrInserts).isEqualTo(500);

        // Check listings count
        long listingInserts = content.lines()
                .filter(l -> l.contains("INSERT INTO property_listings") && l.contains("listing_source"))
                .count();
        assertThat(listingInserts).isEqualTo(500);

        // Check reports count
        long reportInserts = content.lines()
                .filter(l -> l.contains("INSERT INTO due_diligence_reports") && l.contains("report_name"))
                .count();
        assertThat(reportInserts).isEqualTo(100);

        // Check that synthetic demonstration label is present everywhere
        long demoLabels = content.lines()
                .filter(l -> l.contains("[Demonstration Asset]"))
                .count();
        assertThat(demoLabels).isEqualTo(500);

        // Check that NO synthetic property is marked as VERIFIED
        boolean hasVerifiedSynthetic = content.lines()
                .anyMatch(l -> l.contains("SYN-") && l.contains("'VERIFIED'"));
        assertThat(hasVerifiedSynthetic).isFalse();

        // Check idempotency syntax
        assertThat(content).contains("ON CONFLICT (property_code) DO NOTHING;");
        assertThat(content).contains("NOT EXISTS (SELECT 1 FROM addresses");
        assertThat(content).contains("NOT EXISTS (SELECT 1 FROM property_listings");
        assertThat(content).contains("NOT EXISTS (SELECT 1 FROM due_diligence_reports");
    }
}
