package com.infosys.realestate.aspect;

import com.infosys.realestate.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditLogService auditLogService;

    // -----------------------------------------------------------------------
    // Due Diligence
    // -----------------------------------------------------------------------

    @AfterReturning("execution(* com.infosys.realestate.controller.DueDiligenceController.processDueDiligence(..))")
    public void afterProcessDueDiligence(JoinPoint jp) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("PROCESS_DUE_DILIGENCE", "DueDiligenceReport", entityId,
                "Due diligence initiated for property #" + entityId, "SUCCESS");
    }

    @AfterThrowing(
            pointcut = "execution(* com.infosys.realestate.controller.DueDiligenceController.processDueDiligence(..))",
            throwing = "ex")
    public void afterProcessDueDiligenceFailed(JoinPoint jp, Throwable ex) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("PROCESS_DUE_DILIGENCE", "DueDiligenceReport", entityId,
                "Due diligence FAILED for property #" + entityId + ": " + ex.getMessage(), "FAILURE");
    }

    @AfterReturning("execution(* com.infosys.realestate.controller.DueDiligenceController.exportPdf(..))")
    public void afterExportPdf(JoinPoint jp) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("EXPORT_PDF", "Property", entityId,
                "PDF report exported for property #" + entityId, "SUCCESS");
    }

    @AfterReturning("execution(* com.infosys.realestate.controller.DueDiligenceController.exportExcel(..))")
    public void afterExportExcel(JoinPoint jp) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("EXPORT_EXCEL", "Property", entityId,
                "Excel report exported for property #" + entityId, "SUCCESS");
    }

    // -----------------------------------------------------------------------
    // Property CRUD
    // -----------------------------------------------------------------------

    @AfterReturning("execution(* com.infosys.realestate.controller.PropertyController.createProperty(..))")
    public void afterCreateProperty(JoinPoint jp) {
        persist("CREATE_PROPERTY", "Property", null, "New property created", "SUCCESS");
    }

    @AfterReturning("execution(* com.infosys.realestate.controller.PropertyController.deleteProperty(..))")
    public void afterDeleteProperty(JoinPoint jp) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("DELETE_PROPERTY", "Property", entityId,
                "Property #" + entityId + " deleted", "SUCCESS");
    }

    // -----------------------------------------------------------------------
    // User management
    // -----------------------------------------------------------------------

    @AfterReturning("execution(* com.infosys.realestate.controller.UserController.deleteUser(..))")
    public void afterDeleteUser(JoinPoint jp) {
        Object[] args = jp.getArgs();
        String entityId = args.length > 0 ? String.valueOf(args[0]) : "?";
        persist("DELETE_USER", "User", entityId,
                "User #" + entityId + " deleted", "SUCCESS");
    }

    // -----------------------------------------------------------------------
    // Auth
    // -----------------------------------------------------------------------

    @AfterReturning("execution(* com.infosys.realestate.controller.AuthController.login(..))")
    public void afterLogin(JoinPoint jp) {
        persist("LOGIN", "User", null, "User login successful", "SUCCESS");
    }

    @AfterThrowing(
            pointcut = "execution(* com.infosys.realestate.controller.AuthController.login(..))",
            throwing = "ex")
    public void afterLoginFailed(JoinPoint jp, Throwable ex) {
        persist("LOGIN", "User", null, "Login attempt failed: " + ex.getMessage(), "FAILURE");
    }

    // -----------------------------------------------------------------------
    // Shared helper
    // -----------------------------------------------------------------------

    private void persist(String action, String entityType, String entityId,
                         String description, String outcome) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String actorEmail = (auth != null && auth.isAuthenticated()) ? auth.getName() : "anonymous";
            String actorRole  = (auth != null && !auth.getAuthorities().isEmpty())
                    ? auth.getAuthorities().iterator().next().getAuthority()
                    : "UNKNOWN";
            String ip = resolveIp();
            auditLogService.log(actorEmail, actorRole, action, entityType, entityId, description, ip, outcome);
        } catch (Exception ignored) {
            // Never let audit logging break the main request flow
        }
    }

    private String resolveIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return "unknown";
            HttpServletRequest request = attrs.getRequest();
            String forwarded = request.getHeader("X-Forwarded-For");
            return (forwarded != null && !forwarded.isEmpty())
                    ? forwarded.split(",")[0].trim()
                    : request.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
