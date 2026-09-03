package com.realestate.agent;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "BUYER")
    void buyerCannotCreateRiskAssessment() throws Exception {
        mockMvc.perform(post("/api/risk-assessments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"propertyId\":1,\"riskCategoryId\":1,\"riskScore\":20,\"riskLevel\":\"LOW\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void agentCannotCreateBuyerOffer() throws Exception {
        mockMvc.perform(post("/api/buyer/offers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":100000}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void sellerCannotCreateBuyerInquiry() throws Exception {
        mockMvc.perform(post("/api/agent/inquiries/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Interested\"}"))
                .andExpect(status().isForbidden());
    }
}
