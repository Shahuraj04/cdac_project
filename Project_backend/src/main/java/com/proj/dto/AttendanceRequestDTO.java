package com.proj.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.proj.entity.AttendanceStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequestDTO {

    private Long empId;
    private Long hrId;
    private LocalDate attendanceDate;
    private LocalTime attendanceTime; // Add this field
    // private AttendanceStatus status; // Remove, optional
    private AttendanceStatus status;
}
