package com.realestate.agent.config;

import com.realestate.agent.entity.*;
import com.realestate.agent.enums.AddressType;
import com.realestate.agent.enums.ListingStatus;
import com.realestate.agent.enums.PropertyStatus;
import com.realestate.agent.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class DatabaseDemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PropertyTypeRepository propertyTypeRepository;
    private final RiskCategoryRepository riskCategoryRepository;
    private final PropertyRepository propertyRepository;
    private final AddressRepository addressRepository;
    private final PropertyListingRepository listingRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final DueDiligenceReportRepository reportRepository;
    private final PropertyDocumentRepository documentRepository;
    private final OfferRepository offerRepository;
    private final InquiryRepository inquiryRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Idempotency: only seed if properties table is empty
        if (propertyRepository.count() > 0) {
            log.info("Database already contains properties (count={}). Skipping demo data seeding.",
                    propertyRepository.count());
            return;
        }

        log.info("Seeding realistic demo data across the 5 business roles (BUYER, SELLER, AGENT, LEGAL_REVIEWER, BANK)...");

        // ── 1. Roles ────────────────────────────────────────────────────────────────
        Role buyerRole = getOrCreateRole("BUYER", "Buyer of real estate properties");
        Role sellerRole = getOrCreateRole("SELLER", "Seller / Property Owner");
        Role agentRole = getOrCreateRole("AGENT", "Licensed Real Estate Agent / Broker");
        Role legalRole = getOrCreateRole("LEGAL_REVIEWER", "Legal & Compliance Due Diligence Reviewer");
        Role bankRole = getOrCreateRole("BANK", "Lending Institution / Mortgage Bank");

        // ── 2. Demo Users (one per role, BCrypt-encoded passwords) ─────────────────
        User buyerUser  = getOrCreateUser("buyer@demo.com",  "John",   "Buyer",   "555-0101", buyerRole);
        User sellerUser = getOrCreateUser("seller@demo.com", "Michael","Seller",  "555-0102", sellerRole);
        User agentUser  = getOrCreateUser("agent@demo.com",  "Sarah",  "Agent",   "555-0103", agentRole);
        User legalUser  = getOrCreateUser("legal@demo.com",  "David",  "Counsel", "555-0104", legalRole);
        User bankUser   = getOrCreateUser("bank@demo.com",   "Elena",  "Banker",  "555-0105", bankRole);

        // ── 3. Property Types ────────────────────────────────────────────────────────
        PropertyType residential = getOrCreatePropertyType("Residential",
                "Single and multi-family residential homes");
        PropertyType commercial  = getOrCreatePropertyType("Commercial",
                "Commercial office, retail, and hospitality buildings");
        PropertyType industrial  = getOrCreatePropertyType("Industrial",
                "Warehouses, manufacturing plants, and distribution centers");
        PropertyType mixedUse    = getOrCreatePropertyType("Mixed-Use",
                "Properties combining commercial and residential spaces");

        // ── 4. Risk Categories ───────────────────────────────────────────────────────
        RiskCategory titleRisk      = getOrCreateRiskCategory("Title & Ownership",
                "Title defects, liens, encumbrances, ownership chain validation");
        RiskCategory envRisk        = getOrCreateRiskCategory("Environmental",
                "Phase I/II ESA, contamination, toxic substances, wetlands");
        RiskCategory zoningRisk     = getOrCreateRiskCategory("Zoning & Land Use",
                "Zoning compliance, setbacks, permitted uses, building codes");
        RiskCategory floodRisk      = getOrCreateRiskCategory("Flood & Climate",
                "FEMA flood zone designation, sea-level rise, natural hazards");
        RiskCategory structuralRisk = getOrCreateRiskCategory("Structural & Physical",
                "Foundation, MEP systems, roofing, seismic rating");
        RiskCategory financialRisk  = getOrCreateRiskCategory("Financial & Tax",
                "Tax history, assessed value, NOI capitalization, loan-to-value");

        // ── 5. Properties ────────────────────────────────────────────────────────────
        // Property 1 — 425 Market Street, San Francisco, CA
        Property prop1 = propertyRepository.save(Property.builder()
                .propertyCode("SF-COM-101")
                .propertyName("425 Market Street Plaza")
                .propertyType(commercial)
                .description("Class A commercial office building in San Francisco Financial District.")
                .builtYear(2016)
                .totalArea(new BigDecimal("45000.00"))
                .landArea(new BigDecimal("22000.00"))
                .marketValue(new BigDecimal("24500000.00"))
                .status(PropertyStatus.AVAILABLE)
                .createdBy(agentUser)
                .build());

        addressRepository.save(Address.builder()
                .property(prop1)
                .addressType(AddressType.PHYSICAL)
                .addressLine1("425 Market Street").addressLine2("Suite 1800")
                .city("San Francisco").district("Financial District")
                .state("CA").country("USA").postalCode("94105")
                .latitude(new BigDecimal("37.7915")).longitude(new BigDecimal("-122.3985"))
                .validationStatus(true).build());

        listingRepository.save(PropertyListing.builder()
                .property(prop1).listingSource("Direct Agent Representation")
                .listingUrl("https://brokerage.example.com/listings/SF-COM-101")
                .listingPrice(new BigDecimal("24500000.00"))
                .listingDate(LocalDate.now().minusDays(20))
                .listingStatus(ListingStatus.ACTIVE).build());

        // Property 2 — 1200 Brickell Avenue, Miami, FL
        Property prop2 = propertyRepository.save(Property.builder()
                .propertyCode("MIA-RES-202")
                .propertyName("Brickell Heights Tower Suite 34B")
                .propertyType(residential)
                .description("Luxury waterfront high-rise in Brickell, Miami with panoramic bay views.")
                .builtYear(2020)
                .totalArea(new BigDecimal("2850.00"))
                .landArea(new BigDecimal("1200.00"))
                .marketValue(new BigDecimal("1850000.00"))
                .status(PropertyStatus.UNDER_REVIEW)
                .createdBy(sellerUser)
                .build());

        addressRepository.save(Address.builder()
                .property(prop2)
                .addressType(AddressType.PHYSICAL)
                .addressLine1("1200 Brickell Avenue").addressLine2("Unit 34B")
                .city("Miami").district("Brickell")
                .state("FL").country("USA").postalCode("33131")
                .latitude(new BigDecimal("25.7617")).longitude(new BigDecimal("-80.1918"))
                .validationStatus(true).build());

        listingRepository.save(PropertyListing.builder()
                .property(prop2).listingSource("MLS Luxury Network")
                .listingUrl("https://mls.example.com/listing/MIA-202")
                .listingPrice(new BigDecimal("1850000.00"))
                .listingDate(LocalDate.now().minusDays(15))
                .listingStatus(ListingStatus.ACTIVE).build());

        // Property 3 — 789 Industrial Parkway, Austin, TX
        Property prop3 = propertyRepository.save(Property.builder()
                .propertyCode("ATX-IND-303")
                .propertyName("Austin Tech Logistics Center")
                .propertyType(industrial)
                .description("Modern warehouse distribution center with 12 loading docks, 32-ft clear heights.")
                .builtYear(2022)
                .totalArea(new BigDecimal("85000.00"))
                .landArea(new BigDecimal("150000.00"))
                .marketValue(new BigDecimal("14200000.00"))
                .status(PropertyStatus.VERIFIED)
                .createdBy(sellerUser)
                .build());

        addressRepository.save(Address.builder()
                .property(prop3)
                .addressType(AddressType.PHYSICAL)
                .addressLine1("789 Industrial Parkway")
                .city("Austin").district("Travis County")
                .state("TX").country("USA").postalCode("78744")
                .latitude(new BigDecimal("30.2012")).longitude(new BigDecimal("-97.7431"))
                .validationStatus(true).build());

        listingRepository.save(PropertyListing.builder()
                .property(prop3).listingSource("LoopNet Industrial Network")
                .listingPrice(new BigDecimal("14200000.00"))
                .listingDate(LocalDate.now().minusDays(30))
                .listingStatus(ListingStatus.ACTIVE).build());

        // Property 4 — 100 Main Street, Seattle, WA
        Property prop4 = propertyRepository.save(Property.builder()
                .propertyCode("SEA-MIX-404")
                .propertyName("Pioneer Square Mixed Heritage Building")
                .propertyType(mixedUse)
                .description("Historic mixed-use building: street-level retail, culinary space, and boutique lofts.")
                .builtYear(2018)
                .totalArea(new BigDecimal("32000.00"))
                .landArea(new BigDecimal("18000.00"))
                .marketValue(new BigDecimal("8900000.00"))
                .status(PropertyStatus.UNDER_REVIEW)
                .createdBy(agentUser)
                .build());

        addressRepository.save(Address.builder()
                .property(prop4)
                .addressType(AddressType.PHYSICAL)
                .addressLine1("100 Main Street")
                .city("Seattle").district("Pioneer Square")
                .state("WA").country("USA").postalCode("98104")
                .latitude(new BigDecimal("47.6015")).longitude(new BigDecimal("-122.3332"))
                .validationStatus(true).build());

        listingRepository.save(PropertyListing.builder()
                .property(prop4).listingSource("Pacific Real Estate Brokerage")
                .listingPrice(new BigDecimal("8900000.00"))
                .listingDate(LocalDate.now().minusDays(10))
                .listingStatus(ListingStatus.ACTIVE).build());

        // ── 6. Due Diligence Reports ─────────────────────────────────────────────────
        DueDiligenceReport rep1 = reportRepository.save(DueDiligenceReport.builder()
                .property(prop1).generatedBy(legalUser)
                .reportName("Full Due Diligence Audit - 425 Market Street Plaza")
                .executiveSummary("Comprehensive legal, environmental, and financial assessment completed. Title is clear, Phase I ESA compliant.")
                .overallRiskScore(new BigDecimal("18.50"))
                .reportStatus("COMPLETED")
                .pdfPath("/reports/pdf/SF-COM-101_audit.pdf")
                .build());

        DueDiligenceReport rep2 = reportRepository.save(DueDiligenceReport.builder()
                .property(prop2).generatedBy(legalUser)
                .reportName("Pre-Acquisition Legal & Flood Audit - Brickell Heights")
                .executiveSummary("Property verified in FEMA Zone X. Title clear. HOA reserve analysis in progress.")
                .overallRiskScore(new BigDecimal("24.00"))
                .reportStatus("COMPLETED")
                .pdfPath("/reports/pdf/MIA-RES-202_audit.pdf")
                .build());

        DueDiligenceReport rep3 = reportRepository.save(DueDiligenceReport.builder()
                .property(prop4).generatedBy(legalUser)
                .reportName("Heritage Zoning & Structural Review - Pioneer Square")
                .executiveSummary("Seismic retrofitting documents pending review. Zoning permits verified for mixed usage.")
                .overallRiskScore(new BigDecimal("42.00"))
                .reportStatus("IN_PROGRESS")
                .pdfPath("/reports/pdf/SEA-MIX-404_audit.pdf")
                .build());

        // ── 7. Risk Assessments ──────────────────────────────────────────────────────
        riskAssessmentRepository.save(RiskAssessment.builder()
                .property(prop1).riskCategory(titleRisk).assessedBy(legalUser)
                .riskScore(new BigDecimal("12.00")).riskLevel("LOW")
                .recommendation("Title is clear. Standard title insurance recommended.")
                .assessmentDate(LocalDateTime.now().minusDays(5)).build());

        riskAssessmentRepository.save(RiskAssessment.builder()
                .property(prop1).riskCategory(envRisk).assessedBy(legalUser)
                .riskScore(new BigDecimal("15.00")).riskLevel("LOW")
                .recommendation("Phase I ESA complete. No actionable environmental conditions identified.")
                .assessmentDate(LocalDateTime.now().minusDays(4)).build());

        riskAssessmentRepository.save(RiskAssessment.builder()
                .property(prop2).riskCategory(floodRisk).assessedBy(bankUser)
                .riskScore(new BigDecimal("28.00")).riskLevel("LOW")
                .recommendation("FEMA Zone X designation. Elevation certificate verified above base flood level.")
                .assessmentDate(LocalDateTime.now().minusDays(3)).build());

        riskAssessmentRepository.save(RiskAssessment.builder()
                .property(prop4).riskCategory(structuralRisk).assessedBy(legalUser)
                .riskScore(new BigDecimal("45.00")).riskLevel("MEDIUM")
                .recommendation("Request updated engineering inspection for 2018 seismic upgrade certification.")
                .assessmentDate(LocalDateTime.now().minusDays(2)).build());

        riskAssessmentRepository.save(RiskAssessment.builder()
                .property(prop3).riskCategory(financialRisk).assessedBy(bankUser)
                .riskScore(new BigDecimal("14.00")).riskLevel("LOW")
                .recommendation("LTV ratio within favorable 60% tier. Tenant credit rating AAA.")
                .assessmentDate(LocalDateTime.now().minusDays(1)).build());

        // ── 8. Property Documents ────────────────────────────────────────────────────
        documentRepository.save(PropertyDocument.builder()
                .property(prop1).report(rep1)
                .documentType("TITLE_DEED")
                .documentName("Title_Deed_425_Market_St.pdf")
                .filePath("/documents/properties/SF-COM-101/title_deed.pdf")
                .fileFormat("PDF").uploadedBy(sellerUser).build());

        documentRepository.save(PropertyDocument.builder()
                .property(prop1).report(rep1)
                .documentType("ENVIRONMENTAL_ESA")
                .documentName("Phase_I_ESA_Report.pdf")
                .filePath("/documents/properties/SF-COM-101/phase_1_esa.pdf")
                .fileFormat("PDF").uploadedBy(legalUser).build());

        documentRepository.save(PropertyDocument.builder()
                .property(prop2).report(rep2)
                .documentType("FLOOD_CERTIFICATE")
                .documentName("FEMA_Flood_Zone_Cert_Brickell.pdf")
                .filePath("/documents/properties/MIA-RES-202/flood_cert.pdf")
                .fileFormat("PDF").uploadedBy(agentUser).build());

        documentRepository.save(PropertyDocument.builder()
                .property(prop4).report(rep3)
                .documentType("ZONING_COMPLIANCE")
                .documentName("Pioneer_Square_Zoning_Permit.pdf")
                .filePath("/documents/properties/SEA-MIX-404/zoning_permit.pdf")
                .fileFormat("PDF").uploadedBy(sellerUser).build());

        // ── 9. Buyer Offers ──────────────────────────────────────────────────────────
        offerRepository.save(Offer.builder()
                .buyer(buyerUser).property(prop1)
                .amount(23800000.00).status("PENDING").build());

        offerRepository.save(Offer.builder()
                .buyer(buyerUser).property(prop2)
                .amount(1800000.00).status("ACCEPTED").build());

        // ── 10. Agent Inquiries ──────────────────────────────────────────────────────
        // Inquiry uses senderName/senderEmail fields (no user FK)
        inquiryRepository.save(Inquiry.builder()
                .property(prop1)
                .senderName(buyerUser.getFirstName() + " " + buyerUser.getLastName())
                .senderEmail(buyerUser.getEmail())
                .senderPhone(buyerUser.getPhone())
                .message("We are interested in scheduling a formal due diligence walkthrough this Friday.")
                .status("NEW").build());

        inquiryRepository.save(Inquiry.builder()
                .property(prop2)
                .senderName(buyerUser.getFirstName() + " " + buyerUser.getLastName())
                .senderEmail(buyerUser.getEmail())
                .senderPhone(buyerUser.getPhone())
                .message("Could you provide the latest HOA meeting minutes and reserve fund study?")
                .status("RESPONDED").build());

        // ── 11. Notifications ────────────────────────────────────────────────────────
        notificationRepository.save(Notification.builder()
                .user(buyerUser).property(prop2).report(rep2)
                .notificationType("REPORT")
                .title("Due Diligence Report Ready")
                .message("Complete due diligence report for Brickell Heights Suite 34B has been published.")
                .isRead(false).build());

        notificationRepository.save(Notification.builder()
                .user(buyerUser).property(prop2)
                .notificationType("OFFER")
                .title("Offer Accepted")
                .message("Your purchase offer of $1,800,000 for Brickell Heights Suite 34B was accepted.")
                .isRead(true).build());

        notificationRepository.save(Notification.builder()
                .user(sellerUser).property(prop1)
                .notificationType("OFFER")
                .title("New Purchase Offer Received")
                .message("Buyer John Buyer submitted an offer of $23,800,000 for 425 Market Street Plaza.")
                .isRead(false).build());

        notificationRepository.save(Notification.builder()
                .user(legalUser).property(prop4)
                .notificationType("ALERT")
                .title("Legal Review Requested")
                .message("Pioneer Square Mixed Heritage Building submitted for structural compliance audit.")
                .isRead(false).build());

        notificationRepository.save(Notification.builder()
                .user(bankUser).property(prop3)
                .notificationType("INFO")
                .title("Loan Underwriting Package Complete")
                .message("Financial risk assessment and LTV metrics verified for Austin Tech Logistics Center.")
                .isRead(false).build());

        log.info("DatabaseDemoDataSeeder: Successfully populated PostgreSQL with demo records across all 5 roles!");
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private Role getOrCreateRole(String roleName, String desc) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName(roleName).description(desc).isActive(true).build()));
    }

    private User getOrCreateUser(String email, String first, String last, String phone, Role role) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User u = existing.get();
            if (u.getRole() == null || !role.getRoleId().equals(u.getRole().getRoleId())) {
                u.setRole(role);
                userRepository.save(u);
            }
            return u;
        }
        return userRepository.save(User.builder()
                .firstName(first).lastName(last)
                .email(email).phone(phone)
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(role).isActive(true).emailVerified(true).build());
    }

    private PropertyType getOrCreatePropertyType(String typeName, String desc) {
        return propertyTypeRepository.findByTypeName(typeName)
                .orElseGet(() -> propertyTypeRepository.save(PropertyType.builder()
                        .typeName(typeName).description(desc).isActive(true).build()));
    }

    private RiskCategory getOrCreateRiskCategory(String name, String desc) {
        return riskCategoryRepository.findByCategoryName(name)
                .orElseGet(() -> riskCategoryRepository.save(RiskCategory.builder()
                        .categoryName(name).description(desc).isActive(true).build()));
    }
}
