package com.proj.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeePerformanceDTO {

    private String month;           // e.g. "2026-01"
    private long totalDays;
    private long onTimeDays;
    private long lateDays;
    private long wfhDays;
    private BigDecimal avgHours;
}
