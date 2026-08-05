package com.infosys.realestate.controller;

import com.infosys.realestate.entity.AuditLog;
import com.infosys.realestate.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    /** GET /api/admin/audit-logs?page=0&size=20 */
    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAllLogs(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getAllLogs(pageable));
    }

    /** GET /api/admin/audit-logs/user/{email} */
    @GetMapping("/user/{email}")
    public ResponseEntity<Page<AuditLog>> getByActor(
            @PathVariable String email,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getLogsByActor(email, pageable));
    }

    /** GET /api/admin/audit-logs/action/{action} */
    @GetMapping("/action/{action}")
    public ResponseEntity<Page<AuditLog>> getByAction(
            @PathVariable String action,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getLogsByAction(action, pageable));
    }

    /** GET /api/admin/audit-logs/entity/{type}/{id} */
    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<Page<AuditLog>> getByEntity(
            @PathVariable String type,
            @PathVariable String id,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getLogsByEntity(type, id, pageable));
    }
}
