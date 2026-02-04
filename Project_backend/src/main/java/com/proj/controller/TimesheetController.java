package com.proj.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proj.dto.TeamSummaryDTO;
import com.proj.dto.TimesheetRowDTO;
import com.proj.service.TimesheetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/timesheet")
@RequiredArgsConstructor
public class TimesheetController {

    private final TimesheetService timesheetService;

    @GetMapping("/employee/{empId}")
    public ResponseEntity<List<TimesheetRowDTO>> getEmployeeTimesheet(
            @PathVariable Long empId,
            @RequestParam("start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "status", required = false) String status) {

        List<TimesheetRowDTO> rows = timesheetService.getEmployeeTimesheet(empId, startDate, endDate,
                status != null && !status.isBlank() ? status : null);
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/team/{hrId}")
    public ResponseEntity<List<TimesheetRowDTO>> getTeamTimesheet(
            @PathVariable Long hrId,
            @RequestParam("start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "emp_id", required = false) Long empIdFilter) {

        List<TimesheetRowDTO> rows = timesheetService.getTeamTimesheet(hrId, startDate, endDate,
                status != null && !status.isBlank() ? status : null,
                empIdFilter);
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/team/summary/{hrId}")
    public ResponseEntity<TeamSummaryDTO> getTeamSummary(
            @PathVariable Long hrId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        TeamSummaryDTO summary = timesheetService.getTeamSummary(hrId, date);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> exportEmployeeTimesheetCsv(@RequestBody ExportEmployeeTimesheetRequest request) {
        List<TimesheetRowDTO> rows = timesheetService.getEmployeeTimesheet(
                request.getEmpId(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus());

        String csv = buildCsv(rows);
        return buildCsvResponse(csv, "timesheet_employee.csv");
    }

    @PostMapping("/team/export")
    public ResponseEntity<byte[]> exportTeamTimesheetCsv(@RequestBody ExportTeamTimesheetRequest request) {
        List<TimesheetRowDTO> rows = timesheetService.getTeamTimesheet(
                request.getHrId(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus(),
                null);

        String csv = buildCsv(rows);
        return buildCsvResponse(csv, "timesheet_team.csv");
    }

    @GetMapping("/company")
    public ResponseEntity<List<TimesheetRowDTO>> getCompanyTimesheet(
            @RequestParam("start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "emp_id", required = false) Long empIdFilter) {

        List<TimesheetRowDTO> rows = timesheetService.getCompanyTimesheet(
                startDate,
                endDate,
                status != null && !status.isBlank() ? status : null,
                empIdFilter);
        return ResponseEntity.ok(rows);
    }

    @PostMapping("/company/export")
    public ResponseEntity<byte[]> exportCompanyTimesheetCsv(@RequestBody ExportCompanyTimesheetRequest request) {
        List<TimesheetRowDTO> rows = timesheetService.getCompanyTimesheet(
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus(),
                null);

        String csv = buildCsv(rows);
        return buildCsvResponse(csv, "timesheet_company.csv");
    }

    private String buildCsv(List<TimesheetRowDTO> rows) {
        String header = "Employee ID,Employee Name,Reporting HR,Date,Check-in Time,Checkout Time,Working Hours,Status";

        return rows.stream()
                .map(row -> String.join(",",
                        safe(row.getEmpId()),
                        safe(row.getEmpName()),
                        safe(row.getHrId()),
                        safe(row.getDate()),
                        safeTime(row.getCheckinTime()),
                        safeTime(row.getCheckoutTime()),
                        safe(row.getWorkingHours()),
                        safe(row.getStatus())))
                .collect(Collectors.joining("\n", header + "\n", ""));
    }

    private ResponseEntity<byte[]> buildCsvResponse(String csv, String filename) {
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(bytes);
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String safeTime(java.time.LocalTime time) {
        if (time == null) {
            return "";
        }
        return time.toString();
    }

    // ====== Request payloads for export endpoints ======

    public static class ExportEmployeeTimesheetRequest {
        private Long empId;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate startDate;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate endDate;
        private String status;

        public Long getEmpId() {
            return empId;
        }

        public void setEmpId(Long empId) {
            this.empId = empId;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ExportTeamTimesheetRequest {
        private Long hrId;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate startDate;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate endDate;
        private String status;

        public Long getHrId() {
            return hrId;
        }

        public void setHrId(Long hrId) {
            this.hrId = hrId;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ExportCompanyTimesheetRequest {
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate startDate;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate endDate;
        private String status;

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}

