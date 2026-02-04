package com.proj.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.dto.AttendanceRequestDTO;
import com.proj.dto.AttendanceResponseDTO;
import com.proj.dto.AttendanceSummaryDTO;
import com.proj.dto.CheckoutRequestDTO;
import com.proj.dto.TodayAttendanceStatusDTO;
import com.proj.entity.Attendance;
import com.proj.entity.AttendanceStatus;
import com.proj.entity.Employee;
import com.proj.repository.AttendanceRepository;
import com.proj.repository.EmpRepository;
import com.proj.repository.HrRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmpRepository employeeRepository;
    private final HrRepository hrRepository;
    private final ModelMapper modelMapper;

    // ================= MARK ATTENDANCE =================
    @Override
    public AttendanceResponseDTO markAttendance(AttendanceRequestDTO dto) {

        // Prevent future attendance
        if (dto.getAttendanceDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Future attendance is not allowed");
        }

        // Duplicate check
        boolean exists = attendanceRepository
                .existsByEmployee_EmpIdAndAttendanceDate(
                        dto.getEmpId(),
                        dto.getAttendanceDate());

        if (exists) {
            throw new RuntimeException("Attendance already marked for this date");
        }

        Attendance attendance = new Attendance();
        attendance.setAttendanceDate(dto.getAttendanceDate());
        Employee emp = employeeRepository.findById(java.util.Objects.requireNonNull(dto.getEmpId()))
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        attendance.setEmployee(emp);

        if (dto.getHrId() != null) {
            attendance.setHr(
                    hrRepository.findById(java.util.Objects.requireNonNull(dto.getHrId()))
                            .orElseThrow(() -> new RuntimeException("HR not found")));
        } else {
            // Fallback to employee's assigned HR to avoid DB null constraint if schema
            // hasn't updated
            attendance.setHr(emp.getHr());
        }
        attendance.setAttendanceTime(dto.getAttendanceTime());
        // Calculate final status
        AttendanceStatus finalStatus = calculateAttendanceStatus(dto.getStatus(), dto.getAttendanceTime());

        attendance.setStatus(finalStatus);

        Attendance saved = attendanceRepository.save(attendance);

        AttendanceResponseDTO response = modelMapper.map(saved, AttendanceResponseDTO.class);

        response.setEmpId(saved.getEmployee().getEmpId());
        response.setEmpName(saved.getEmployee().getEmp_name());
        response.setEmpDesignation(saved.getEmployee().getDesignation());
        response.setAttendanceTime(saved.getAttendanceTime());

        return response;
    }

    @Override
    public AttendanceResponseDTO checkout(CheckoutRequestDTO dto) {

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByEmployee_EmpIdAndAttendanceDate(dto.getEmpId(), today)
                .orElseThrow(() -> new RuntimeException("No attendance record found for today"));

        if (attendance.getAttendanceTime() == null) {
            throw new RuntimeException("Employee has not checked in today");
        }

        if (attendance.getCheckoutTime() != null) {
            throw new RuntimeException("Employee has already checked out for today");
        }

        LocalTime checkoutTime = dto.getCheckoutTime() != null ? dto.getCheckoutTime() : LocalTime.now();

        if (checkoutTime.isBefore(attendance.getAttendanceTime())) {
            throw new RuntimeException("Checkout time cannot be before check-in time");
        }

        Duration duration = Duration.between(attendance.getAttendanceTime(), checkoutTime);
        double hours = duration.toMinutes() / 60.0;

        if (hours < 1.0) {
            throw new RuntimeException("Minimum work duration of 1 hour is required before checkout");
        }

        BigDecimal totalHours = BigDecimal.valueOf(hours).setScale(2, java.math.RoundingMode.HALF_UP);

        attendance.setCheckoutTime(checkoutTime);
        attendance.setTotalHours(totalHours);

        // Update attendance status based on total hours
        AttendanceStatus finalStatusBasedOnHours;
        if (hours < 4.0) {
            finalStatusBasedOnHours = AttendanceStatus.HALF_DAY;
        } else {
            // 4-8 and >8 both considered full day present in current model
            finalStatusBasedOnHours = AttendanceStatus.PRESENT;
        }

        attendance.setStatus(finalStatusBasedOnHours);

        Attendance saved = attendanceRepository.save(attendance);

        AttendanceResponseDTO response = modelMapper.map(saved, AttendanceResponseDTO.class);
        response.setEmpId(saved.getEmployee().getEmpId());
        response.setEmpName(saved.getEmployee().getEmp_name());
        response.setEmpDesignation(saved.getEmployee().getDesignation());
        response.setAttendanceTime(saved.getAttendanceTime());
        response.setCheckoutTime(saved.getCheckoutTime());
        response.setTotalHours(saved.getTotalHours());

        return response;
    }

    @Override
    public TodayAttendanceStatusDTO getTodayStatus(Long empId) {
        LocalDate today = LocalDate.now();

        return attendanceRepository.findByEmployee_EmpIdAndAttendanceDate(empId, today)
                .map(att -> {
                    TodayAttendanceStatusDTO dto = new TodayAttendanceStatusDTO();
                    dto.setAttendanceDate(att.getAttendanceDate());
                    dto.setCheckinTime(att.getAttendanceTime());
                    dto.setCheckoutTime(att.getCheckoutTime());
                    dto.setTotalHours(att.getTotalHours());
                    dto.setStatus(att.getStatus());
                    return dto;
                })
                .orElse(null);
    }

    // ================= VIEW ATTENDANCE =================
    @Override
    public List<AttendanceResponseDTO> getAttendanceByEmployee(Long employeeId) {

        return attendanceRepository.findByEmployee_EmpId(employeeId)
                .stream()
                .map(att -> {
                    AttendanceResponseDTO dto = modelMapper.map(att, AttendanceResponseDTO.class);
                    dto.setEmpId(att.getEmployee().getEmpId());
                    dto.setEmpName(att.getEmployee().getEmp_name());
                    dto.setEmpDesignation(att.getEmployee().getDesignation());
                    dto.setAttendanceTime(att.getAttendanceTime());
                    return dto;
                })
                .toList();
    }

    // ================= MONTHLY SUMMARY =================
    @Override
    public AttendanceSummaryDTO getMonthlySummary(Long empId, int month, int year) {

        var employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Object[]> data = attendanceRepository.getMonthlyAttendanceSummary(empId, month, year);

        long present = 0, absent = 0, half = 0, leave = 0, holiday = 0;

        for (Object[] row : data) {
            AttendanceStatus status = (AttendanceStatus) row[0];
            long count = (long) row[1];

            switch (status) {
                case PRESENT, WORK_FROM_HOME -> present += count;
                case HALF_DAY, LATE -> half += count;
                case ABSENT -> absent += count;
                case LEAVE -> leave += count;
                case HOLIDAY -> holiday += count;
            }
        }

        int totalDays = (int) (present + absent + half + leave + holiday);
        double workingDays = totalDays - holiday;

        double earnedDays = present + (half * 0.5);
        double percentage = workingDays == 0 ? 0 : (earnedDays / workingDays) * 100;

        AttendanceSummaryDTO summary = new AttendanceSummaryDTO();
        summary.setEmpId(empId);
        summary.setEmpName(employee.getEmp_name());
        summary.setTotalDays(totalDays);
        summary.setPresentDays(present);
        summary.setAbsentDays(absent);
        summary.setHalfDays(half);
        summary.setLeaveDays(leave);
        summary.setAttendancePercentage(
                Math.round(percentage * 100.0) / 100.0);

        return summary;
    }

    // ================= CORE BUSINESS LOGIC =================
    private AttendanceStatus calculateAttendanceStatus(
            AttendanceStatus requestedStatus,
            LocalTime attendanceTime) {

        // Explicit HR-marked statuses
        if (requestedStatus == AttendanceStatus.WORK_FROM_HOME ||
                requestedStatus == AttendanceStatus.LEAVE ||
                requestedStatus == AttendanceStatus.HOLIDAY ||
                requestedStatus == AttendanceStatus.ABSENT) {
            return requestedStatus;
        }

        // If time not provided → default PRESENT
        if (attendanceTime == null) {
            return AttendanceStatus.PRESENT;
        }

        // Time-based rules
        if (attendanceTime.isAfter(LocalTime.of(13, 0))) {
            return AttendanceStatus.HALF_DAY;
        }

        if (attendanceTime.isAfter(LocalTime.of(10, 0))) {
            return AttendanceStatus.LATE;
        }

        return AttendanceStatus.PRESENT;
    }

    @Override
    public List<AttendanceResponseDTO> getRecentAttendance() {
        return attendanceRepository.findTop10ByOrderByAttendanceDateDesc()
                .stream()
                .map(att -> {
                    AttendanceResponseDTO dto = modelMapper.map(att, AttendanceResponseDTO.class);
                    dto.setEmpId(att.getEmployee().getEmpId());
                    dto.setEmpName(att.getEmployee().getEmp_name());
                    dto.setEmpDesignation(att.getEmployee().getDesignation());
                    dto.setAttendanceTime(att.getAttendanceTime());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<AttendanceResponseDTO> getRecentAttendanceByUserId(Long userId) {
        return hrRepository.findByUser_Id(userId)
                .map(hr -> attendanceRepository.findTop10ByHr_HrIdOrderByAttendanceDateDesc(hr.getHrId())
                        .stream()
                        .map(att -> {
                            AttendanceResponseDTO dto = modelMapper.map(att, AttendanceResponseDTO.class);
                            dto.setEmpId(att.getEmployee().getEmpId());
                            dto.setEmpName(att.getEmployee().getEmp_name());
                            dto.setEmpDesignation(att.getEmployee().getDesignation());
                            dto.setAttendanceTime(att.getAttendanceTime());
                            return dto;
                        })
                        .toList())
                .orElse(java.util.Collections.emptyList());
    }
}
