package com.proj.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.dto.TeamSummaryDTO;
import com.proj.dto.TimesheetRowDTO;
import com.proj.entity.Attendance;
import com.proj.entity.AttendanceStatus;
import com.proj.entity.Employee;
import com.proj.repository.AttendanceRepository;
import com.proj.repository.EmpRepository;
import com.proj.repository.HrRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TimesheetServiceImpl implements TimesheetService {

    private final AttendanceRepository attendanceRepository;
    private final EmpRepository empRepository;
    private final HrRepository hrRepository;

    @Override
    public List<TimesheetRowDTO> getEmployeeTimesheet(Long empId, LocalDate startDate, LocalDate endDate, String statusFilter) {

        List<Attendance> records;

        if (statusFilter != null && !statusFilter.isBlank()) {
            AttendanceStatus status = mapStatusFilter(statusFilter);
            records = attendanceRepository.findByEmployee_EmpIdAndAttendanceDateBetweenAndStatus(empId, startDate, endDate,
                    status);
        } else {
            records = attendanceRepository.findByEmployee_EmpIdAndAttendanceDateBetween(empId, startDate, endDate);
        }

        return records.stream()
                .sorted(Comparator.comparing(Attendance::getAttendanceDate).reversed())
                .map(this::toRow)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimesheetRowDTO> getTeamTimesheet(Long hrId, LocalDate startDate, LocalDate endDate, String statusFilter,
            Long empIdFilter) {

        List<Attendance> records;

        if (statusFilter != null && !statusFilter.isBlank()) {
            AttendanceStatus status = mapStatusFilter(statusFilter);
            records = attendanceRepository.findByHr_HrIdAndAttendanceDateBetweenAndStatus(hrId, startDate, endDate,
                    status);
        } else {
            records = attendanceRepository.findByHr_HrIdAndAttendanceDateBetween(hrId, startDate, endDate);
        }

        return records.stream()
                .filter(a -> empIdFilter == null || a.getEmployee().getEmpId().equals(empIdFilter))
                .sorted(Comparator.comparing(Attendance::getAttendanceDate).reversed()
                        .thenComparing(a -> a.getEmployee().getEmp_name()))
                .map(this::toRow)
                .collect(Collectors.toList());
    }

    @Override
    public TeamSummaryDTO getTeamSummary(Long hrId, LocalDate date) {

        // Total team size based on employees mapped to HR
        long totalTeam = empRepository.findAll().stream()
                .filter(e -> e.getHr() != null && e.getHr().getHrId().equals(hrId))
                .count();

        List<Attendance> records = attendanceRepository.findByHr_HrIdAndAttendanceDateBetween(hrId, date, date);

        long present = 0;
        long absent = 0;
        long onLeave = 0;
        long lateCount = 0;
        BigDecimal totalHours = BigDecimal.ZERO;

        for (Attendance att : records) {
            AttendanceStatus status = att.getStatus();
            if (status == AttendanceStatus.PRESENT || status == AttendanceStatus.WORK_FROM_HOME
                    || status == AttendanceStatus.HALF_DAY || status == AttendanceStatus.LATE) {
                present++;
            }
            if (status == AttendanceStatus.ABSENT) {
                absent++;
            }
            if (status == AttendanceStatus.LEAVE) {
                onLeave++;
            }
            if (status == AttendanceStatus.LATE) {
                lateCount++;
            }

            if (att.getTotalHours() != null) {
                totalHours = totalHours.add(att.getTotalHours());
            }
        }

        double avgHours = 0;
        if (!records.isEmpty()) {
            avgHours = totalHours.doubleValue() / records.size();
        }

        TeamSummaryDTO summary = new TeamSummaryDTO();
        summary.setTotalTeam(totalTeam);
        summary.setPresent(present);
        summary.setAbsent(absent);
        summary.setOnLeave(onLeave);
        summary.setLateCount(lateCount);
        summary.setAvgHours(Math.round(avgHours * 10.0) / 10.0);

        return summary;
    }

    @Override
    public List<TimesheetRowDTO> getCompanyTimesheet(LocalDate startDate, LocalDate endDate, String statusFilter,
            Long empIdFilter) {

        List<Attendance> records;

        if (statusFilter != null && !statusFilter.isBlank()) {
            AttendanceStatus status = mapStatusFilter(statusFilter);
            // filter by status in-memory after fetching date range
            records = attendanceRepository.findByAttendanceDateBetween(startDate, endDate)
                    .stream()
                    .filter(a -> a.getStatus() == status)
                    .toList();
        } else {
            records = attendanceRepository.findByAttendanceDateBetween(startDate, endDate);
        }

        return records.stream()
                .filter(a -> empIdFilter == null || a.getEmployee().getEmpId().equals(empIdFilter))
                .sorted(Comparator.comparing(Attendance::getAttendanceDate).reversed()
                        .thenComparing(a -> a.getEmployee().getEmp_name()))
                .map(this::toRow)
                .collect(Collectors.toList());
    }

    private TimesheetRowDTO toRow(Attendance attendance) {
        TimesheetRowDTO dto = new TimesheetRowDTO();
        Employee emp = attendance.getEmployee();

        dto.setEmpId(emp.getEmpId());
        dto.setEmpName(emp.getEmp_name());

        if (attendance.getHr() != null) {
            dto.setHrId(attendance.getHr().getHrId());
            dto.setHrName(attendance.getHr().getHr_name());
        }

        dto.setDate(attendance.getAttendanceDate());
        dto.setCheckinTime(attendance.getAttendanceTime());
        dto.setCheckoutTime(attendance.getCheckoutTime());
        dto.setWorkingHours(attendance.getTotalHours());
        dto.setStatus(attendance.getStatus() != null ? attendance.getStatus().name() : null);

        return dto;
    }

    /**
     * Map UI status filter labels to underlying AttendanceStatus.
     */
    private AttendanceStatus mapStatusFilter(String filter) {
        String normalized = filter.trim().toUpperCase();

        return switch (normalized) {
            case "ON-TIME", "ON_TIME", "PRESENT" -> AttendanceStatus.PRESENT;
            case "LATE" -> AttendanceStatus.LATE;
            case "HALF DAY", "HALF_DAY" -> AttendanceStatus.HALF_DAY;
            case "ABSENT" -> AttendanceStatus.ABSENT;
            case "WFH", "WORK_FROM_HOME" -> AttendanceStatus.WORK_FROM_HOME;
            case "LEAVE" -> AttendanceStatus.LEAVE;
            default -> AttendanceStatus.PRESENT;
        };
    }
}

