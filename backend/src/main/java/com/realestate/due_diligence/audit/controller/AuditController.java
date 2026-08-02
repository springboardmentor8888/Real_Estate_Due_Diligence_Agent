package com.realestate.due_diligence.audit.controller;

import com.realestate.due_diligence.audit.AuditAction;
import com.realestate.due_diligence.audit.AuditLog;
import com.realestate.due_diligence.audit.AuditModule;
import com.realestate.due_diligence.audit.dto.AuditLogResponse;
import com.realestate.due_diligence.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<AuditLog> saveAuditLog(
            @RequestBody AuditLog auditLog) {

        return ResponseEntity.ok(auditService.saveAuditLog(auditLog));
    }

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAllLogs() {
        return ResponseEntity.ok(auditService.getAllLogs());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByUser(
            @PathVariable String username) {

        return ResponseEntity.ok(auditService.getLogsByUser(username));
    }

    @GetMapping("/module/{module}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByModule(
            @PathVariable AuditModule module) {

        return ResponseEntity.ok(auditService.getLogsByModule(module));
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByAction(
            @PathVariable AuditAction action) {

        return ResponseEntity.ok(auditService.getLogsByAction(action));
    }

    @GetMapping("/api")
    public ResponseEntity<List<AuditLogResponse>> getLogsByApi(
            @RequestParam String apiEndpoint) {

        return ResponseEntity.ok(auditService.getLogsByApi(apiEndpoint));
    }

    @GetMapping("/report")
    public ResponseEntity<List<AuditLogResponse>> getLogsByReport(
            @RequestParam String reportName) {

        return ResponseEntity.ok(auditService.getLogsByReport(reportName));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AuditLogResponse>> getLogsByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end) {

        return ResponseEntity.ok(
                auditService.getLogsByDateRange(start, end));
    }
}
