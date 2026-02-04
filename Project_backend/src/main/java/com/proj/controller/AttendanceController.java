package com.proj.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.AttendanceRequestDTO;
import com.proj.dto.AttendanceResponseDTO;
import com.proj.dto.AttendanceSummaryDTO;
import com.proj.dto.CheckoutRequestDTO;
import com.proj.dto.TodayAttendanceStatusDTO;
import com.proj.security.UserPrincipal;
import com.proj.service.AttendanceService;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    /* HR marks attendance */
    @PostMapping
    public ResponseEntity<AttendanceResponseDTO> markAttendance(@RequestBody AttendanceRequestDTO dto) {
        AttendanceResponseDTO response = attendanceService.markAttendance(dto);
        return ResponseEntity.ok(response);
    }

    /* Employee views attendance */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendance(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByEmployee(employeeId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<AttendanceResponseDTO> checkout(@RequestBody CheckoutRequestDTO dto) {
        AttendanceResponseDTO response = attendanceService.checkout(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/today/{empId}")
    public ResponseEntity<TodayAttendanceStatusDTO> getTodayStatus(@PathVariable Long empId) {
        TodayAttendanceStatusDTO status = attendanceService.getTodayStatus(empId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/summary/{empId}")
    public ResponseEntity<AttendanceSummaryDTO> getMonthlySummary(
            @PathVariable Long empId,
            @RequestParam int month,
            @RequestParam int year) {

        AttendanceSummaryDTO summary = attendanceService.getMonthlySummary(empId, month, year);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AttendanceResponseDTO>> getRecentAttendance(
            org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            if (principal.getUserRole().name().equals("ROLE_HR")
                    || principal.getUserRole().name().equals("ROLE_ADMIN")) {
                return ResponseEntity.ok(attendanceService.getRecentAttendanceByUserId(principal.getUserId()));
            }
        }
        return ResponseEntity.ok(attendanceService.getRecentAttendance());
    }
}
