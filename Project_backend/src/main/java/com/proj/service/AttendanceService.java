package com.proj.service;

import java.util.List;

import com.proj.dto.AttendanceRequestDTO;
import com.proj.dto.AttendanceResponseDTO;
import com.proj.dto.AttendanceSummaryDTO;
import com.proj.dto.CheckoutRequestDTO;
import com.proj.dto.TodayAttendanceStatusDTO;

public interface AttendanceService {

    AttendanceResponseDTO markAttendance(AttendanceRequestDTO dto);

    List<AttendanceResponseDTO> getAttendanceByEmployee(Long employeeId);

    AttendanceSummaryDTO getMonthlySummary(Long empId, int month, int year);

    AttendanceResponseDTO checkout(CheckoutRequestDTO dto);

    TodayAttendanceStatusDTO getTodayStatus(Long empId);

    List<AttendanceResponseDTO> getRecentAttendance();

    List<AttendanceResponseDTO> getRecentAttendanceByUserId(Long userId);

}
