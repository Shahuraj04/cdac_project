package com.proj.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.proj.entity.AttendanceStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodayAttendanceStatusDTO {

    private LocalDate attendanceDate;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private BigDecimal totalHours;
    private AttendanceStatus status;
}

