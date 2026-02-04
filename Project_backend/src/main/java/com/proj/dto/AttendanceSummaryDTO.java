package com.proj.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceSummaryDTO {

    private Long empId;
    private String empName;

    private int totalDays;
    private long presentDays;
    private long absentDays;
    private long halfDays;
    private long leaveDays;

    private double attendancePercentage;
}
