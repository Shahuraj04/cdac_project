package com.proj.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {

    private Long leaveId;
    private Long empId;
    private String empName;
    private String leaveCategory;
    private String leaveSubCategory;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalDays;
    private String reason;
    private String status;
    private String rejectionReason;
    private String approvedByName;
}
