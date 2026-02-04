package com.proj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.LeaveApplyRequestDTO;
import com.proj.dto.LeaveCategoryDTO;
import com.proj.dto.LeaveResponseDTO;
import com.proj.entity.LeaveStatus;

import java.util.List;
import com.proj.repository.HrRepository;
import com.proj.service.LeaveService;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private HrRepository hrRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<LeaveCategoryDTO>> getLeaveCategories() {
        List<LeaveCategoryDTO> categories = List.of(
                new LeaveCategoryDTO("SICK", "Sick Leave", "For illness or medical appointments", 12, true),
                new LeaveCategoryDTO("CASUAL", "Casual Leave", "For personal work or short breaks", 12, false),
                new LeaveCategoryDTO("ANNUAL", "Annual Leave", "Planned vacation or holiday", 21, false),
                new LeaveCategoryDTO("WFH", "Work From Home", "Work remotely from home", 30, false),
                new LeaveCategoryDTO("UNPAID", "Unpaid Leave", "Leave without pay", null, false),
                new LeaveCategoryDTO("MATERNITY", "Maternity Leave", "For expectant mothers", 180, true),
                new LeaveCategoryDTO("PATERNITY", "Paternity Leave", "For new fathers", 15, false),
                new LeaveCategoryDTO("BEREAVEMENT", "Bereavement Leave", "For family loss", 5, false),
                new LeaveCategoryDTO("COMP_OFF", "Compensatory Off", "For working on holidays/overtime", 10, false),
                new LeaveCategoryDTO("STUDY", "Study Leave", "For educational purposes or exams", 10, false)
        );
        return ResponseEntity.ok(categories);
    }

    /* Employee applies for leave */
    @PostMapping
    public ResponseEntity<LeaveResponseDTO> applyLeave(
            @RequestBody LeaveApplyRequestDTO dto) {

        return ResponseEntity.ok(leaveService.applyLeave(dto));
    }

    @GetMapping("/pendingcount")
    public ResponseEntity<?> getpendingLeaveCount() {
        return ResponseEntity.ok(leaveService.leavecount());
    }

    @GetMapping("/approvedcount")
    public ResponseEntity<?> getApprovedLeaveCount(@RequestParam LeaveStatus status) {
        return ResponseEntity.ok(leaveService.approvedleavecount(status));
    }

    /* HR approves / rejects */
    @PutMapping("/{leaveId}/status")
    public ResponseEntity<LeaveResponseDTO> updateStatus(
            @PathVariable Long leaveId,
            @RequestParam LeaveStatus status,
            @RequestParam Long hrId) {

        return ResponseEntity.ok(
                leaveService.updateLeaveStatus(leaveId, status, hrId));
    }

    @GetMapping("/status")
    public ResponseEntity<java.util.List<LeaveResponseDTO>> getLeavesByStatus(
            @RequestParam LeaveStatus status,
            org.springframework.security.core.Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof com.proj.security.UserPrincipal principal) {
            String role = principal.getUserRole().name();

            // If HR, scope leaves to their direct reports
            if (role.equals("ROLE_HR")) {
                Long userId = principal.getUserId();
                // Resolve HR by userId and use its hrId
                var hrOpt = hrRepository.findByUser_Id(userId);
                if (hrOpt.isPresent()) {
                    Long hrId = hrOpt.get().getHrId();
                    return ResponseEntity.ok(leaveService.getLeavesByHr(hrId, status));
                }
            }
        }

        // Default: global by status (for admin or when no HR context)
        return ResponseEntity.ok(leaveService.getLeavesByStatus(status));
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<java.util.List<LeaveResponseDTO>> getLeavesByEmployee1(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(empId));
    }

    @GetMapping("/department")
    public ResponseEntity<java.util.List<LeaveResponseDTO>> getLeavesByDepartment(
            org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof com.proj.security.UserPrincipal) {
            com.proj.security.UserPrincipal principal = (com.proj.security.UserPrincipal) authentication.getPrincipal();
            if (principal.getDepartmentId() != null) {
                return ResponseEntity.ok(leaveService.getLeavesByDepartment(principal.getDepartmentId()));
            }
        }
        return ResponseEntity.badRequest().build();
    }

    
}
