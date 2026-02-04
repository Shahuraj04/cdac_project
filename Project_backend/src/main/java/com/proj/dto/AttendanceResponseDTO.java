package com.proj.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.proj.entity.AttendanceStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceResponseDTO {

    private Long attendanceId;
    private LocalDate attendanceDate;
    private AttendanceStatus status;

    private Long empId;
    private String empName;
    private String empDesignation;
    private LocalTime attendanceTime;

    private LocalTime checkoutTime;

    private BigDecimal totalHours;
}
