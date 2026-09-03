package com.realestate.agent;

import com.realestate.agent.dto.ApiProviderRequest;
import com.realestate.agent.entity.ApiProvider;
import com.realestate.agent.exception.BadRequestException;
import com.realestate.agent.mapper.ApiIntegrationMapper;
import com.realestate.agent.repository.ApiLogRepository;
import com.realestate.agent.repository.ApiProviderRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.service.impl.ApiIntegrationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApiIntegrationServiceTest {

    @Mock
    private ApiProviderRepository providerRepository;

    @Mock
    private ApiLogRepository logRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private ApiIntegrationMapper mapper;

    @InjectMocks
    private ApiIntegrationServiceImpl service;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "allowedHosts", "trusted.example.com");
    }

    @Test
    void createProviderRejectsHostOutsideAllowlist() {
        ApiProviderRequest request = ApiProviderRequest.builder()
                .providerName("Unsafe")
                .baseUrl("https://attacker.example.com")
                .build();

        assertThrows(BadRequestException.class, () -> service.createProvider(request));
    }

    @Test
    void createProviderRejectsEmbeddedCredentials() {
        ApiProviderRequest request = ApiProviderRequest.builder()
                .providerName("Unsafe")
                .baseUrl("https://user:password@trusted.example.com")
                .build();

        assertThrows(BadRequestException.class, () -> service.createProvider(request));
    }

    @Test
    void createProviderAcceptsAllowlistedHost() {
        ApiProviderRequest request = ApiProviderRequest.builder()
                .providerName("Trusted")
                .baseUrl("https://trusted.example.com")
                .build();
        when(providerRepository.existsByProviderName("Trusted")).thenReturn(false);

        assertDoesNotThrow(() -> service.createProvider(request));
    }

    @Test
    void callExternalApiRejectsAbsoluteSubEndpoint() {
        ApiProvider provider = ApiProvider.builder()
                .apiProviderId(1L)
                .baseUrl("https://trusted.example.com")
                .isActive(true)
                .build();
        when(providerRepository.findById(1L)).thenReturn(java.util.Optional.of(provider));

        assertThrows(BadRequestException.class,
                () -> service.callExternalApi(1L, null, "https://attacker.example.com"));
    }
}
