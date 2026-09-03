package com.realestate.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.agent.dto.DueDiligenceReportRequest;
import com.realestate.agent.entity.Property;
import com.realestate.agent.entity.PropertyType;
import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.repository.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ReportExportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyTypeRepository propertyTypeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DueDiligenceReportRepository reportRepository;

    private Property testProperty;
    private User testAgent;

    @BeforeEach
    void setUp() {
        Role agentRole = roleRepository.findByRoleName("AGENT")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("AGENT").description("Real estate agent").build()));

        testAgent = userRepository.findByEmail("export-test-agent@example.test")
                .orElseGet(() -> userRepository.save(User.builder()
                        .firstName("Test")
                        .lastName("Agent")
                        .email("export-test-agent@example.test")
                        .passwordHash("EncodedPass123!")
                        .role(agentRole)
                        .emailVerified(true)
                        .build()));

        Role buyerRole = roleRepository.findByRoleName("BUYER")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("BUYER").description("Buyer").build()));

        userRepository.findByEmail("buyer@example.test")
                .orElseGet(() -> userRepository.save(User.builder()
                        .firstName("Test")
                        .lastName("Buyer")
                        .email("buyer@example.test")
                        .passwordHash("EncodedPass123!")
                        .role(buyerRole)
                        .emailVerified(true)
                        .build()));

        PropertyType commercial = propertyTypeRepository.findByTypeName("Commercial")
                .orElseGet(() -> propertyTypeRepository.save(PropertyType.builder().typeName("Commercial").build()));

        testProperty = propertyRepository.save(Property.builder()
                .propertyCode("EXP-" + UUID.randomUUID().toString().substring(0, 8))
                .propertyName("Due Diligence Test Plaza")
                .propertyType(commercial)
                .builtYear(2018)
                .totalArea(new BigDecimal("12500.00"))
                .landArea(new BigDecimal("25000.00"))
                .marketValue(new BigDecimal("1500000.00"))
                .createdBy(testAgent)
                .build());
    }

    @Test
    @WithMockUser(username = "export-test-agent@example.test", roles = {"AGENT"})
    void testCreateReportAndExportPdfAndExcel() throws Exception {
        // 1. Create Report
        DueDiligenceReportRequest request = DueDiligenceReportRequest.builder()
                .propertyId(testProperty.getPropertyId())
                .reportName("Plaza Due Diligence Audit")
                .executiveSummary("Comprehensive inspection performed on commercial premises.")
                .overallRiskScore(new BigDecimal("28.50"))
                .reportStatus("COMPLETED")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        assertTrue(responseBody.contains("Plaza Due Diligence Audit"));
        Long reportId = objectMapper.readTree(responseBody).get("reportId").asLong();
        assertNotNull(reportId);

        // 2. Download Report PDF
        MvcResult pdfResult = mockMvc.perform(get("/api/reports/" + reportId + "/pdf"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] pdfBytes = pdfResult.getResponse().getContentAsByteArray();
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500, "PDF byte array should have meaningful size");
        String pdfHeader = new String(pdfBytes, 0, Math.min(8, pdfBytes.length));
        assertTrue(pdfHeader.startsWith("%PDF-"), "Generated file must start with valid PDF magic bytes");

        // 3. Download Property Direct PDF
        MvcResult propPdfResult = mockMvc.perform(get("/api/reports/property/" + testProperty.getPropertyId() + "/pdf"))
                .andExpect(status().isOk())
                .andReturn();
        byte[] propPdfBytes = propPdfResult.getResponse().getContentAsByteArray();
        assertTrue(new String(propPdfBytes, 0, 5).startsWith("%PDF-"));

        // 4. Download Report Excel (.xlsx)
        MvcResult excelResult = mockMvc.perform(get("/api/reports/" + reportId + "/excel"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] excelBytes = excelResult.getResponse().getContentAsByteArray();
        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 1000, "Excel byte array should contain valid OOXML archive");

        // Verify with Apache POI
        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(excelBytes))) {
            assertNotNull(workbook.getSheet("Property Overview"));
            assertNotNull(workbook.getSheet("Risk Assessment"));
            assertNotNull(workbook.getSheet("Market Comparables"));
            assertNotNull(workbook.getSheet("Zoning & Compliance"));
            assertNotNull(workbook.getSheet("Tax History"));
        }

        // 5. Download Property Direct Excel
        MvcResult propExcelResult = mockMvc.perform(get("/api/reports/property/" + testProperty.getPropertyId() + "/excel"))
                .andExpect(status().isOk())
                .andReturn();
        byte[] propExcelBytes = propExcelResult.getResponse().getContentAsByteArray();
        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(propExcelBytes))) {
            assertNotNull(workbook.getSheet("Property Overview"));
        }
    }

    @Test
    @WithMockUser(username = "buyer@example.test", roles = {"BUYER"})
    void testBuyerCanCreateReportAndExport() throws Exception {
        DueDiligenceReportRequest request = DueDiligenceReportRequest.builder()
                .propertyId(testProperty.getPropertyId())
                .reportName("Buyer Diligence Review")
                .reportStatus("COMPLETED")
                .build();

        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "legal@example.test", roles = {"LEGAL_REVIEWER"})
    void testLegalReviewerCanExportPropertyPdf() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/reports/property/" + testProperty.getPropertyId() + "/pdf"))
                .andExpect(status().isOk())
                .andReturn();
        byte[] bytes = result.getResponse().getContentAsByteArray();
        assertTrue(new String(bytes, 0, 5).startsWith("%PDF-"));
    }

    @Test
    @WithMockUser(username = "bank@example.test", roles = {"BANK"})
    void testBankCanExportPropertyExcel() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/reports/property/" + testProperty.getPropertyId() + "/excel"))
                .andExpect(status().isOk())
                .andReturn();
        byte[] bytes = result.getResponse().getContentAsByteArray();
        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            assertNotNull(workbook.getSheet("Property Overview"));
        }
    }

    @Test
    @WithMockUser(username = "buyer@example.test", roles = {"BUYER"})
    void testRiskAssessmentAndComparablesEndpoints() throws Exception {
        // Query risk assessments by property
        mockMvc.perform(get("/api/risk-assessments/property/" + testProperty.getPropertyId()))
                .andExpect(status().isOk());

        // Query market analysis comparables by property
        mockMvc.perform(get("/api/market-analysis/property/" + testProperty.getPropertyId()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "buyer@example.test", roles = {"BUYER"})
    void testNonExistentPropertyReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/reports/property/999999/pdf"))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/reports/property/999999/excel"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUnauthorizedReportCreationRejected() throws Exception {
        DueDiligenceReportRequest request = DueDiligenceReportRequest.builder()
                .propertyId(testProperty.getPropertyId())
                .reportName("Unauth Report")
                .build();

        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
